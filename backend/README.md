# SignaBridge AI – FastAPI Backend

High-performance REST API backend powering the SignaBridge AI sign language recognition platform.

## Setup & Execution

### 1. Create and Activate Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the API Server

```bash
python run_server.py
```
Or directly using uvicorn:
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## API Documentation

Once started, interactive API documentation is available at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns AI model loading status and system health |
| `GET` | `/api/signs` | Returns full dictionary of supported ASL signs and categories |
| `POST` | `/api/predict` | Receives 21 (x, y, z) hand landmarks and classifies the gesture |
| `GET` | `/api/history` | Fetches historical translation sentences |
| `POST` | `/api/history` | Appends a translated sentence to history |
| `DELETE` | `/api/history` | Clears translation history |
| `POST` | `/api/feedback` | Logs user corrections to improve dataset accuracy |
