"""
SignaBridge AI - Server Runner Helper
Runs the FastAPI server with uvicorn.
"""
import sys
import os

if __name__ == "__main__":
    try:
        import uvicorn
        print("==================================================")
        print("  Starting SignaBridge AI FastAPI Backend Server  ")
        print("  API Docs available at: http://localhost:8000/docs")
        print("==================================================")
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    except ImportError:
        print("Error: uvicorn is not installed.")
        print("Please install requirements first:")
        print("pip install -r requirements.txt")
        sys.exit(1)
