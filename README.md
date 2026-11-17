# SignaBridge AI – AI-Powered Sign Language Recognition Platform

> **"Breaking Barriers. Connecting People."**  
> An advanced, responsive, AI-powered American Sign Language (ASL) recognition web application that bridges communication between the deaf/hard-of-hearing community and non-signing individuals using real-time computer vision, hand landmark tracking, and assistive voice technologies.

---

## 🌟 Key Features

### 1. Live Sign Language Recognition
- **Real-Time 21-Point Hand Landmark Tracking**: Tracks fingers, knuckles, and wrist in 3D space at 60 FPS using MediaPipe Hands.
- **Genuine AI Classification Pipeline**: Extracts joint angles (MCP-PIP-DIP), normalized Euclidean distance vectors, finger extension states, and pinch metrics to classify ASL signs.
- **Neon Cyberpunk Skeleton Overlay**: Renders stylish purple and cyan glowing joints and skeletal connections directly onto an HTML5 canvas layer.
- **Handedness Detection**: Distinguishes between Left and Right hands.
- **Live Confidence Percentage**: Dynamically gauges prediction certainty (0% – 100%) against user-adjustable sensitivity thresholds.
- **Sentence-Building Engine**: Includes a hold-to-type debounce timer (1.1s steady hold commits the sign), space (`␣`), backspace (`⌫`), clear, and quick tap-to-append.
- **Correction Feedback**: Dropdown allowing users to flag and correct predictions for continuous accuracy improvement.

### 2. Text-to-Speech (TTS) Voice Synthesis
- Converts translated sign sentences or custom typed phrases into spoken voice in real time using the browser **Web Speech API**.
- Custom voice selector (English US/UK/etc.), speech rate, and pitch controls.
- Quick conversational phrases for immediate assistance.

### 3. Speech-to-Text (STT) Microphone Converter
- Transcribes spoken audio from hearing individuals in real time for deaf readers.
- Animated multi-bar voice frequency visualizer.
- One-click copy to clipboard and clear actions.

### 4. Interactive Sign Language Learning Academy
- **Comprehensive ASL Encyclopedia**: Alphabets (A–Z), numbers (0–9), common greetings, and daily essential phrases.
- **Instant Search & Category Filters**: Quickly find any gesture by name, difficulty, or category.
- **Visual Demonstrations**: Detailed instructions and pro tips for proper finger positioning and palm orientation.
- **Interactive Camera Practice Mode**: Choose any sign, launch your webcam, and receive real-time percentage match feedback comparing your hand to the target sign!

### 5. Translation History & Session Persistence
- Saves completed translations with timestamps, confidence scores, and mode used.
- Persistent in `localStorage`.
- Search history, play audio aloud, copy text, delete individual entries, or export the entire history as a JSON file.

### 6. Accessibility & Futuristic UI
- Premium dark navy/black futuristic aesthetic with purple and electric blue gradients (`#070913`, `#8B5CF6`, `#06B6D4`).
- Glassmorphism cards with glowing neon accents.
- Dedicated **High-Contrast Mode** toggle for visual accessibility.
- Audio feedback chimes on gesture confirmation (toggleable).
- Fully responsive on desktop, tablet, and mobile devices.

---

## 🏗️ Project Architecture

```
signabridge-ai/
├── index.html                   # Standalone browser distribution (runs immediately)
├── start_server.ps1             # Zero-dependency PowerShell local HTTP server (localhost:5000)
├── start_app.bat                # 1-click Windows launcher
├── README.md                    # Project documentation & execution guide
│
├── frontend/                    # Modern Modular React + Vite + Tailwind frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── data/
│       │   └── signsData.js              # ASL knowledge base (A-Z, 0-9, phrases)
│       ├── services/
│       │   ├── signRecognitionEngine.js  # Landmark math, angles, ASL rules & canvas drawing
│       │   ├── speechService.js          # Web Speech TTS & STT + Web Audio chimes
│       │   └── historyStorage.js         # LocalStorage history & JSON export
│       └── components/
│           ├── Navbar.jsx
│           ├── HeroSection.jsx           # Animated hand recognition simulator
│           ├── LiveTranslator.jsx        # Live webcam feed, neon overlay, sentence builder
│           ├── LearnSigns.jsx            # Sign academy with camera practice mode
│           ├── SpeechConverter.jsx       # Two-way STT & TTS bridge
│           ├── HistoryPage.jsx           # Translation history manager
│           ├── AboutPage.jsx             # Mission, architecture & technical specs
│           └── Footer.jsx
│
├── backend/                     # Python FastAPI Backend Service
│   ├── main.py                  # REST API (/api/predict, /api/signs, /api/history, /api/feedback)
│   ├── run_server.py            # Uvicorn launcher script
│   ├── requirements.txt         # FastAPI, OpenCV, MediaPipe, Scikit-learn
│   └── README.md
│
└── ai_model/                    # AI & Machine Learning Computer Vision Pipeline
    ├── hand_landmarks_extractor.py  # Python MediaPipe & OpenCV 21-point extractor
    ├── asl_classifier.py            # Geometric feature extractor & classification rules
    ├── train_model.py               # Scikit-learn Random Forest / MLP training script
    ├── data_collector.py            # Interactive webcam landmark dataset collector
    ├── dataset/
    │   └── sample_landmarks.csv     # 63-dimensional coordinate dataset
    └── README.md
```

