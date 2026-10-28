import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface JazzAudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isDucked: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  setSpeechDucking: (ducking: boolean) => void;
}

const JazzAudioContext = createContext<JazzAudioContextType | undefined>(undefined);

export const JazzAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.35); // Gentle starting volume
  const [isDucked, setIsDucked] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/gentle-lounge-jazz.wav');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Smooth volume ducking synchronization with voice agent
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = 0;
      return;
    }

    // When voice assistant speaks, automatically duck background music to 12% (0.12 * userVolume)
    const targetVolume = isDucked ? Math.min(volume * 0.15, 0.05) : volume;
    
    // Smooth fade over 200ms
    const step = 0.02;
    const interval = 20;
    const fadeTimer = setInterval(() => {
      if (!audioRef.current) {
        clearInterval(fadeTimer);
        return;
      }
      const current = audioRef.current.volume;
      const diff = targetVolume - current;
      if (Math.abs(diff) < step) {
        audioRef.current.volume = targetVolume;
        clearInterval(fadeTimer);
      } else {
        audioRef.current.volume = current + (diff > 0 ? step : -step);
      }
    }, interval);

    return () => clearInterval(fadeTimer);
  }, [isDucked, volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Autoplay prevented or audio unavailable:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    audioRef.current.muted = next;
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current && !isMuted && !isDucked) {
      audioRef.current.volume = val;
    }
  };

  const setSpeechDucking = (ducking: boolean) => {
    setIsDucked(ducking);
  };

  return (
    <JazzAudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        isDucked,
        togglePlay,
        toggleMute,
        setVolume,
        setSpeechDucking
      }}
    >
      {children}
    </JazzAudioContext.Provider>
  );
};

export const useJazzAudio = () => {
  const context = useContext(JazzAudioContext);
  if (!context) {
    throw new Error('useJazzAudio must be used within a JazzAudioProvider');
  }
  return context;
};
