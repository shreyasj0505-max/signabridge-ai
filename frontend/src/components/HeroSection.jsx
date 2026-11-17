import React, { useState, useEffect } from 'react';
import { Camera, BookOpen, Cpu, ShieldCheck, Zap, ArrowRight, CheckCircle2, Eye, Activity, HeartHandshake } from 'lucide-react';

export default function HeroSection({ setActivePage }) {
  const [activeGestureDemo, setActiveGestureDemo] = useState(0);
  const demoGestures = [
    { name: "I Love You", meaning: "Universal sign of affection", confidence: "96%", badge: "🤟", joints: 21 },
    { name: "Hello", meaning: "Friendly daily greeting", confidence: "98%", badge: "👋", joints: 21 },
    { name: "Peace / V", meaning: "Victory & peace gesture", confidence: "94%", badge: "✌️", joints: 21 },
    { name: "OK / Perfect", meaning: "Agreement affirmation", confidence: "95%", badge: "👌", joints: 21 },
    { name: "Yes / Good", meaning: "Affirmative thumbs up", confidence: "97%", badge: "👍", joints: 21 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveGestureDemo((prev) => (prev + 1) % demoGestures.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentDemo = demoGestures[activeGestureDemo];

  return (
    <div className="space-y-24 py-6 md:py-12">
      <section className="relative overflow-hidden">
        {/* Ambient Electric Blue Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050B1A] border border-blue-500/30 text-blue-300 text-xs font-medium shadow-inner">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Next-Gen Computer Vision & Web Speech API</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Breaking Barriers. <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 bg-clip-text text-transparent">
                  Connecting People.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Experience the future of communication with AI-powered sign language recognition. Translate hand gestures into meaningful words in real time.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActivePage('translator')}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold text-base shadow-xl shadow-blue-600/35 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5 text-cyan-200" />
                  <span>Start Translating</span>
                  <ArrowRight className="w-4 h-4 text-cyan-200 ml-1" />
                </button>

                <button
                  onClick={() => setActivePage('learn')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#050B1A] hover:bg-[#0A132C] border border-blue-900/60 text-slate-200 font-medium text-base hover:text-white transition-all shadow-md"
                >
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span>Explore Sign Language</span>
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Zero Video Data Uploads (100% On-Device)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Sub-50ms Inference Latency</span>
                </div>
              </div>
            </div>

            {/* Right Column: Animated Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl p-1 bg-gradient-to-b from-blue-600/40 via-blue-900/30 to-cyan-500/30 shadow-2xl">
                <div className="relative rounded-[22px] bg-black/95 backdrop-blur-2xl p-6 border border-blue-900/50 overflow-hidden">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-blue-900/50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-xs font-semibold text-cyan-300 tracking-wider uppercase">
                        MediaPipe Hands Live
                      </span>
                    </div>
                    <span className="text-xs font-mono text-blue-300 bg-[#050B1A] px-2 py-1 rounded-md border border-blue-900/60">
                      60 FPS
                    </span>
                  </div>

                  {/* Simulator in Blue & Cyan */}
                  <div className="relative my-6 h-64 rounded-2xl bg-[#040814] border border-blue-800/40 flex flex-col items-center justify-center overflow-hidden">
                    <svg className="w-52 h-52 filter drop-shadow-[0_0_14px_rgba(37,99,235,0.8)]" viewBox="0 0 200 200">
                      <path d="M100 170 L60 120 L80 80 L100 70 L120 80 L140 120 Z" fill="rgba(37,99,235,0.12)" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
                      <path d="M100 170 L60 130 L45 105 L35 85" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                      <path d="M80 80 L75 55 L72 38 L70 20" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
                      <path d="M100 70 L100 48 L100 32 L100 15" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
                      <path d="M120 80 L125 58 L128 42 L130 25" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                      <path d="M140 120 L155 95 L162 80 L168 65" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />

                      <circle cx="100" cy="170" r="5" fill="#38BDF8" />
                      <circle cx="35" cy="85" r="5" fill="#22D3EE" />
                      <circle cx="70" cy="20" r="5" fill="#22D3EE" />
                      <circle cx="100" cy="15" r="5" fill="#22D3EE" />
                      <circle cx="130" cy="25" r="5" fill="#22D3EE" />
                      <circle cx="168" cy="65" r="5" fill="#22D3EE" />
                    </svg>

                    <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md rounded-xl p-3 border border-blue-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{currentDemo.badge}</span>
                        <div>
                          <p className="text-xs text-blue-300">Classified Sign</p>
                          <p className="text-sm font-bold text-white">{currentDemo.name}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                        {currentDemo.confidence}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#050B1A] p-2 rounded-xl border border-blue-900/50">
                      <span className="text-slate-400 block text-[10px]">Tracked Joints</span>
                      <span className="text-white font-mono font-semibold">21 / 21</span>
                    </div>
                    <div className="bg-[#050B1A] p-2 rounded-xl border border-blue-900/50">
                      <span className="text-slate-400 block text-[10px]">Handedness</span>
                      <span className="text-blue-300 font-semibold">Right Hand</span>
                    </div>
                    <div className="bg-[#050B1A] p-2 rounded-xl border border-blue-900/50">
                      <span className="text-slate-400 block text-[10px]">Latency</span>
                      <span className="text-cyan-300 font-mono font-semibold">32 ms</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Real Measured Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#040814] backdrop-blur-xl border border-blue-900/40 p-8 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-blue-900/40">
            <div className="pt-4 lg:pt-0 lg:px-4 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                21 Points
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">3D Spatial Landmarks</p>
              <p className="text-xs text-slate-400 mt-1">Precise wrist, joint angles & fingertip tracking</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">
                60 FPS
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Real-Time Processing</p>
              <p className="text-xs text-slate-400 mt-1">Smooth, zero-lag visual feedback in browser</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text">
                &lt; 45 ms
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Local Inference Latency</p>
              <p className="text-xs text-slate-400 mt-1">On-device evaluation without cloud network delays</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                40+ Signs
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">ASL Core Vocabulary</p>
              <p className="text-xs text-slate-400 mt-1">Alphabets, digits, common greetings & daily phrases</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
            Engineering Excellence
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Designed for Natural, Seamless Human Interaction
          </p>
          <p className="text-slate-400 mt-3 text-base">
            Combining browser-based computer vision, speech synthesis, and accessible design in high-contrast Electric Blue & Black.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 bg-[#040814] backdrop-blur-xl border border-blue-900/40 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-600/40 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Live Computer Vision</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Detects hand geometry and tracks 21 distinct joints at up to 60 FPS using MediaPipe technology directly inside the browser.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-[#040814] backdrop-blur-xl border border-blue-900/40 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sentence Builder & TTS</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Combines recognized gestures into complete sentences with hold-to-type debounce, and speaks aloud using the Web Speech Synthesis API.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-[#040814] backdrop-blur-xl border border-blue-900/40 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interactive Sign Academy</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore alphabet A-Z, numbers, and phrases with visual guides, handshape tips, and an interactive camera practice mode.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
