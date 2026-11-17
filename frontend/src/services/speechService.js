/**
 * SignaBridge AI - Speech & Audio Services
 * Handles Text-to-Speech (TTS) and Speech-to-Text (STT) via Web Speech API,
 * plus Web Audio API synthetic feedback chimes.
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.audioCtx = null;
    this.voices = [];

    if (typeof window !== "undefined") {
      this.initVoices();
      if (this.synth && this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  getVoices() {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  /**
   * Speak text aloud using browser Text-to-Speech
   */
  speak(text, { voice = null, rate = 1.0, pitch = 1.0, volume = 1.0, onStart = null, onEnd = null } = {}) {
    if (!this.synth) {
      console.warn("Text-to-Speech is not supported in this browser.");
      return false;
    }

    if (!text || text.trim() === "") return false;

    // Cancel any previous speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = Math.max(0.5, Math.min(2.0, pitch));
    utterance.volume = Math.max(0.0, Math.min(1.0, volume));

    if (voice) {
      utterance.voice = voice;
    } else {
      // Prefer standard English voice
      const englishVoice = this.voices.find(v => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB"));
      if (englishVoice) utterance.voice = englishVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;

    this.synth.speak(utterance);
    return true;
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Initialize and start Speech-to-Text
   */
  startListening({ onTranscript, onError, onStart, onEnd }) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError(new Error("Speech Recognition API is not supported in this browser. Please use Chrome or Edge."));
      return null;
    }

    if (this.recognition && this.isListening) {
      this.stopListening();
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (onTranscript) {
        onTranscript({ final, interim });
      }
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (onError) onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      return this.recognition;
    } catch (e) {
      if (onError) onError(e);
      return null;
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }

  /**
   * Play a pleasant subtle audio chime on gesture capture
   */
  playConfirmationChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {
      // Audio autoplay policy
    }
  }
}

export const speechService = new SpeechService();
