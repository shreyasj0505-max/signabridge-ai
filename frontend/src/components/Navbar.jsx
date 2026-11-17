import React, { useState } from 'react';
import { Camera, BookOpen, Mic, History, Info, Sparkles, Volume2, VolumeX, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, soundEnabled, setSoundEnabled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'translator', label: 'Live Translator', icon: Camera },
    { id: 'learn', label: 'Learn Signs', icon: BookOpen },
    { id: 'speech', label: 'Speech Converter', icon: Mic },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/90 border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <span className="text-xl select-none">🤟</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                  SignaBridge
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-blue-300 hidden sm:block tracking-wide">
                Electric Vision Sign System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#050B1A] p-1.5 rounded-2xl border border-blue-900/50 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-200' : 'text-blue-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utility Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Audio chimes enabled" : "Audio chimes muted"}
              aria-label="Toggle audio feedback"
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled 
                  ? 'bg-blue-950/60 border-blue-500/40 text-cyan-300 hover:bg-blue-900/60' 
                  : 'bg-black border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActivePage('translator')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 hover:opacity-95 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4 text-cyan-200" />
              <span>Launch Live</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#050B1A] border border-blue-900/40 text-slate-300"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-900/40 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium text-left ${
                    isActive
                      ? 'bg-blue-900/40 text-cyan-300 border border-blue-700/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
