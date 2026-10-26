export interface CollectedWord {
  word: string;
  rootId: string;
  at: number;
}

const KEY = 'word-root-atlas.v1';

export function loadCollection(): Record<string, CollectedWord> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { words?: CollectedWord[] };
    const out: Record<string, CollectedWord> = {};
    for (const item of parsed.words ?? []) {
      if (item && typeof item.word === 'string' && typeof item.rootId === 'string') {
        out[item.word.toLowerCase()] = {
          word: item.word,
          rootId: item.rootId,
          at: typeof item.at === 'number' ? item.at : Date.now(),
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function saveCollection(words: Record<string, CollectedWord>) {
  const payload = { words: Object.values(words) };
  localStorage.setItem(KEY, JSON.stringify(payload));
}
