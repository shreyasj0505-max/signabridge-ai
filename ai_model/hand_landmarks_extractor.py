"""
SignaBridge AI - Hand Landmark Extractor
Computer Vision pipeline using OpenCV and Google MediaPipe Hands.
Extracts 21 3D hand coordinates for Left and Right hands.
"""

import cv2
import mediapipe as mp
import numpy as np
from typing import List, Dict, Optional, Tuple

class HandLandmarkExtractor:
    """
    Extracts normalized 3D hand landmarks from video frames or image inputs
    using MediaPipe Hands.
    """
    
    LANDMARK_NAMES = [
        "WRIST",
        "THUMB_CMC", "THUMB_MCP", "THUMB_IP", "THUMB_TIP",
        "INDEX_FINGER_MCP", "INDEX_FINGER_PIP", "INDEX_FINGER_DIP", "INDEX_FINGER_TIP",
        "MIDDLE_FINGER_MCP", "MIDDLE_FINGER_PIP", "MIDDLE_FINGER_DIP", "MIDDLE_FINGER_TIP",
        "RING_FINGER_MCP", "RING_FINGER_PIP", "RING_FINGER_DIP", "RING_FINGER_TIP",
        "PINKY_MCP", "PINKY_PIP", "PINKY_DIP", "PINKY_TIP"
    ]

    def __init__(self, 
                 static_image_mode: bool = False,
                 max_num_hands: int = 2,
                 min_detection_confidence: float = 0.7,
                 min_tracking_confidence: float = 0.5):
        self.mp_hands = mp.solutions.hands
        self.mp_draw = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        self.hands = self.mp_hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

    def process_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, List[Dict]]:
        """
        Process a BGR OpenCV image frame, draw neon skeleton annotations,
        and extract landmark coordinates.
        
        Returns:
            annotated_frame: Image frame with landmarks drawn
            detected_hands: List of dictionaries with hand metadata and 21 (x, y, z) landmarks
        """
        h, w, _ = frame.shape
        # Convert BGR to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb_frame.flags.writeable = False
        results = self.hands.process(rgb_frame)
        rgb_frame.flags.writeable = True

        annotated_frame = frame.copy()
        detected_hands = []

        if results.multi_hand_landmarks:
            for hand_idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
                # Determine handedness (Left or Right)
                handedness = "Right"
                if results.multi_handedness and len(results.multi_handedness) > hand_idx:
                    handedness = results.multi_handedness[hand_idx].classification[0].label

                landmarks_list = []
                raw_coords = []
                for idx, lm in enumerate(hand_landmarks.landmark):
                    cx, cy = int(lm.x * w), int(lm.y * h)
                    raw_coords.append((cx, cy))
                    landmarks_list.append({
                        "id": idx,
                        "name": self.LANDMARK_NAMES[idx],
                        "x": float(lm.x),
                        "y": float(lm.y),
                        "z": float(lm.z)
                    })

                detected_hands.append({
                    "hand_index": hand_idx,
                    "handedness": handedness,
                    "landmarks": landmarks_list,
                    "raw_pixel_coords": raw_coords
                })

                # Draw custom stylish glowing skeleton overlay
                self._draw_styled_landmarks(annotated_frame, hand_landmarks)

        return annotated_frame, detected_hands

    def _draw_styled_landmarks(self, frame: np.ndarray, hand_landmarks):
        """Draw neon cyan & purple glowing landmark joints and connections."""
        # Use MediaPipe drawing utility with styled lines
        self.mp_draw.draw_landmarks(
            frame,
            hand_landmarks,
            self.mp_hands.HAND_CONNECTIONS,
            self.mp_drawing_styles.get_default_hand_landmarks_style(),
            self.mp_drawing_styles.get_default_hand_connections_style()
        )

    def close(self):
        """Release MediaPipe resources."""
        self.hands.close()

if __name__ == "__main__":
    print("Testing HandLandmarkExtractor with local camera...")
    cap = cv2.VideoCapture(0)
    extractor = HandLandmarkExtractor()

    if not cap.isOpened():
        print("Camera could not be opened. Running in static test mode.")
    else:
        print("Press 'q' to exit live test window.")
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Flip horizontally for natural mirror view
            frame = cv2.flip(frame, 1)
            annotated_frame, hands = extractor.process_frame(frame)
            
            # Display detected hands count
            cv2.putText(annotated_frame, f"Hands: {len(hands)}", (20, 40), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 200), 2)
            
            cv2.imshow("SignaBridge AI - Vision Pipeline", annotated_frame)
            if cv2.waitKey(5) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
    extractor.close()
