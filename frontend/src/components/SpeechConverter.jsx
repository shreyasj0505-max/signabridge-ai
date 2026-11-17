import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, Copy, Check, Trash2, Play, Square 
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { historyStorage } from '../services/historyStorage';

export default function SpeechConverter() {
  const [isListening, setIsListening] = useState(false);
  const [sttTranscript, setSttTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [sttCopied, setSttCopied] = useState(false);
  const [sttError, setSttError] = useState(null);

  const [ttsInput, setTtsInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);

  const quickPhrases = [
    "Hello! Nice to meet you.",
    "I am deaf / hard of hearing. Thank you for your patience.",
    "Could you please speak into this microphone?",
    "Where is the nearest restroom?",
    "Could you write that down for me, please?",
    "Thank you very much for your help!",
    "Have a wonderful day!"
  ];

  useEffect(() => {
    const loadVoices = () => {
      const available = speechService.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        const enVoice = available.find(v => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB")) || available[0];
        setSelectedVoice(enVoice);
      }
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setSttError(null);
      const rec = speechService.startListening({
        onStart: () => setIsListening(true),
        onEnd: () => setIsListening(false),
        onTranscript: ({ final, interim }) => {
          if (final) {
            setSttTranscript(prev => (prev ? prev + " " + final : final));
          }
          setInterimTranscript(interim);
        },
        onError: (err) => {
          setIsListening(false);
          setSttError(err.error === 'not-allowed' 
            ? "Microphone access was denied. Please allow microphone permission in your browser."
            : `Speech recognition error: ${err.error || 'Check microphone connection.'}`);
        }
      });

      if (!rec) {
        setIsListening(false);
        setSttError("Speech Recognition API is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      }
    }
  };

  const clearStt = () => {
    setSttTranscript("");
    setInterimTranscript("");
  };

  const copyStt = () => {
    const fullText = (sttTranscript + " " + interimTranscript).trim();
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setSttCopied(true);
    setTimeout(() => setSttCopied(false), 2000);
  };

  const handleSpeak = (textToSpeak = ttsInput) => {
    const text = textToSpeak.trim();
    if (!text) return;

    setIsSpeaking(true);
    speechService.speak(text, {
      voice: selectedVoice,
      rate: speechRate,
      pitch: speechPitch,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });

    historyStorage.addEntry({
      text: text,
      confidence: 100,
      mode: "text_to_speech"
    });
  };

  const stopSpeaking = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-blue-900/40">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-950/60 text-cyan-300 border border-blue-600/40">
            <Mic className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Two-Way Speech & Text Bridge
          </h1>
        </div>
        <p className="text-sm text-blue-200 mt-1">
          Instant Speech-to-Text for hearing individuals speaking to deaf users, and natural Text-to-Speech voice synthesis in Electric Blue & Black.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL 1: STT */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#040814] backdrop-blur-xl border border-blue-600/30 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`} />
                <h3 className="text-base font-bold text-white">
                  Speech to Text (Listen)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-800">
                {isListening ? "Listening Active" : "Standby"}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Tap the microphone and speak. Spoken words will be transcribed in real time for deaf readers.
            </p>

            <div className="min-h-[180px] max-h-[260px] overflow-y-auto p-4 rounded-2xl bg-black border border-blue-900/50">
              {sttTranscript || interimTranscript ? (
                <div className="space-y-1">
                  <span className="text-base font-medium text-white leading-relaxed">
                    {sttTranscript}
                  </span>
                  {interimTranscript && (
                    <span className="text-base font-medium text-cyan-300/80 italic ml-1">
                      {interimTranscript}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Press the microphone button below to start transcribing spoken dialogue...
                </p>
              )}
            </div>

            {isListening && (
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[40, 70, 25, 90, 60, 100, 45, 80, 30, 95, 50, 75, 20].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                    className="w-1 rounded-full bg-gradient-to-t from-blue-600 to-cyan-400 animate-pulse"
                  />
                ))}
              </div>
            )}

            {sttError && (
              <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
                {sttError}
              </p>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-blue-900/40">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={toggleListening}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 animate-pulse'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-blue-600/30 hover:opacity-95'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-cyan-200" />}
                <span>{isListening ? "Stop Microphone" : "Start Speaking into Mic"}</span>
              </button>

              <button
                onClick={copyStt}
                disabled={!sttTranscript && !interimTranscript}
                title="Copy Transcript"
                className="p-4 rounded-2xl bg-[#0A1226] hover:bg-[#101C3D] disabled:opacity-40 text-slate-200 transition-all border border-blue-900/40"
              >
                {sttCopied ? <Check className="w-5 h-5 text-cyan-400" /> : <Copy className="w-5 h-5" />}
              </button>

              <button
                onClick={clearStt}
                disabled={!sttTranscript && !interimTranscript}
                title="Clear Transcript"
                className="p-4 rounded-2xl bg-[#0A1226] hover:bg-[#101C3D] disabled:opacity-40 text-slate-200 transition-all border border-blue-900/40"
              >
                <Trash2 className="w-5 h-5 text-rose-400" />
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 2: TTS */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#040814] backdrop-blur-xl border border-blue-600/30 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Text to Speech (Speak Aloud)
                </h3>
              </div>
              <span className="text-xs font-mono text-blue-300">
                Web Speech Synthesis
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Type or select quick phrases below to synthesize natural voice audio for non-signing listeners.
            </p>

            <textarea
              rows={4}
              value={ttsInput}
              onChange={(e) => setTtsInput(e.target.value)}
              placeholder="Type anything here to be spoken out loud..."
              className="w-full p-4 rounded-2xl bg-black border border-blue-900/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none shadow-inner"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Synthesizer Voice</label>
                <select
                  value={selectedVoice?.name || ""}
                  onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice);
                  }}
                  className="w-full bg-black border border-blue-900/60 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                >
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Speed: {speechRate}x</span>
                  <span>Pitch: {speechPitch}x</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="accent-cyan-400"
                  />
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="accent-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block mb-2">
                Quick Phrases
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPhrases.map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTtsInput(phrase);
                      handleSpeak(phrase);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#0A1226] hover:bg-[#101C3D] text-[11px] text-slate-300 hover:text-white transition-all border border-blue-900/40"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-900/40 flex items-center gap-3">
            <button
              onClick={() => handleSpeak()}
              disabled={!ttsInput.trim() || isSpeaking}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:opacity-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isSpeaking ? "Speaking Audio..." : "Speak Text Aloud"}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-4 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 transition-all"
              >
                <Square className="w-5 h-5 fill-rose-300" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
