"""
SignaBridge AI - FastAPI Backend Service
Provides RESTful APIs for sign language recognition, landmark classification,
gesture catalog, feedback collection, and history management.
"""

import os
import sys
import time
import base64
from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, Body, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add ai_model directory to sys.path to import the classifier
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ai_model")))
try:
    from asl_classifier import ASLClassifier
    classifier = ASLClassifier()
except ImportError:
    classifier = None
    print("Warning: ASLClassifier could not be imported from ai_model directory.")

app = FastAPI(
    title="SignaBridge AI - Recognition Backend",
    description="High-performance AI backend for American Sign Language recognition using MediaPipe landmarks.",
    version="1.0.0"
)

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for translation history and user feedback
translation_history: List[Dict[str, Any]] = []
user_feedback_log: List[Dict[str, Any]] = []

# Pydantic Schemas
class LandmarkPoint(BaseModel):
    id: Optional[int] = 0
    x: float
    y: float
    z: float

class PredictRequest(BaseModel):
    landmarks: List[LandmarkPoint] = Field(..., description="Array of 21 (x, y, z) hand landmarks")
    handedness: Optional[str] = Field("Right", description="'Left' or 'Right' hand")
    timestamp: Optional[float] = None

class PredictResponse(BaseModel):
    sign: str
    category: str
    confidence: float
    meaning: str
    handedness: str
    finger_states: Optional[Dict[str, str]] = None
    timestamp: float

class FeedbackRequest(BaseModel):
    predicted_sign: str
    actual_sign: str
    landmarks: Optional[List[Dict[str, float]]] = None
    user_comment: Optional[str] = None

class HistoryItem(BaseModel):
    id: str
    text: str
    signs: List[str]
    confidence: float
    timestamp: str

@app.get("/")
def root():
    return {
        "service": "SignaBridge AI API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "predict": "/api/predict",
            "signs": "/api/signs",
            "history": "/api/history",
            "feedback": "/api/feedback"
        }
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ai_engine": "operational" if classifier else "degraded",
        "classifier_loaded": classifier is not None,
        "timestamp": time.time(),
        "device": "CPU"
    }

@app.get("/api/signs")
def get_supported_signs():
    """Returns list of supported ASL signs and categories."""
    return {
        "alphabets": list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
        "numbers": [str(i) for i in range(10)],
        "greetings": ["Hello", "Goodbye", "Thank You", "Please", "Sorry", "Welcome"],
        "phrases": ["Help", "Yes", "No", "I Love You", "Water", "Food", "Friend", "Good", "Bad", "Stop", "OK"]
    }

@app.post("/api/predict", response_model=PredictResponse)
def predict_gesture(payload: PredictRequest):
    """
    Receives 21 normalized landmarks from frontend MediaPipe Hands
    and returns predicted ASL sign and confidence.
    """
    if len(payload.landmarks) != 21:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="MediaPipe Hands requires exactly 21 landmark points."
        )

    landmarks_dict = [lm.dict() for lm in payload.landmarks]
    
    if classifier is not None:
        prediction = classifier.predict(landmarks_dict, handedness=payload.handedness)
    else:
        # Fallback if module is missing
        prediction = {
            "sign": "Hello",
            "category": "greeting",
            "confidence": 0.88,
            "meaning": "Demo recognition response",
            "finger_states": {"thumb": "OPEN", "index": "OPEN", "middle": "OPEN", "ring": "OPEN", "pinky": "OPEN"}
        }

    return PredictResponse(
        sign=prediction["sign"],
        category=prediction.get("category", "general"),
        confidence=prediction.get("confidence", 0.90),
        meaning=prediction.get("meaning", ""),
        handedness=payload.handedness,
        finger_states=prediction.get("finger_states"),
        timestamp=time.time()
    )

@app.get("/api/history")
def get_history():
    """Retrieve translation history."""
    return {"history": translation_history}

@app.post("/api/history")
def add_history(item: HistoryItem):
    """Save completed sentence translation to session history."""
    translation_history.insert(0, item.dict())
    if len(translation_history) > 100:
        translation_history.pop()
    return {"status": "saved", "total_records": len(translation_history)}

@app.delete("/api/history")
def clear_history():
    """Clear session translation history."""
    translation_history.clear()
    return {"status": "cleared"}

@app.post("/api/feedback")
def submit_feedback(feedback: FeedbackRequest):
    """Log user corrections to enable continuous active learning dataset curation."""
    feedback_entry = feedback.dict()
    feedback_entry["recorded_at"] = datetime.utcnow().isoformat()
    user_feedback_log.append(feedback_entry)
    return {
        "status": "feedback_received",
        "message": f"Thank you! Recorded correction from '{feedback.predicted_sign}' to '{feedback.actual_sign}'."
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting SignaBridge AI FastAPI server on http://localhost:8000 ...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
