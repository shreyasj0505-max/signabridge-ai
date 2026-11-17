import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, BookOpen, Camera, CheckCircle2, AlertCircle, X, Sparkles, 
  HelpCircle, ChevronRight, Award, RefreshCw 
} from 'lucide-react';
import { ASL_SIGNS, CATEGORIES } from '../data/signsData';
import { classifyASLGesture, drawNeonSkeleton } from '../services/signRecognitionEngine';
import { speechService } from '../services/speechService';

export default function LearnSigns({ soundEnabled }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeSignModal, setActiveSignModal] = useState(null);

  const [practiceSign, setPracticeSign] = useState(null);
  const [isPracticeCameraOn, setIsPracticeCameraOn] = useState(false);
  const [practiceMatchPercent, setPracticeMatchPercent] = useState(0);
  const [practiceSuccess, setPracticeSuccess] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState("Position your hand in front of the camera.");

  const practiceVideoRef = useRef(null);
  const practiceCanvasRef = useRef(null);
  const practiceStreamRef = useRef(null);
  const practiceAnimFrameRef = useRef(null);
  const practiceHandsRef = useRef(null);

  const filteredSigns = ASL_SIGNS.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.sign.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    return () => {
      stopPracticeCamera();
    };
  }, []);

  const startPracticeCamera = async (signItem) => {
    setPracticeSign(signItem);
    setPracticeSuccess(false);
    setPracticeMatchPercent(0);
    setPracticeFeedback("Starting camera...");
    setIsPracticeCameraOn(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      practiceStreamRef.current = stream;
      if (practiceVideoRef.current) {
        practiceVideoRef.current.srcObject = stream;
        await practiceVideoRef.current.play();
      }

      if (window.Hands) {
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.60,
          minTrackingConfidence: 0.50
        });

        hands.onResults((results) => handlePracticeResults(results, signItem));
        practiceHandsRef.current = hands;
      }

      runPracticeLoop(signItem);
    } catch (err) {
      console.error("Practice camera error:", err);
      setPracticeFeedback("Could not access camera. Please verify permissions.");
    }
  };

  const stopPracticeCamera = () => {
    if (practiceAnimFrameRef.current) {
      cancelAnimationFrame(practiceAnimFrameRef.current);
      practiceAnimFrameRef.current = null;
    }
    if (practiceStreamRef.current) {
      practiceStreamRef.current.getTracks().forEach(t => t.stop());
      practiceStreamRef.current = null;
    }
    if (practiceVideoRef.current) {
      practiceVideoRef.current.srcObject = null;
    }
    setIsPracticeCameraOn(false);
    setPracticeSign(null);
  };

  const runPracticeLoop = (targetSign) => {
    const loop = async () => {
      if (!practiceVideoRef.current || practiceVideoRef.current.readyState < 2) {
        practiceAnimFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (practiceHandsRef.current) {
        try {
          await practiceHandsRef.current.send({ image: practiceVideoRef.current });
        } catch (e) {}
      }

      practiceAnimFrameRef.current = requestAnimationFrame(loop);
    };
    practiceAnimFrameRef.current = requestAnimationFrame(loop);
  };

  const handlePracticeResults = (results, targetSign) => {
    const canvas = practiceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (practiceVideoRef.current && (canvas.width !== practiceVideoRef.current.videoWidth || canvas.height !== practiceVideoRef.current.videoHeight)) {
      canvas.width = practiceVideoRef.current.videoWidth || 640;
      canvas.height = practiceVideoRef.current.videoHeight || 480;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const handedness = results.multiHandedness?.[0]?.label || "Right";

      drawNeonSkeleton(ctx, landmarks, canvas.width, canvas.height, handedness);

      const prediction = classifyASLGesture(landmarks, handedness);

      if (prediction.sign.toLowerCase() === targetSign.sign.toLowerCase()) {
        const score = Math.max(90, prediction.confidence);
        setPracticeMatchPercent(score);
        setPracticeFeedback("Awesome! Hand posture matches target sign! 🎉");
        setPracticeSuccess(true);
        if (soundEnabled) speechService.playChime();
      } else {
        const partialScore = Math.max(40, Math.min(80, 100 - Math.abs(prediction.confidence - 60)));
        setPracticeMatchPercent(partialScore);
        setPracticeFeedback(`Detected '${prediction.sign}'. Adjust fingers according to instructions.`);
        setPracticeSuccess(false);
      }
    } else {
      setPracticeMatchPercent(0);
      setPracticeFeedback("Bring hand inside frame facing camera.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-950/60 text-cyan-300 border border-blue-600/40">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign Language Learning Academy
            </h1>
          </div>
          <p className="text-sm text-blue-200 mt-1">
            Master American Sign Language (ASL) alphabets, numbers, and common conversational phrases.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letters, numbers, signs..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-black border border-blue-900/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-[#040814] hover:bg-[#0A132C] border border-blue-900/40 text-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Signs Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSigns.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl p-5 bg-[#040814] backdrop-blur-xl border border-blue-900/40 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-600/40 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  {item.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {item.difficulty}
                </span>
              </div>

              <div className="w-20 h-20 mx-auto rounded-2xl bg-black border border-blue-800/40 flex items-center justify-center text-4xl shadow-inner mb-4 group-hover:scale-105 transition-transform">
                <span className="font-black bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                  {item.sign}
                </span>
              </div>

              <h3 className="text-base font-bold text-white text-center mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 text-center leading-relaxed line-clamp-2 mb-4">
                {item.summary}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-blue-900/40">
              <button
                onClick={() => setActiveSignModal(item)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#0A1226] hover:bg-[#101C3D] text-xs font-semibold text-slate-200 transition-all"
              >
                <span>View Guide & Tips</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => startPracticeCamera(item)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-cyan-300 transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Practice with Camera</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Modal */}
      {activeSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#040814] border border-blue-600/40 shadow-2xl space-y-6">
            <button
              onClick={() => setActiveSignModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-black hover:bg-slate-900 text-slate-300 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-black border border-blue-600/40 flex items-center justify-center text-3xl font-black text-cyan-300">
                {activeSignModal.sign}
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-cyan-400">
                  {activeSignModal.category}
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  {activeSignModal.name}
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-black border border-blue-900/40">
                <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
                  How to Form this Sign
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  {activeSignModal.instructions}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-700/40">
                <h4 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Pro Tip for Recognition</span>
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {activeSignModal.tips}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const target = activeSignModal;
                setActiveSignModal(null);
                startPracticeCamera(target);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:opacity-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Open Camera Practice Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Practice Modal */}
      {isPracticeCameraOn && practiceSign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl p-6 bg-[#040814] border border-blue-600/40 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-cyan-300 p-2 rounded-xl bg-black border border-blue-800/40">
                  {practiceSign.sign}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Practicing: {practiceSign.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hold your hand up to the camera and match the sign shape.
                  </p>
                </div>
              </div>

              <button
                onClick={stopPracticeCamera}
                className="p-2 rounded-xl bg-black hover:bg-slate-900 text-slate-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black border border-blue-900/50">
              <video
                ref={practiceVideoRef}
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <canvas
                ref={practiceCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]"
              />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold ${
                  practiceSuccess 
                    ? 'bg-blue-950/90 border-cyan-400 text-cyan-300' 
                    : 'bg-black/80 border-blue-900/60 text-white'
                }`}>
                  {practiceSuccess ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                  <span>{practiceFeedback}</span>
                </div>

                <div className="px-3 py-1.5 rounded-full bg-black backdrop-blur-md border border-blue-600/40 text-xs font-mono font-bold text-cyan-300">
                  Match: {practiceMatchPercent}%
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/90 backdrop-blur-md border border-blue-900/50 text-xs text-slate-300">
                <span className="font-semibold text-cyan-300 block mb-0.5">Instruction:</span>
                {practiceSign.instructions}
              </div>
            </div>

            <button
              onClick={stopPracticeCamera}
              className="w-full py-2.5 rounded-xl bg-[#0A1226] hover:bg-[#101C3D] text-xs font-semibold text-slate-200 transition-all"
            >
              Done Practicing
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
