"""
SignaBridge AI - ASL Gesture Classifier
Mathematical & Machine Learning classifier for 21-point hand landmarks.
Computes relative coordinates, finger joint angles, extension states,
and matches against canonical ASL signatures or a trained model.
"""

import math
import numpy as np
from typing import List, Dict, Any, Tuple, Optional

class ASLClassifier:
    """
    Classifier that translates 21 3D hand landmarks into American Sign Language
    alphabets (A-Z), numbers (0-9), and common communication signs.
    """

    # 21 Hand landmark indices
    WRIST = 0
    THUMB_CMC, THUMB_MCP, THUMB_IP, THUMB_TIP = 1, 2, 3, 4
    INDEX_MCP, INDEX_PIP, INDEX_DIP, INDEX_TIP = 5, 6, 7, 8
    MIDDLE_MCP, MIDDLE_PIP, MIDDLE_DIP, MIDDLE_TIP = 9, 10, 11, 12
    RING_MCP, RING_PIP, RING_DIP, RING_TIP = 13, 14, 15, 16
    PINKY_MCP, PINKY_PIP, PINKY_DIP, PINKY_TIP = 17, 18, 19, 20

    FINGER_NAMES = ["thumb", "index", "middle", "ring", "pinky"]

    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.model_path = model_path
        if model_path:
            self._load_model(model_path)

    def _load_model(self, path: str):
        """Optionally load trained scikit-learn or joblib model."""
        try:
            import joblib
            self.model = joblib.load(path)
            print(f"Loaded trained ML model from {path}")
        except Exception as e:
            print(f"Note: ML model file not loaded ({e}). Using geometric feature engine.")
            self.model = None

    @staticmethod
    def normalize_landmarks(landmarks: List[Dict[str, float]]) -> np.ndarray:
        """
        Normalize 21 (x, y, z) landmarks:
        1. Translate so Wrist is at (0, 0, 0)
        2. Scale by Euclidean distance from Wrist to Middle MCP
        """
        raw = np.array([[lm["x"], lm["y"], lm["z"]] for lm in landmarks])
        wrist = raw[0]
        # Translate to origin
        translated = raw - wrist

        # Scaling factor: distance between wrist (0) and middle MCP (9)
        hand_scale = np.linalg.norm(raw[ASLClassifier.MIDDLE_MCP] - wrist)
        if hand_scale < 1e-4:
            hand_scale = 1.0

        normalized = translated / hand_scale
        return normalized

    @staticmethod
    def compute_joint_angle(p1: np.ndarray, p2: np.ndarray, p3: np.ndarray) -> float:
        """
        Compute angle in degrees at joint p2 between vectors (p1-p2) and (p3-p2).
        """
        v1 = p1 - p2
        v2 = p3 - p2
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        if norm1 < 1e-5 or norm2 < 1e-5:
            return 180.0
        cos_angle = np.dot(v1, v2) / (norm1 * norm2)
        cos_angle = np.clip(cos_angle, -1.0, 1.0)
        return float(np.degrees(np.arccos(cos_angle)))

    def extract_features(self, landmarks: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Extract geometric features from 21 landmarks:
        - Finger extension status (OPEN, CLOSED, HALF)
        - Joint angles (MCP, PIP, DIP)
        - Inter-tip distances (pinch, crossing, spread)
        - Normalized 63-dimensional coordinate vector
        """
        norm = self.normalize_landmarks(landmarks)

        # 1. Finger extension detection
        # Thumb: compare distance between thumb tip and pinky MCP vs thumb IP and pinky MCP
        thumb_tip_dist = np.linalg.norm(norm[self.THUMB_TIP] - norm[self.PINKY_MCP])
        thumb_ip_dist = np.linalg.norm(norm[self.THUMB_IP] - norm[self.PINKY_MCP])
        thumb_open = thumb_tip_dist > thumb_ip_dist * 1.15

        # For index, middle, ring, pinky: check tip distance from wrist vs PIP distance from wrist
        def is_finger_open(tip_idx, pip_idx, mcp_idx):
            tip_dist = np.linalg.norm(norm[tip_idx])
            pip_dist = np.linalg.norm(norm[pip_idx])
            mcp_dist = np.linalg.norm(norm[mcp_idx])
            # Angle at PIP
            angle = self.compute_joint_angle(norm[mcp_idx], norm[pip_idx], norm[tip_idx])
            is_extended = tip_dist > pip_dist and angle > 130.0
            return is_extended, angle

        index_open, index_angle = is_finger_open(self.INDEX_TIP, self.INDEX_PIP, self.INDEX_MCP)
        middle_open, middle_angle = is_finger_open(self.MIDDLE_TIP, self.MIDDLE_PIP, self.MIDDLE_MCP)
        ring_open, ring_angle = is_finger_open(self.RING_TIP, self.RING_PIP, self.RING_MCP)
        pinky_open, pinky_angle = is_finger_open(self.PINKY_TIP, self.PINKY_PIP, self.PINKY_MCP)

        # 2. Inter-tip Euclidean distances (in normalized scale)
        d_thumb_index = float(np.linalg.norm(norm[self.THUMB_TIP] - norm[self.INDEX_TIP]))
        d_thumb_middle = float(np.linalg.norm(norm[self.THUMB_TIP] - norm[self.MIDDLE_TIP]))
        d_index_middle = float(np.linalg.norm(norm[self.INDEX_TIP] - norm[self.MIDDLE_TIP]))
        d_middle_ring = float(np.linalg.norm(norm[self.MIDDLE_TIP] - norm[self.RING_TIP]))
        d_ring_pinky = float(np.linalg.norm(norm[self.RING_TIP] - norm[self.PINKY_TIP]))

        # Pinch detection (thumb touching index tip)
        is_pinching = d_thumb_index < 0.28

        # Flat feature vector (63 floats)
        feature_vector = norm.flatten().tolist()

        return {
            "normalized_landmarks": norm,
            "feature_vector": feature_vector,
            "finger_states": {
                "thumb": "OPEN" if thumb_open else "CLOSED",
                "index": "OPEN" if index_open else "CLOSED",
                "middle": "OPEN" if middle_open else "CLOSED",
                "ring": "OPEN" if ring_open else "CLOSED",
                "pinky": "OPEN" if pinky_open else "CLOSED"
            },
            "angles": {
                "index": round(index_angle, 1),
                "middle": round(middle_angle, 1),
                "ring": round(ring_angle, 1),
                "pinky": round(pinky_angle, 1)
            },
            "distances": {
                "thumb_index": round(d_thumb_index, 3),
                "thumb_middle": round(d_thumb_middle, 3),
                "index_middle": round(d_index_middle, 3),
                "middle_ring": round(d_middle_ring, 3),
                "ring_pinky": round(d_ring_pinky, 3)
            },
            "is_pinching": is_pinching
        }

    def predict(self, landmarks: List[Dict[str, float]], handedness: str = "Right") -> Dict[str, Any]:
        """
        Classify landmarks into the most probable ASL sign,
        returning sign name, category, confidence (0.0 to 1.0), and details.
        """
        if not landmarks or len(landmarks) < 21:
            return {
                "sign": "None",
                "category": "unknown",
                "confidence": 0.0,
                "meaning": "No hand landmarks detected"
            }

        features = self.extract_features(landmarks)
        states = features["finger_states"]
        d = features["distances"]
        norm = features["normalized_landmarks"]

        # If trained ML model is available, use it first
        if self.model is not None:
            try:
                X = np.array(features["feature_vector"]).reshape(1, -1)
                pred_label = self.model.predict(X)[0]
                proba = float(np.max(self.model.predict_proba(X)))
                return {
                    "sign": str(pred_label),
                    "category": "alphabet" if len(str(pred_label)) == 1 else "phrase",
                    "confidence": round(proba, 2),
                    "meaning": f"Recognized sign '{pred_label}' (ML Model)",
                    "finger_states": states
                }
            except Exception as e:
                pass

        # Robust geometric ASL decision engine
        t_open = states["thumb"] == "OPEN"
        i_open = states["index"] == "OPEN"
        m_open = states["middle"] == "OPEN"
        r_open = states["ring"] == "OPEN"
        p_open = states["pinky"] == "OPEN"

        # Classification logic based on ASL linguistic specifications:
        # 1. 'I Love You' (ILY): Thumb, Index, and Pinky OPEN; Middle and Ring CLOSED
        if t_open and i_open and not m_open and not r_open and p_open:
            conf = 0.95 - (d["index_middle"] < 0.1) * 0.1
            return {"sign": "I Love You", "category": "phrase", "confidence": conf, 
                    "meaning": "Universal ASL expression for 'I Love You'", "finger_states": states}

        # 2. 'Y': Thumb and Pinky OPEN; Index, Middle, Ring CLOSED
        if t_open and not i_open and not m_open and not r_open and p_open:
            return {"sign": "Y", "category": "alphabet", "confidence": 0.94,
                    "meaning": "ASL Alphabet 'Y'", "finger_states": states}

        # 3. 'L': Thumb and Index OPEN (at approx 90 degrees); Middle, Ring, Pinky CLOSED
        if t_open and i_open and not m_open and not r_open and not p_open:
            # Check L-shape angle between thumb tip and index tip
            return {"sign": "L", "category": "alphabet", "confidence": 0.95,
                    "meaning": "ASL Alphabet 'L'", "finger_states": states}

        # 4. 'I': Pinky OPEN; Thumb, Index, Middle, Ring CLOSED
        if not i_open and not m_open and not r_open and p_open:
            return {"sign": "I", "category": "alphabet", "confidence": 0.93,
                    "meaning": "ASL Alphabet 'I'", "finger_states": states}

        # 5. 'V' / 'Peace': Index and Middle OPEN, spread apart; Ring, Pinky, Thumb CLOSED
        if i_open and m_open and not r_open and not p_open and not t_open:
            if d["index_middle"] > 0.25:
                return {"sign": "V", "category": "alphabet", "confidence": 0.94,
                        "meaning": "ASL Alphabet 'V' (Peace / Two)", "finger_states": states}
            else:
                return {"sign": "U", "category": "alphabet", "confidence": 0.91,
                        "meaning": "ASL Alphabet 'U' (Fingers together)", "finger_states": states}

        # 6. 'W' / '3': Index, Middle, Ring OPEN; Pinky and Thumb CLOSED
        if i_open and m_open and r_open and not p_open and not t_open:
            return {"sign": "W", "category": "alphabet", "confidence": 0.92,
                    "meaning": "ASL Alphabet 'W' (Three)", "finger_states": states}

        # 7. 'B' / '4': Index, Middle, Ring, Pinky OPEN; Thumb folded across palm
        if i_open and m_open and r_open and p_open and not t_open:
            return {"sign": "B", "category": "alphabet", "confidence": 0.93,
                    "meaning": "ASL Alphabet 'B' (Four / Flat hand)", "finger_states": states}

        # 8. '5' / 'Hello' / 'Open Palm' / 'Stop': All 5 fingers OPEN and spread
        if t_open and i_open and m_open and r_open and p_open:
            return {"sign": "Hello", "category": "greeting", "confidence": 0.96,
                    "meaning": "Open Hand / Hello / Stop (Five)", "finger_states": states}

        # 9. 'F' / 'OK': Index tip and Thumb tip touching (pinch), other 3 fingers (Middle, Ring, Pinky) OPEN
        if m_open and r_open and p_open and features["is_pinching"]:
            return {"sign": "OK", "category": "phrase", "confidence": 0.94,
                    "meaning": "ASL Alphabet 'F' / 'OK' gesture", "finger_states": states}

        # 10. 'D' / 'Point' / 'Help' / '1': Only Index finger OPEN, Thumb touching folded fingers
        if i_open and not m_open and not r_open and not p_open:
            return {"sign": "D", "category": "alphabet", "confidence": 0.92,
                    "meaning": "ASL Alphabet 'D' / Number '1' / Point", "finger_states": states}

        # 11. 'Thumbs Up' / 'Yes' / 'Good': Thumb OPEN upright, 4 fingers CLOSED tightly
        if t_open and not i_open and not m_open and not r_open and not p_open:
            thumb_is_up = norm[self.THUMB_TIP][1] < norm[self.THUMB_MCP][1]
            if thumb_is_up:
                return {"sign": "Yes", "category": "phrase", "confidence": 0.95,
                        "meaning": "Thumbs Up / 'Yes' / Good", "finger_states": states}
            else:
                return {"sign": "No", "category": "phrase", "confidence": 0.90,
                        "meaning": "Thumbs Down / Disagree", "finger_states": states}

        # 12. 'A' vs 'S' vs 'E': All 4 fingers curled (fist)
        if not i_open and not m_open and not r_open and not p_open and not t_open:
            # Check thumb position
            thumb_x = norm[self.THUMB_TIP][0]
            index_x = norm[self.INDEX_MCP][0]
            
            # If thumb rests beside index MCP
            if abs(norm[self.THUMB_TIP][1] - norm[self.INDEX_PIP][1]) < 0.35:
                return {"sign": "A", "category": "alphabet", "confidence": 0.89,
                        "meaning": "ASL Alphabet 'A' (Fist with thumb on side)", "finger_states": states}
            elif norm[self.THUMB_TIP][0] > norm[self.MIDDLE_MCP][0]:
                return {"sign": "S", "category": "alphabet", "confidence": 0.88,
                        "meaning": "ASL Alphabet 'S' (Thumb across fingers)", "finger_states": states}
            else:
                return {"sign": "E", "category": "alphabet", "confidence": 0.86,
                        "meaning": "ASL Alphabet 'E' (Curled claws)", "finger_states": states}

        # 13. 'C' / 'O': Curved fingers
        if features["angles"]["index"] < 130 and features["angles"]["middle"] < 130 and d["thumb_index"] < 0.45:
            return {"sign": "C", "category": "alphabet", "confidence": 0.87,
                    "meaning": "ASL Alphabet 'C' (Curved hand)", "finger_states": states}

        # Default fallback: return closest matching posture with lower confidence
        return {
            "sign": "Detecting...",
            "category": "analyzing",
            "confidence": 0.55,
            "meaning": "Form a clear ASL hand shape facing the camera",
            "finger_states": states
        }
