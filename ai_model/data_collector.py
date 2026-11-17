"""
SignaBridge AI - Webcam Hand Landmark Data Collector
Interactive tool to capture live webcam landmarks for custom sign classes
and append them directly into the training dataset CSV.
"""

import cv2
import csv
import os
import time
from hand_landmarks_extractor import HandLandmarkExtractor

DATASET_FILE = "dataset/sample_landmarks.csv"

def init_csv_file(filepath: str):
    """Ensure CSV has headers for 21 3D coordinates."""
    if not os.path.exists(filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        headers = ["label"]
        for i in range(21):
            headers.extend([f"x{i}", f"y{i}", f"z{i}"])
        with open(filepath, mode="w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
        print(f"Created new dataset file: {filepath}")

def record_sign_samples(sign_label: str, target_samples: int = 100):
    """
    Open webcam, prompt user to form the gesture, and capture target_samples.
    """
    init_csv_file(DATASET_FILE)
    extractor = HandLandmarkExtractor(min_detection_confidence=0.7)
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not access webcam.")
        return

    print(f"\n==========================================")
    print(f"SignaBridge AI Data Collector")
    print(f"Recording gesture: '{sign_label}'")
    print(f"Target count: {target_samples} frames")
    print(f"Press 'SPACE' to start recording, 'q' to cancel.")
    print(f"==========================================\n")

    recording = False
    collected_count = 0

    with open(DATASET_FILE, mode="a", newline="") as f:
        writer = csv.writer(f)

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)
            h, w, _ = frame.shape
            annotated_frame, detected_hands = extractor.process_frame(frame)

            status_text = f"Sign: {sign_label} | Count: {collected_count}/{target_samples}"
            color = (0, 255, 0) if recording else (0, 165, 255)
            cv2.putText(annotated_frame, status_text, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

            if not recording:
                cv2.putText(annotated_frame, "Press SPACE to start recording", (20, 80), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
            else:
                if detected_hands:
                    # Save first detected hand's landmarks
                    hand = detected_hands[0]
                    row = [sign_label]
                    for lm in hand["landmarks"]:
                        row.extend([lm["x"], lm["y"], lm["z"]])
                    writer.writerow(row)
                    collected_count += 1
                    cv2.putText(annotated_frame, "RECORDING...", (20, 80), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                    time.sleep(0.03)

                    if collected_count >= target_samples:
                        print(f"Successfully collected {target_samples} samples for '{sign_label}'!")
                        break
                else:
                    cv2.putText(annotated_frame, "No hand visible! Hold hand in view", (20, 80),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

            cv2.imshow("SignaBridge AI - Data Collector", annotated_frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord(' '):
                recording = not recording
            elif key == ord('q'):
                print("Data collection cancelled.")
                break

    cap.release()
    cv2.destroyAllWindows()
    extractor.close()

if __name__ == "__main__":
    sign_name = input("Enter the sign name or letter to record (e.g., A, Hello, ThankYou): ").strip()
    if sign_name:
        record_sign_samples(sign_name, target_samples=80)
