import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { AIAssistantConfig, TTSVoiceProvider } from '../types';

export type VoiceProvider = TTSVoiceProvider;

interface AssistantAudioContextType {
  // Voice playback
  isSpeaking: boolean;
  isPaused: boolean;
  isMuted: boolean;
  voiceVolume: number;
  voiceProvider: VoiceProvider;
  ttsConfigured: boolean;
  availableVoices: SpeechSynthesisVoice[];
  // Background ambience
  isBackgroundEnabled: boolean;
  backgroundVolume: number;
  backgroundSoundConfigured: boolean;
  backgroundError: string | null;
  // Actions
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  replay: () => void;
  stop: () => void;
  toggleMute: () => void;
  setVoiceVolume: (v: number) => void;
  toggleBackground: () => void;
  setBackgroundVolume: (v: number) => void;
}

const AssistantAudioContext = createContext<AssistantAudioContextType | undefined>(undefined);

const TTS_ENDPOINT = '/api/tts';
const DEFAULT_BACKGROUND_ASSET = '/audio/tech-ambience.mp3';

interface AssistantAudioProviderProps {
  aiConfig: AIAssistantConfig;
  children: React.ReactNode;
}

export const AssistantAudioProvider: React.FC<AssistantAudioProviderProps> = ({ children, aiConfig }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceVolume, setVoiceVolumeState] = useState(aiConfig.defaultVoiceVolume);
  const [voiceProvider, setVoiceProviderState] = useState<VoiceProvider>(aiConfig.voiceProvider);
  const [ttsConfigured, setTtsConfigured] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(aiConfig.backgroundSoundEnabled);
  const [backgroundVolume, setBackgroundVolumeState] = useState(aiConfig.backgroundSoundVolume);
  const [backgroundSoundConfigured, setBackgroundSoundConfigured] = useState(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenTextRef = useRef<string>('');
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const duckingRef = useRef(false);

  const effectiveProvider = voiceProvider === 'browser' || !ttsConfigured ? 'browser' : voiceProvider;

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices().slice());
    loadVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    setVoiceVolumeState(aiConfig.defaultVoiceVolume);
    setVoiceProviderState(aiConfig.voiceProvider);
    setIsBackgroundEnabled(aiConfig.backgroundSoundEnabled);
    setBackgroundVolumeState(aiConfig.backgroundSoundVolume);
  }, [aiConfig.defaultVoiceVolume, aiConfig.voiceProvider, aiConfig.backgroundSoundEnabled, aiConfig.backgroundSoundVolume]);

  const setupBackgroundAudio = useCallback((assetUrl: string) => {
    if (!assetUrl) return;
    const audio = new Audio(assetUrl);
    audio.loop = true;
    audio.preload = 'metadata';
    audio.muted = true;
    audio.volume = 0;
    backgroundAudioRef.current = audio;
    setBackgroundSoundConfigured(true);
    setBackgroundError(null);
  }, []);

  useEffect(() => {
    if (aiConfig.backgroundSoundAsset) {
      setupBackgroundAudio(aiConfig.backgroundSoundAsset);
    } else {
      setBackgroundSoundConfigured(false);
      setBackgroundError(null);
    }
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.src = '';
      }
    };
  }, [aiConfig.backgroundSoundAsset, setupBackgroundAudio]);

  const fadeBackground = useCallback((target: number, duration = 700) => {
    const audio = backgroundAudioRef.current;
    if (!audio || isMuted) return;
    clearInterval(fadeTimerRef.current!);
    const start = audio.volume;
    const diff = target - start;
    const steps = Math.max(2, Math.round(duration / 25));
    let step = 0;
    fadeTimerRef.current = setInterval(() => {
      step += 1;
      const t = step / steps;
      if (!audio) { clearInterval(fadeTimerRef.current!); return; }
      audio.volume = start + diff * t;
      if (step >= steps) { clearInterval(fadeTimerRef.current!); fadeTimerRef.current = null; }
    }, 25);
  }, [isMuted]);

  const duckBackground = (ducking: boolean) => {
    duckingRef.current = ducking;
    if (!backgroundAudioRef.current || !isBackgroundEnabled) return;
    fadeBackground(ducking ? backgroundVolume * 0.15 : backgroundVolume, 500);
  };

  useEffect(() => {
    return () => {
      clearInterval(fadeTimerRef.current!);
      if (ttsAudioRef.current) { ttsAudioRef.current.pause(); ttsAudioRef.current.src = ''; }
      if (backgroundAudioRef.current) { backgroundAudioRef.current.pause(); backgroundAudioRef.current.src = ''; }
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) synthRef.current.cancel();
    if (ttsAudioRef.current) { ttsAudioRef.current.pause(); ttsAudioRef.current.src = ''; }
    setIsSpeaking(false);
    setIsPaused(false);
    duckBackground(false);
    lastSpokenTextRef.current = '';
  }, [duckBackground]);

  const speakViaBrowser = useCallback((text: string) => {
    const synth = synthRef.current;
    if (!synth) {
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.min(Math.max(aiConfig.speakingRate, 0.5), 2);
    utterance.pitch = Math.min(Math.max(aiConfig.pitch, 0), 2);
    utterance.volume = isMuted ? 0 : voiceVolume;
    const voices = synth.getVoices();
    const preferred = voices.find((v) => aiConfig.voiceId && v.name === aiConfig.voiceId);
    if (preferred) {
      utterance.voice = preferred;
    } else {
      // Free browser voices: prefer a natural-sounding mature female voice when available
      const femaleHints = ['female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 'google uk english female', 'microsoft zira', 'google us english female'];
      const femaleVoice = voices.find((v) =>
        femaleHints.some((h) => v.name.toLowerCase().includes(h))
      );
      if (femaleVoice) utterance.voice = femaleVoice;
    }
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      duckBackground(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      duckBackground(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      duckBackground(false);
    };
    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [aiConfig, voiceVolume, isMuted, duckBackground]);

  const speak = useCallback((text: string) => {
    if (!text || !text.trim()) return;
    stop();
    lastSpokenTextRef.current = text;
    setIsPaused(false);

    if (effectiveProvider !== 'browser') {
      fetch(TTS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: aiConfig.voiceId, speed: aiConfig.speakingRate }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`TTS unavailable (${res.status})`);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.muted = isMuted;
          audio.volume = isMuted ? 0 : voiceVolume;
          ttsAudioRef.current = audio;
          audio.onended = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            duckBackground(false);
            URL.revokeObjectURL(url);
          };
          audio.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            duckBackground(false);
            speakViaBrowser(text);
          };
          setIsSpeaking(true);
          duckBackground(true);
          return audio.play();
        })
        .catch(() => speakViaBrowser(text));
      return;
    }
    speakViaBrowser(text);
  }, [aiConfig, voiceVolume, isMuted, effectiveProvider, stop, duckBackground, speakViaBrowser]);

  const pause = useCallback(() => {
    if (effectiveProvider !== 'browser') {
      const audio = ttsAudioRef.current;
      if (audio && !audio.paused) { audio.pause(); setIsPaused(true); return; }
    }
    if (synthRef.current) synthRef.current.pause();
    setIsPaused(true);
  }, [effectiveProvider]);

  const resume = useCallback(() => {
    if (effectiveProvider !== 'browser') {
      const audio = ttsAudioRef.current;
      if (audio && audio.paused) { audio.play(); setIsPaused(false); return; }
    }
    if (synthRef.current) synthRef.current.resume();
    setIsPaused(false);
  }, [effectiveProvider]);

  const replay = useCallback(() => {
    const last = lastSpokenTextRef.current;
    if (last) speak(last);
  }, [speak]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (synthRef.current && utteranceRef.current) utteranceRef.current.volume = next ? 0 : voiceVolume;
      if (ttsAudioRef.current) ttsAudioRef.current.muted = next;
      duckBackground(next);
      return next;
    });
  }, [voiceVolume, duckBackground]);

  const setVoiceVolume = useCallback((v: number) => {
    setVoiceVolumeState(v);
    if (!isMuted) {
      if (utteranceRef.current) utteranceRef.current.volume = v;
      if (ttsAudioRef.current) ttsAudioRef.current.volume = v;
    }
  }, [isMuted]);

  const toggleBackground = useCallback(() => {
    if (!backgroundSoundConfigured) {
      setBackgroundError('Background ambience asset is not configured. Ask an administrator to add a licensed technology ambience track at public/audio/tech-ambience.mp3 and select it in AI Assistant settings.');
      return;
    }
    const audio = backgroundAudioRef.current;
    setIsBackgroundEnabled((prev) => {
      const next = !prev;
      if (!audio) return next;
      if (next) {
        audio.muted = isMuted;
        audio.volume = 0;
        void audio.play().catch((err) => {
          console.warn('Background ambience playback blocked by browser:', err);
          setBackgroundError('Browser blocked autoplay. Interact with the page once, then enable background sound again.');
        });
        fadeBackground(backgroundVolume, 1200);
      } else {
        fadeBackground(0, 800);
        setTimeout(() => { if (audio) audio.pause(); }, 900);
      }
      return next;
    });
  }, [backgroundSoundConfigured, backgroundVolume, isMuted, fadeBackground]);

  const setBackgroundVolume = useCallback((v: number) => {
    setBackgroundVolumeState(v);
    const audio = backgroundAudioRef.current;
    if (audio && !isMuted && !duckingRef.current) audio.volume = v;
  }, [isMuted]);

  return (
    <AssistantAudioContext.Provider
      value={{
        isSpeaking,
        isPaused,
        isMuted,
        voiceVolume,
        voiceProvider: effectiveProvider,
        ttsConfigured,
        availableVoices,
        isBackgroundEnabled,
        backgroundVolume,
        backgroundSoundConfigured,
        backgroundError,
        speak,
        pause,
        resume,
        replay,
        stop,
        toggleMute,
        setVoiceVolume,
        toggleBackground,
        setBackgroundVolume,
      }}
    >
      {children}
    </AssistantAudioContext.Provider>
  );
};

export const useAssistantAudio = () => {
  const context = useContext(AssistantAudioContext);
  if (!context) throw new Error('useAssistantAudio must be used within an AssistantAudioProvider');
  return context;
};
