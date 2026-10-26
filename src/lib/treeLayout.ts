import { palettes } from '../data/palettes';
import type { RootEntry } from '../data/types';
import type { CollectedWord } from './storage';

export interface LeafSpot {
  word: string;
  gloss: string;
  rootId: string;
  collected: boolean;
  at: number;
  x: number;
  y: number;
  z: number;
}

export interface BranchLayout {
  rootId: string;
  rootLabel: string;
  meaningZh: string;
  color: string;
  points: [number, number, number][];
  leaves: LeafSpot[];
}

export function layoutBranches(list: RootEntry[], words: Record<string, CollectedWord>): BranchLayout[] {
  const first = new Map<string, number>();
  for (const item of Object.values(words)) {
    const prev = first.get(item.rootId);
    if (prev == null || item.at < prev) first.set(item.rootId, item.at);
  }
  const active = [...first.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([id]) => list.find((r) => r.id === id))
    .filter((r): r is RootEntry => !!r);

  const n = active.length;
  return active.map((root, i) => {
    const ang = i * Math.PI * (3 - Math.sqrt(5)) + 0.55;
    const t = n <= 1 ? 0.5 : i / (n - 1);
    const y = 0.85 + t * 2.85;
    const len = 1.35 + (i % 4) * 0.26;
    const lift = 0.38 + (i % 3) * 0.14;
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    const start: [number, number, number] = [cos * 0.16, y, sin * 0.16];
    const mid: [number, number, number] = [cos * len * 0.5, y + lift * 0.55, sin * len * 0.5];
    const end: [number, number, number] = [cos * len, y + lift, sin * len];
    const leaves: LeafSpot[] = root.words.map((word, k) => {
      const u = 0.4 + (0.55 * (k + 1)) / (root.words.length + 0.5);
      const side = (k % 2 === 0 ? 1 : -1) * (0.16 + (k % 3) * 0.055);
      const px = start[0] + (end[0] - start[0]) * u - sin * side;
      const py = start[1] + (end[1] - start[1]) * u + Math.sin(k * 1.4) * 0.035;
      const pz = start[2] + (end[2] - start[2]) * u + cos * side;
      const saved = words[word.word.toLowerCase()];
      return {
        word: word.word,
        gloss: word.gloss,
        rootId: root.id,
        collected: !!saved,
        at: saved?.at ?? 0,
        x: px,
        y: py,
        z: pz,
      };
    });
    return {
      rootId: root.id,
      rootLabel: root.root,
      meaningZh: root.meaningZh,
      color: palettes[root.palette].leaf,
      points: [start, mid, end],
      leaves,
    };
  });
}
