import { atlas, findRootByForm, type WordHit } from '../data';
import type { RootEntry } from '../data/types';

export function normalize(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z'-]/g, '');
}

/** Light English inflections. Only stems of 3+ letters are kept. */
export function inflections(word: string): string[] {
  const out = new Set<string>();
  const add = (s: string) => {
    if (s.length >= 3 && s !== word) out.add(s);
  };
  if (word.endsWith('ies')) add(word.slice(0, -3) + 'y');
  if (word.endsWith('es')) {
    add(word.slice(0, -2));
    add(word.slice(0, -1));
  }
  if (word.endsWith('s') && !word.endsWith('ss')) add(word.slice(0, -1));
  if (word.endsWith('ing')) {
    const stem = word.slice(0, -3);
    add(stem);
    add(stem + 'e');
    if (stem.length >= 2 && stem.at(-1) === stem.at(-2)) add(stem.slice(0, -1));
  }
  if (word.endsWith('ed')) {
    const stem = word.slice(0, -2);
    add(stem);
    add(stem + 'e');
    if (stem.length >= 2 && stem.at(-1) === stem.at(-2)) add(stem.slice(0, -1));
  }
  if (word.endsWith('ly')) add(word.slice(0, -2));
  return [...out];
}

export type Lookup =
  | { kind: 'word'; hit: WordHit; via: string }
  | { kind: 'root'; root: RootEntry }
  | { kind: 'miss'; query: string; suggestions: WordHit[] };

export function lookup(raw: string): Lookup {
  const query = normalize(raw);
  if (!query) return { kind: 'miss', query: '', suggestions: [] };

  const direct = atlas.byWord.get(query);
  if (direct) return { kind: 'word', hit: direct, via: query };

  for (const form of inflections(query)) {
    const hit = atlas.byWord.get(form);
    if (hit) return { kind: 'word', hit, via: form };
  }

  const asRoot = findRootByForm(query);
  if (asRoot) return { kind: 'root', root: asRoot };

  return { kind: 'miss', query, suggestions: suggest(query) };
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const prev = new Array<number>(b.length + 1);
  const next = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    next[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      next[j] = Math.min(next[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = next[j];
  }
  return prev[b.length];
}

export function suggest(query: string, limit = 5): WordHit[] {
  if (query.length < 2) return exemplarHits().slice(0, limit);
  const scored: { hit: WordHit; score: number }[] = [];
  const seen = new Set<string>();
  for (const hit of atlas.words) {
    if (seen.has(hit.word)) continue;
    seen.add(hit.word);
    const w = hit.word.toLowerCase();
    let score = 100;
    const dist = editDistance(query, w);
    if (dist <= 2) score = dist;
    else if (w.startsWith(query) && query.length >= 3) score = 3;
    else if (query.startsWith(w) && query.length - w.length <= 6 && w.length >= 4) score = 4;
    else if (w.includes(query) && query.length >= 4) score = 5;
    if (score < 100) scored.push({ hit, score });
  }
  scored.sort((a, b) => a.score - b.score || a.hit.word.length - b.hit.word.length);
  if (scored.length === 0) return exemplarHits().slice(0, limit);
  return scored.slice(0, limit).map((s) => s.hit);
}

const EXAMPLES = ['transport', 'benevolent', 'spectacle', 'philosophy', 'disaster'];

export function exemplarHits(): WordHit[] {
  return EXAMPLES.map((w) => atlas.byWord.get(w)).filter((h): h is WordHit => !!h);
}

export const EXAMPLE_WORDS = EXAMPLES;