---

## 🚀 How to Run the Application

### Option A: Instant Zero-Dependency Launch (Recommended for Windows)

Because modern browsers require a secure origin (`http://localhost` or `https://`) for webcam permissions:

1. Double-click **`start_app.bat`** (or open PowerShell in the project directory and run `powershell -ExecutionPolicy Bypass -File .\start_server.ps1`).
2. The zero-dependency server will launch at **`http://localhost:5000`** and automatically open your default browser.
3. Click **"Start Translating"** or **"Live Translator"**, allow webcam access when prompted, and start signing!

### Option B: Direct Browser Launch

You can also directly open `index.html` in Google Chrome or Microsoft Edge.  
*(Note: If your browser blocks webcam access over `file://`, use Option A or run a local server).*

### Option C: Run with Vite & Node.js (If Node is installed)

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`.

### Option D: Run Python FastAPI Backend (Optional)

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # On Windows
pip install -r requirements.txt
python run_server.py
```
Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🧠 AI & Computer Vision Methodology

```
[ Webcam Video Frame ]
        │
        ▼
[ MediaPipe Hands (21 3D Points) ]
        │
  ┌─────┴────────────────────────────────────────────────┐
  ▼                                                      ▼
[ Geometric Normalization ]                  [ Neon Canvas Overlay ]
  - Translate to Wrist (0,0,0)                 - Glowing joints (Cyan/White)
  - Scale invariance (Wrist-to-Middle MCP)     - Gradient bones (Violet/Cyan)
  - Scale-invariant coordinate vectors         - Handedness badge
        │
        ▼
[ Anatomical Feature Engineering ]
  - 5 Finger extension states: OPEN / CLOSED / HALF
  - 4 Joint angles: MCP -> PIP -> DIP -> TIP
  - Inter-tip Euclidean distances & pinch test
  - Palm normal orientation
        │
        ▼
[ Real-Time ASL Classifier ]
  - Canonical ASL signature matching
  - Continuous confidence scoring (0% – 100%)
  - Debounce buffer (1.1s hold-to-type)
        │
        ▼
[ Output: Label, Confidence %, Sentence Builder, Text-to-Speech ]
```

---

## 📊 Supported ASL Vocabulary

| Category | Examples |
|---|---|
| **Alphabets** | `A`, `B`, `C`, `D`, `E`, `F`, `I`, `L`, `O`, `U`, `V`, `W`, `Y`, `S`, etc. |
| **Numbers** | `0` (O-shape), `1` (index), `2` (V), `3` (W), `4` (four fingers), `5` (open palm) |
| **Greetings** | `Hello` (Open Hand wave/salute), `Thank You`, `Please`, `Sorry`, `Welcome` |
| **Phrases** | `I Love You` (ILY: Thumb+Index+Pinky), `Yes` (Thumbs Up), `No` (Thumbs Down), `OK` (Pinch), `Stop` (Flat Palm), `Help` |

---

## 🦾 Training Custom Sign Languages & Gestures

To collect custom signs for regional sign languages (e.g., BSL, ISL):

1. **Collect Data**:
   ```bash
   python ai_model/data_collector.py
   ```
   Enter the sign name (e.g. `Water`, `Food`) and press `SPACE` to record 80+ frames.

2. **Train Model**:
   ```bash
   python ai_model/train_model.py
   ```
   Trains a Random Forest classifier on `ai_model/dataset/sample_landmarks.csv` and outputs `asl_model.pkl`.

---

## ♿ Accessibility Compliance (WCAG 2.1 AA)

- **High Contrast**: Dedicated toggle providing high-contrast borders and deep black backgrounds.
- **Audio Feedback**: Web Audio API frequency confirmation chimes when gestures commit.
- **Dual Visual/Audio Signals**: Visual badges accompany all audio events.
- **Keyboard Navigation**: Standard tab indexing and keyboard-accessible buttons.

---

## 📜 License & Credits

Built with empathy and computer vision for accessible communication.  
Distributed under the MIT License.
