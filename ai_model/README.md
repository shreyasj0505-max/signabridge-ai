# SignaBridge AI – Computer Vision & Machine Learning Pipeline

This directory contains the computer vision, feature extraction, and machine learning components for real-time American Sign Language (ASL) recognition.

## Architecture Overview

```
                      [ Live Webcam Frame ]
                               │
                               ▼
               [ MediaPipe Hands (21 3D Points) ]
                               │
         ┌─────────────────────┴─────────────────────┐
         ▼                                           ▼
[ Geometric Normalization ]                [ Visual Overlay ]
 - Wrist translation (0,0,0)                - Neon joints & bones
 - Scale invariance (Wrist-to-Middle MCP)   - Handedness indicator
         │
         ▼
[ Anatomical Feature Engineering ]
 - 5 Finger extension states (OPEN / CLOSED / HALF)
 - 4 PIP joint angles (Index, Middle, Ring, Pinky)
 - Inter-tip Euclidean distances & pinch detection
 - Palm orientation normal vector
         │
         ▼
[ Hybrid Classification Engine ]
 ├── Mode 1: Random Forest / MLP Classifier (Trained scikit-learn model)
 └── Mode 2: Geometric Invariant ASL Expert Rules (High accuracy baseline)
         │
         ▼
[ Prediction Output: Label, Confidence %, Handedness, Finger States ]
```

## Landmark Specification

MediaPipe Hand Landmarker produces 21 3D landmarks $(x, y, z)$ per detected hand:
- `0`: WRIST
- `1-4`: THUMB (`THUMB_CMC`, `THUMB_MCP`, `THUMB_IP`, `THUMB_TIP`)
- `5-8`: INDEX (`INDEX_MCP`, `INDEX_PIP`, `INDEX_DIP`, `INDEX_TIP`)
- `9-12`: MIDDLE (`MIDDLE_MCP`, `MIDDLE_PIP`, `MIDDLE_DIP`, `MIDDLE_TIP`)
- `13-16`: RING (`RING_MCP`, `RING_PIP`, `RING_DIP`, `RING_TIP`)
- `17-20`: PINKY (`PINKY_MCP`, `PINKY_PIP`, `PINKY_DIP`, `PINKY_TIP`)

## Files in this Directory

- `hand_landmarks_extractor.py`: Python OpenCV + MediaPipe pipeline extracting 21 points and rendering neon skeleton overlays.
- `asl_classifier.py`: Real geometric feature extractor and ASL classifier. Computes finger states, angles, and matches against sign signatures.
- `data_collector.py`: Interactive webcam tool to record landmark frames for custom signs into CSV.
- `train_model.py`: Script to train Random Forest & MLP classifiers on collected datasets and save `asl_model.pkl`.
- `dataset/sample_landmarks.csv`: Sample benchmark dataset containing normalized coordinate coordinates for standard signs.

## How to Record Custom Signs

To collect your own hand landmark dataset:
```bash
python data_collector.py
```
1. Enter the sign name (e.g. `Hello`, `ThankYou`, `A`, `B`).
2. Press `SPACE` to start capturing landmark frames.
3. The frames are automatically extracted and appended to `dataset/sample_landmarks.csv`.

## How to Train the Model

```bash
python train_model.py
```
This will train a Random Forest classifier with 100 estimators, print test accuracy and classification reports, and save `asl_model.pkl`.
