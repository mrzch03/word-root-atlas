import type { Lexeme, Morpheme, PaletteName, RootEntry } from './types';

/** Compact word row for contributors. Copy a neighbouring line and keep the glosses real. */
export function w(
  word: string,
  gloss: string,
  pos: string,
  parts: [string, string][],
  example: string,
  exampleZh: string,
  also?: string[],
): Lexeme {
  const morphemes: Morpheme[] = parts.map(([form, g]) => ({ form, gloss: g }));
  return { word, gloss, pos, parts: morphemes, example, exampleZh, also };
}

export function root(
  entry: Omit<RootEntry, 'palette'> & { palette: PaletteName },
): RootEntry {
  return entry;
}
