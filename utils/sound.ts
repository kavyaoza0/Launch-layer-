// Zero-dependency crystalline Web Audio synthesizer for subtle luxury micro-interactions
let audioCtx: AudioContext | null = null;

const NOTES = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50 // C6
];

// Read initial sound state from localStorage or default to false
const getInitialSoundState = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('ascend_sound_enabled');
    return stored === 'true';
  } catch {
    return false;
  }
};

let isSoundEnabled = getInitialSoundState();
const listeners = new Set<(enabled: boolean) => void>();

export const getSoundEnabled = (): boolean => isSoundEnabled;

export const setSoundEnabled = (enabled: boolean): void => {
  isSoundEnabled = enabled;
  try {
    localStorage.setItem('ascend_sound_enabled', String(enabled));
  } catch {
    // Ignore storage issues
  }
  listeners.forEach(fn => fn(enabled));

  // If enabled, initialize and resume context on user gesture
  if (enabled && typeof window !== 'undefined') {
    getAudioContext();
  }
};

export const toggleSound = (): boolean => {
  const next = !isSoundEnabled;
  setSoundEnabled(next);
  if (next) {
    playChime(5); // Pleasing confirmation chime on enable
  }
  return next;
};

export const subscribeSound = (listener: (enabled: boolean) => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/**
 * Play a delicate, harmonic chime
 * @param noteIndex 0-5 corresponding to pentatonic scale
 * @param duration Duration in seconds
 */
export const playChime = (noteIndex: number = 0, duration: number = 0.28): void => {
  if (!isSoundEnabled || typeof window === 'undefined') return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freq = NOTES[noteIndex % NOTES.length];
    const now = ctx.currentTime;

    // Create oscillator and soft low-pass filter
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm, muted lowpass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);

    // Extremely soft luxury volume envelope (gain ~ 0.035)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch {
    // Graceful silent fallback
  }
};

import { useState, useEffect } from 'react';

export const useSound = () => {
  const [enabled, setEnabled] = useState(isSoundEnabled);

  useEffect(() => {
    const unsubscribe = subscribeSound(setEnabled);
    return unsubscribe;
  }, []);

  return {
    isSoundEnabled: enabled,
    toggleSound,
    setSoundEnabled,
    playChime,
  };
};
