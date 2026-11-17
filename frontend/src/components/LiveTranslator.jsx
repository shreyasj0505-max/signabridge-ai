import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, CameraOff, Volume2, Copy, Check, Trash2, CornerDownLeft, 
  RotateCw, Sliders, Shield, AlertCircle, RefreshCw, Sparkles, Hand, 
  CheckCircle2, Radio, VolumeX, Zap 
} from 'lucide-react';
import { classifyASLGesture, drawNeonSkeleton, LM } from '../services/signRecognitionEngine';
import { speechService } from '../services/speechService';
import { historyStorage } from '../services/historyStorage';
import { ASL_SIGNS } from '../data/signsData';

export default function LiveTranslator({ soundEnabled }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaPipeHandsRef = useRef(null);
  const isProcessingFrameRef = useRef(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [fps, setFps] = useState(0);

  const [currentPrediction, setCurrentPrediction] = useState({
    sign: "No Hand Detected",
    category: "none",
    confidence: 0,
    meaning: "Start camera and hold your hand inside the frame.",
    fingerStates: null,
    handedness: "Right"
  });

  const [handDetected, setHandDetected] = useState(false);
  const [detectedHandCount, setDetectedHandCount] = useState(0);

  const [sentence, setSentence] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [holdProgress, setHoldProgress] = useState(0);
  const lastPredictedSignRef = useRef(null);
  const holdStartTimeRef = useRef(null);
  const HOLD_DURATION_MS = 1000;

  const [confidenceThreshold, setConfidenceThreshold] = useState(55); // Enhanced default
  const [selectedCorrection, setSelectedCorrection] = useState("");
  const [correctionFeedbackMsg, setCorrectionFeedbackMsg] = useState("");

  const lastFrameTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError(null);

    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      setCameraLoading(false);

      initMediaPipe();
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraLoading(false);
      setIsCameraActive(false);

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please allow camera access in your browser settings and try again.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No webcam found. Please plug in or enable a camera device.");
      } else {
        setCameraError(`Unable to start camera: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setIsCameraActive(false);
    setHandDetected(false);
    setDetectedHandCount(0);
    setHoldProgress(0);
    setFps(0);
  };

  const flipCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isCameraActive) {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 300);
    }
  };

  const initMediaPipe = () => {
    if (window.Hands) {
      const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.60,
        minTrackingConfidence: 0.50
      });

      hands.onResults(handleMediaPipeResults);
      mediaPipeHandsRef.current = hands;
      startVideoProcessingLoop();
    } else {
      startVideoProcessingLoop();
    }
  };

  const startVideoProcessingLoop = () => {
    const processFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      frameCountRef.current++;
      const now = performance.now();
      if (now - lastFrameTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      if (mediaPipeHandsRef.current && !isProcessingFrameRef.current) {
        isProcessingFrameRef.current = true;
        try {
          await mediaPipeHandsRef.current.send({ image: videoRef.current });
        } catch (e) {
        } finally {
          isProcessingFrameRef.current = false;
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  const handleMediaPipeResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (videoRef.current && (canvas.width !== videoRef.current.videoWidth || canvas.height !== videoRef.current.videoHeight)) {
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      setDetectedHandCount(results.multiHandLandmarks.length);

      const primaryLandmarks = results.multiHandLandmarks[0];
      let handedness = "Right";
      if (results.multiHandedness && results.multiHandedness.length > 0) {
        handedness = results.multiHandedness[0].label;
      }

      results.multiHandLandmarks.forEach((lmList, idx) => {
        const handLabel = results.multiHandedness?.[idx]?.label || "Right";
        drawNeonSkeleton(ctx, lmList, canvas.width, canvas.height, handLabel);
      });

      const pred = classifyASLGesture(primaryLandmarks, handedness, confidenceThreshold / 100);

      if (pred) {
        setCurrentPrediction(pred);

        if (pred.confidence >= confidenceThreshold && pred.sign !== "Detecting..." && pred.sign !== "No Hand Detected") {
          handleGestureHoldProgress(pred.sign, pred.confidence);
        } else {
          resetHoldProgress();
        }
      }
    } else {
      setHandDetected(false);
      setDetectedHandCount(0);
      resetHoldProgress();
      setCurrentPrediction({
        sign: "No Hand Detected",
        category: "none",
        confidence: 0,
        meaning: "Place your hand in front of the camera.",
        fingerStates: null,
        handedness: "Right"
      });
    }
  };

  const handleGestureHoldProgress = (signName, conf) => {
    if (lastPredictedSignRef.current !== signName) {
      lastPredictedSignRef.current = signName;
      holdStartTimeRef.current = Date.now();
      setHoldProgress(0);
      return;
    }

    if (!holdStartTimeRef.current) {
      holdStartTimeRef.current = Date.now();
    }

    const elapsed = Date.now() - holdStartTimeRef.current;
    const progress = Math.min(100, Math.round((elapsed / HOLD_DURATION_MS) * 100));
    setHoldProgress(progress);

    if (progress >= 100) {
      commitSignToSentence(signName, conf);
      holdStartTimeRef.current = Date.now() + 500;
      setHoldProgress(0);
    }
  };

  const resetHoldProgress = () => {
    holdStartTimeRef.current = null;
    lastPredictedSignRef.current = null;
    setHoldProgress(0);
  };

  const commitSignToSentence = (signText, conf = 95) => {
    if (soundEnabled) {
      speechService.playConfirmationChime();
    }

    setSentence((prev) => {
      const isWord = signText.length > 1;
      if (!prev || prev.trim() === "") {
        return signText;
      }
      if (isWord || prev.endsWith(" ")) {
        return prev + (prev.endsWith(" ") ? "" : " ") + signText;
      }
      return prev + signText;
    });
  };

  const addSpace = () => setSentence(prev => prev + " ");
  const backspace = () => setSentence(prev => prev.slice(0, -1));
  const clearSentence = () => setSentence("");

  const copySentence = () => {
    if (!sentence) return;
    navigator.clipboard.writeText(sentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakSentence = () => {
    if (!sentence.trim()) return;
    setIsSpeaking(true);
    speechService.speak(sentence, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });

    historyStorage.addEntry({
      text: sentence,
      confidence: currentPrediction.confidence || 95,
      mode: "live_camera"
    });
  };

  const handleCorrectionSubmit = () => {
    if (!selectedCorrection) return;
    setCorrectionFeedbackMsg(`Logged correction: ${currentPrediction.sign} -> ${selectedCorrection}`);
    commitSignToSentence(selectedCorrection, 98);
    setSelectedCorrection("");
    setTimeout(() => setCorrectionFeedbackMsg(""), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Title & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-950/60 text-cyan-300 border border-blue-600/40">
              <Camera className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Live Sign Language Recognition
            </h1>
          </div>
          <p className="text-sm text-blue-200 mt-1">
            Real-time hand landmark tracking and ASL classification in Electric Blue & Black.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#040814] border border-blue-900/50 text-xs text-blue-300">
            <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
            <span>{isCameraActive ? `${fps} FPS Live` : 'Idle'}</span>
          </div>
        </div>
      </div>

      {/* Quick Test Bar */}
      <div className="p-4 rounded-2xl bg-[#040814] border border-blue-900/40 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-blue-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Test Bar (Click to simulate sign & test voice output):</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "🤟 I Love You", s: "I Love You" },
            { label: "👋 Hello", s: "Hello" },
            { label: "✌️ Peace/V", s: "V" },
            { label: "👍 Yes", s: "Yes" },
            { label: "👎 No", s: "No" },
            { label: "👌 OK", s: "OK" },
            { label: "✋ Stop", s: "Stop" },
            { label: "Letter L", s: "L" },
            { label: "Letter Y", s: "Y" },
            { label: "Letter A", s: "A" },
            { label: "Letter B", s: "B" }
          ].map(b => (
            <button
              key={b.s}
              onClick={() => {
                commitSignToSentence(b.s, 98);
                setCurrentPrediction({
                  sign: b.s,
                  category: "phrase",
                  confidence: 98,
                  meaning: `Recognized '${b.s}'`,
                  handedness: "Right",
                  fingerStates: { thumb: "OPEN", index: "OPEN", middle: "OPEN", ring: "CLOSED", pinky: "OPEN" },
                  isRecognized: true
                });
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/80 border border-blue-700/40 text-xs font-medium text-blue-200 hover:text-white transition-all shadow-sm"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Video Stream on Left, Live Predictions & Sentence on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Camera Feed with Neon Canvas Overlay (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-black border border-blue-600/40 shadow-2xl flex items-center justify-center">
            
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isCameraActive ? 'opacity-100' : 'opacity-0'
              } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />

            {!isCameraActive && !cameraLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/90 backdrop-blur-md">
                <div className="w-20 h-20 rounded-3xl bg-blue-950/60 border border-blue-600/40 flex items-center justify-center text-cyan-300 mb-4 shadow-lg shadow-blue-600/20">
                  <Camera className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Camera is Disconnected</h3>
                <p className="text-sm text-slate-400 max-w-sm mb-6">
                  Click the button below to grant webcam permission. Hand movements will be tracked with 21 3D spatial points.
                </p>
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-600/30 hover:opacity-95 active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5 text-cyan-200" />
                  <span>Start Camera</span>
                </button>
              </div>
            )}

            {cameraLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md text-white">
                <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
                <p className="text-sm font-medium">Initializing MediaPipe Vision Pipeline...</p>
              </div>
            )}

            {isCameraActive && (
              <>
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-blue-500/40 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${handDetected ? 'bg-cyan-400 animate-ping' : 'bg-amber-400'}`} />
                  <span className="font-medium text-white">
                    {handDetected ? `${currentPrediction.handedness} Hand (${detectedHandCount})` : 'Waiting for Hand...'}
                  </span>
                </div>

                {holdProgress > 0 && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 backdrop-blur-md border border-cyan-400 text-xs text-white">
                    <span>Holding: {holdProgress}%</span>
                  </div>
                )}
              </>
            )}
          </div>

          {cameraError && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3 text-rose-200 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-100">Camera Access Error</p>
                <p className="text-xs text-rose-300/90 mt-0.5">{cameraError}</p>
              </div>
            </div>
          )}

          {/* Camera Hardware Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#040814] backdrop-blur-xl border border-blue-900/40">
            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Stop Camera</span>
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 hover:opacity-95 transition-all"
                >
                  <Camera className="w-4 h-4 text-cyan-200" />
                  <span>Start Camera</span>
                </button>
              )}

              <button
                onClick={flipCamera}
                title="Switch Camera (Front/Back)"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A1226] hover:bg-[#101C3D] text-slate-300 text-xs transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flip View</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">Sensitivity:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="45"
                  max="90"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-24 sm:w-28 accent-cyan-400 cursor-pointer"
                />
                <span className="text-xs font-mono text-cyan-300 min-w-[28px]">
                  {confidenceThreshold}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Prediction & Sentence Builder (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Prediction Card */}
          <div className="rounded-3xl p-6 bg-[#040814] backdrop-blur-xl border border-blue-600/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider">
                  AI Prediction Output
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-300">
                {currentPrediction.handedness} Hand
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-black border border-blue-800/40">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Recognized Sign</span>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text">
                  {currentPrediction.sign}
                </div>
                <p className="text-xs text-blue-200 mt-1 max-w-[240px]">
                  {currentPrediction.meaning}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block mb-1">Confidence</span>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-600/40">
                  <span className={`text-lg font-mono font-black ${
                    currentPrediction.confidence >= confidenceThreshold ? 'text-cyan-300' : 'text-amber-400'
                  }`}>
                    {currentPrediction.confidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Finger Extension Telemetry HUD */}
            {currentPrediction.fingerStates ? (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block">
                  Finger Posture Telemetry
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {Object.entries(currentPrediction.fingerStates).map(([finger, state]) => (
                    <div
                      key={finger}
                      className={`p-1.5 rounded-lg border capitalize ${
                        state === 'OPEN'
                          ? 'bg-blue-950/80 border-cyan-500/60 text-cyan-300 font-bold'
                          : 'bg-black border-slate-900 text-slate-600'
                      }`}
                    >
                      <span className="block text-[9px] text-slate-400">{finger}</span>
                      <span>{state}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-black border border-slate-900 text-center text-xs text-slate-500">
                Hold hand in view to monitor individual finger states...
              </div>
            )}

            {currentPrediction.isRecognized && (
              <button
                onClick={() => commitSignToSentence(currentPrediction.sign, currentPrediction.confidence)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-cyan-300 text-xs font-semibold transition-all"
              >
                <span>Append "{currentPrediction.sign}" to Sentence</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-cyan-300" />
              </button>
            )}

            {/* Correction Feedback System */}
            <div className="pt-2 border-t border-blue-900/40 space-y-2">
              <span className="text-xs text-slate-400">Misclassified? Provide Feedback:</span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedCorrection}
                  onChange={(e) => setSelectedCorrection(e.target.value)}
                  className="flex-1 bg-black border border-blue-900/60 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select correct sign...</option>
                  {ASL_SIGNS.map(s => (
                    <option key={s.id} value={s.sign}>{s.sign} - {s.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleCorrectionSubmit}
                  disabled={!selectedCorrection}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-medium text-white transition-all"
                >
                  Correct
                </button>
              </div>
              {correctionFeedbackMsg && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{correctionFeedbackMsg}</span>
                </p>
              )}
            </div>

          </div>

          {/* Sentence Builder Card */}
          <div className="rounded-3xl p-6 bg-[#040814] backdrop-blur-xl border border-blue-600/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hand className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider">
                  Sentence Builder
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={copySentence}
                  disabled={!sentence}
                  title="Copy Sentence"
                  className="p-1.5 rounded-lg bg-[#0A1226] hover:bg-[#101C3D] disabled:opacity-40 text-slate-300 text-xs transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={clearSentence}
                  disabled={!sentence}
                  title="Clear Sentence"
                  className="p-1.5 rounded-lg bg-[#0A1226] hover:bg-[#101C3D] disabled:opacity-40 text-slate-300 text-xs transition-all"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>

            <div className="min-h-[100px] p-4 rounded-2xl bg-black border border-blue-900/40 flex items-start">
              {sentence ? (
                <p className="text-lg font-medium text-white leading-relaxed break-words">
                  {sentence}
                </p>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Recognized gestures will assemble here into complete sentences...
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={addSpace}
                className="py-2 px-3 rounded-xl bg-[#050B1A] hover:bg-[#0A132C] border border-blue-900/40 text-slate-200 font-medium transition-all"
              >
                Space (␣)
              </button>
              <button
                onClick={backspace}
                className="py-2 px-3 rounded-xl bg-[#050B1A] hover:bg-[#0A132C] border border-blue-900/40 text-slate-200 font-medium transition-all"
              >
                Backspace (⌫)
              </button>
            </div>

            <button
              onClick={speakSentence}
              disabled={!sentence.trim() || isSpeaking}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:opacity-95 active:scale-95 transition-all"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce text-cyan-200' : 'text-cyan-200'}`} />
              <span>{isSpeaking ? "Speaking Sentence..." : "Speak Translated Sentence"}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
