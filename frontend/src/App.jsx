import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LiveTranslator from './components/LiveTranslator';
import LearnSigns from './components/LearnSigns';
import SpeechConverter from './components/SpeechConverter';
import HistoryPage from './components/HistoryPage';
import AboutPage from './components/AboutPage';
import Footer from './components/Footer';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col bg-black selection:bg-blue-600 selection:text-white">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      <main className="flex-1">
        {activePage === 'home' && <HeroSection setActivePage={setActivePage} />}
        {activePage === 'translator' && <LiveTranslator soundEnabled={soundEnabled} />}
        {activePage === 'learn' && <LearnSigns soundEnabled={soundEnabled} />}
        {activePage === 'speech' && <SpeechConverter />}
        {activePage === 'history' && <HistoryPage setActivePage={setActivePage} />}
        {activePage === 'about' && <AboutPage setActivePage={setActivePage} />}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
