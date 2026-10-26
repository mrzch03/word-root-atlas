import type { RootEntry } from '../data/types';

export type JourneyMode = 'full' | 'short' | 'brief';

/** How long the word travels before the card takes over. */
export function journeyMode(hadWord: boolean, hadRoot: boolean): JourneyMode {
  if (hadWord) return 'brief';
  if (hadRoot) return 'short';
  return 'full';
}

export function journeyTiming(mode: JourneyMode) {
  if (mode === 'full') return { peel: 340, route: 400, dest: 860, riseAt: 1180, fadeAt: 1240, total: 1780 };
  if (mode === 'short') return { peel: 90, route: 140, dest: 300, riseAt: 460, fadeAt: 520, total: 920 };
  return { peel: 30, route: 50, dest: 90, riseAt: 150, fadeAt: 180, total: 460 };
}

export const PHOTO_MS = 1450;

export function splitSurface(word: string, root: RootEntry) {
  const forms = [root.root, ...root.forms].map((s) => s.toLowerCase()).sort((a, b) => b.length - a.length);
  const lower = word.toLowerCase();
  for (const form of forms) {
    const at = lower.indexOf(form);
    if (at >= 0 && form.length >= 2) {
      return {
        pre: word.slice(0, at),
        mid: word.slice(at, at + form.length),
        post: word.slice(at + form.length),
      };
    }
  }
  return { pre: '', mid: word, post: '' };
}
