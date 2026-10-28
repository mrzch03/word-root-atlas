import { greekRoots } from './greek';
import { latinRoots } from './latin';
import { rootColor } from './rootColors';
import type { Lexeme, RootEntry } from './types';

export const roots: RootEntry[] = [...latinRoots, ...greekRoots];

export interface WordHit {
  word: string;
  lexeme: Lexeme;
  root: RootEntry;
}

export interface AtlasIndex {
  roots: RootEntry[];
  byId: Map<string, RootEntry>;
  byWord: Map<string, WordHit>;
  words: WordHit[];
}

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function buildIndex(list: RootEntry[]): AtlasIndex {
  const byId = new Map<string, RootEntry>();
  const byWord = new Map<string, WordHit>();
  const words: WordHit[] = [];
  for (const root of list) {
    byId.set(root.id, root);
    for (const lexeme of root.words) {
      const hit: WordHit = { word: lexeme.word, lexeme, root };
      words.push(hit);
      for (const surface of [lexeme.word, ...(lexeme.also ?? [])]) {
        byWord.set(norm(surface), hit);
      }
    }
  }
  return { roots: list, byId, byWord, words };
}

export const atlas = buildIndex(roots);

export function rootsByHue(): RootEntry[] {
  return [...roots].sort((a, b) => rootColor(a.id).hue - rootColor(b.id).hue || a.id.localeCompare(b.id));
}

export function specimenNo(id: string): string {
  const i = rootsByHue().findIndex((r) => r.id === id);
  return `${String(Math.max(1, i + 1)).padStart(2, '0')} / ${String(roots.length).padStart(2, '0')}`;
}

export function originZh(origin: RootEntry['origin']): string {
  return origin === 'Latin' ? '拉丁语' : '希腊语';
}

export function findRootByForm(raw: string): RootEntry | null {
  const q = norm(raw);
  if (!q) return null;
  for (const root of roots) {
    if (root.id === q || root.root === q || root.forms.some((f) => f === q)) return root;
  }
  return null;
}
