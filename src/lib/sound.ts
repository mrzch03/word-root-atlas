import { useSyncExternalStore } from 'react';
import { rootsByHue } from '../data';

const KEY = 'word-root-atlas.sound';
let enabled = typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function soundEnabled() {
  return enabled;
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  localStorage.setItem(KEY, next ? '1' : '0');
  emit();
}

export function useSound() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    soundEnabled,
  );
}

const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0];

/** One soft pentatonic note. No-op unless the listener has turned sound on. */
export function playRoot(rootId: string) {
  if (!enabled || typeof window === 'undefined') return;
  const AudioCtx = window.AudioContext;
  if (!AudioCtx) return;
  const index = Math.max(0, rootsByHue().findIndex((r) => r.id === rootId));
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = SCALE[index % SCALE.length] * (1 + Math.floor(index / SCALE.length) * 0.5);
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.126, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.72);
  osc.onended = () => ctx.close().catch(() => undefined);
}
