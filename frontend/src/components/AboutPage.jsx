import React from 'react';
import { 
  Info, Cpu, ShieldCheck, HeartHandshake, Code, Database, CheckCircle2 
} from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      
      {/* Header */}
      <div className="pb-4 border-b border-blue-900/40">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-950/60 text-cyan-300 border border-blue-600/40">
            <Info className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            About SignaBridge AI
          </h1>
        </div>
        <p className="text-sm text-blue-200 mt-1">
          The mission, computer vision architecture, and machine learning principles in Electric Blue & Black.
        </p>
      </div>

      {/* 1. Purpose & Mission */}
      <section className="rounded-3xl p-8 bg-[#040814] backdrop-blur-xl border border-blue-900/40 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          <span>Our Core Purpose</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          Eliminating Communication Barriers for the Deaf Community
        </h2>
        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
          Sign language is a rich, natural language with its own grammar and linguistic syntax. However, the vast majority of hearing individuals have never had the opportunity to learn it. This creates persistent daily barriers in healthcare, emergency situations, education, and social spaces.
        </p>
        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
          <strong className="text-white">SignaBridge AI</strong> was engineered to bridge this gap. By combining real-time computer vision with browser speech synthesis and voice recognition, SignaBridge AI allows non-signers and signers to communicate freely without expensive specialized hardware.
        </p>
      </section>

      {/* 2. System Architecture Diagram */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            System Design
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            End-to-End AI Recognition Pipeline
          </h2>
        </div>

        <div className="p-8 rounded-3xl bg-black border border-blue-900/50 shadow-2xl overflow-x-auto">
          <div className="min-w-[680px] grid grid-cols-4 gap-4 relative">
            <div className="p-4 rounded-2xl bg-[#040814] border border-blue-900/40 space-y-2 text-center">
              <span className="text-xs font-mono font-bold text-blue-400">STAGE 01</span>
              <h4 className="text-sm font-bold text-white">Video Input</h4>
              <p className="text-[11px] text-slate-400">
                WebRTC captures user camera frames at 60 FPS in local memory.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#040814] border border-blue-900/40 space-y-2 text-center">
              <span className="text-xs font-mono font-bold text-cyan-400">STAGE 02</span>
              <h4 className="text-sm font-bold text-white">MediaPipe Tracking</h4>
              <p className="text-[11px] text-slate-400">
                Detects hands and extracts 21 3D spatial joint coordinates.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#040814] border border-blue-900/40 space-y-2 text-center">
              <span className="text-xs font-mono font-bold text-blue-300">STAGE 03</span>
              <h4 className="text-sm font-bold text-white">Feature Extraction</h4>
              <p className="text-[11px] text-slate-400">
                Scale invariant normalization, finger extension ratios, and pinch analysis.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#040814] border border-blue-900/40 space-y-2 text-center">
              <span className="text-xs font-mono font-bold text-emerald-400">STAGE 04</span>
              <h4 className="text-sm font-bold text-white">Inference & TTS</h4>
              <p className="text-[11px] text-slate-400">
                Matches ASL signatures, builds sentence, and speaks aloud via Web Speech API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Technology Stack Breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#040814] border border-blue-900/40 space-y-4">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
            <Code className="w-5 h-5 text-cyan-400" />
            <span>Frontend & Client-Side Vision</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>React.js & Tailwind CSS</strong>: Electric Blue & Black theme.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Google MediaPipe Hands</strong>: Real-time 21 3D landmarks at 60 FPS.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Web Speech API</strong>: Native Text-to-Speech and Speech-to-Text.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>HTML5 Canvas 2D</strong>: Neon skeleton rendering with joint glow.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-[#040814] border border-blue-900/40 space-y-4">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-base">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span>Backend & Machine Learning Pipeline</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Python FastAPI</strong>: Asynchronous REST endpoints with CORS.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>OpenCV</strong>: Computer vision frame capture and preprocessing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Scikit-Learn Random Forest</strong>: Landmark classification models.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Custom Model Training */}
      <section className="rounded-3xl p-8 bg-[#040814] border border-blue-900/40 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Extending the AI Model</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Dataset Format & Custom Sign Training
        </h2>
        <div className="p-4 rounded-2xl bg-black font-mono text-xs text-blue-200 border border-blue-900/50 overflow-x-auto">
          <code>
            # Dataset CSV Schema (63 spatial features + label):<br />
            label, x0, y0, z0, x1, y1, z1, ..., x20, y20, z20<br /><br />
            # Collect new gestures with webcam:<br />
            python ai_model/data_collector.py<br /><br />
            # Train Random Forest / MLP classifier:<br />
            python ai_model/train_model.py
          </code>
        </div>
      </section>

    </div>
  );
}
