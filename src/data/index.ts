import { greekRoots } from './greek';
import { latinRoots } from './latin';
import { buildScaledRoots } from './provisional';
import { rootColor } from './rootColors';
import type { Lexeme, RootEntry } from './types';

/** Hand-painted roots, then the catalog cards, in editorial rank. Twelve of the catalog cards now have a picture. */
export const roots: RootEntry[] = buildScaledRoots([...latinRoots, ...greekRoots]);

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
  const width = String(roots.length).length;
  return `${String(Math.max(1, i + 1)).padStart(width, '0')} / ${String(roots.length).padStart(width, '0')}`;
}

export function originZh(origin: RootEntry['origin']): string {
  if (origin === 'Latin') return '拉丁语';
  if (origin === 'Greek') return '希腊语';
  return '拉丁语 / 希腊语';
}

export function sharesOrigin(root: RootEntry, origin: 'Latin' | 'Greek'): boolean {
  return root.origin === origin || root.origin === 'Latin + Greek';
}

/** An id or display form wins over another root that merely lists the string as a variant. */
export function findRootByForm(raw: string): RootEntry | null {
  const q = norm(raw);
  if (!q) return null;
  for (const root of roots) {
    if (root.id === q || root.root === q) return root;
  }
  for (const root of roots) {
    if (root.forms.some((form) => form === q)) return root;
  }
  return null;
}
