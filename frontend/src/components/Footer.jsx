import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="border-t border-blue-900/40 bg-black/95 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-blue-900/30">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤟</span>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                SignaBridge AI
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Empowering individuals with hearing and speech impairments through real-time computer vision, hand landmark tracking, and assistive voice technologies.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050B1A] border border-blue-900/40 text-[11px] text-blue-300">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>100% On-Device Webcam Privacy Guarantee</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-cyan-300 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('translator')} className="hover:text-cyan-300 transition-colors">
                  Live Translator
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('learn')} className="hover:text-cyan-300 transition-colors">
                  Learn Signs Academy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('speech')} className="hover:text-cyan-300 transition-colors">
                  Speech Converter
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('history')} className="hover:text-cyan-300 transition-colors">
                  Translation History
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Framework
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Google MediaPipe Hands</li>
              <li>Python FastAPI</li>
              <li>Web Speech Synthesis & Recognition</li>
              <li>OpenCV & Scikit-Learn</li>
              <li>WCAG 2.1 AA Compliant</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SignaBridge AI. Built for accessible and inclusive human connection.</p>
          <p className="text-blue-400">
            <span>Electric Blue & Black Edition</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
