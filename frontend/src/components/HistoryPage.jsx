import React, { useState, useEffect } from 'react';
import { 
  History, Trash2, Copy, Check, Volume2, Download, Search, 
  Camera, Mic, Clock, ArrowRight 
} from 'lucide-react';
import { historyStorage } from '../services/historyStorage';
import { speechService } from '../services/speechService';

export default function HistoryPage({ setActivePage }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = historyStorage.getHistory();
    setHistoryItems(data);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id, text) => {
    setPlayingId(id);
    speechService.speak(text, {
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null)
    });
  };

  const handleDelete = (id) => {
    const updated = historyStorage.deleteEntry(id);
    setHistoryItems(updated);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire translation history?")) {
      historyStorage.clearHistory();
      setHistoryItems([]);
    }
  };

  const handleExport = () => {
    historyStorage.exportJSON();
  };

  const filtered = historyItems.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-950/60 text-cyan-300 border border-blue-600/40">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Translation History
            </h1>
          </div>
          <p className="text-sm text-blue-200 mt-1">
            Review, listen, export, or manage your past sign language and speech conversions in Electric Blue & Black.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={historyItems.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A1226] hover:bg-[#101C3D] disabled:opacity-40 border border-blue-900/50 text-xs font-medium text-slate-200 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={historyItems.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 disabled:opacity-40 border border-rose-500/20 text-xs font-medium text-rose-300 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter history translations..."
          className="w-full pl-10 pr-4 py-2 rounded-2xl bg-black border border-blue-900/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* History Items List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl p-5 bg-[#040814] backdrop-blur-xl border border-blue-900/40 hover:border-blue-500/40 transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  item.mode === 'live_camera'
                    ? 'bg-blue-950/80 text-cyan-300 border border-blue-600/40'
                    : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {item.mode === 'live_camera' ? <Camera className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  <span>{item.mode === 'live_camera' ? 'Camera Sign' : 'Speech / TTS'}</span>
                </span>

                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{item.formattedDate}</span>
                </span>

                {item.confidence && (
                  <span className="text-[11px] font-mono text-cyan-300 bg-black px-2 py-0.5 rounded border border-blue-900/50">
                    {item.confidence}% Conf.
                  </span>
                )}
              </div>

              <p className="text-base font-semibold text-white leading-relaxed">
                "{item.text}"
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleSpeak(item.id, item.text)}
                title="Speak text aloud"
                className="p-2.5 rounded-xl bg-[#0A1226] hover:bg-[#101C3D] text-slate-300 hover:text-cyan-300 transition-all border border-blue-900/40"
              >
                <Volume2 className={`w-4 h-4 ${playingId === item.id ? 'animate-bounce text-cyan-400' : ''}`} />
              </button>

              <button
                onClick={() => handleCopy(item.id, item.text)}
                title="Copy text to clipboard"
                className="p-2.5 rounded-xl bg-[#0A1226] hover:bg-[#101C3D] text-slate-300 transition-all border border-blue-900/40"
              >
                {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                title="Delete this record"
                className="p-2.5 rounded-xl bg-[#0A1226] hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-all border border-blue-900/40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-3xl bg-[#040814] border border-blue-900/40 p-8">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Translations Recorded Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              When you recognize signs with the live camera or convert speech in the converter, translations will be saved here automatically.
            </p>
            <button
              onClick={() => setActivePage('translator')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/25 hover:opacity-95 transition-all"
            >
              <span>Go to Live Translator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
