import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { atlas } from '../data';
import { loadCollection, saveCollection, type CollectedWord } from './storage';

interface CollectionApi {
  words: Record<string, CollectedWord>;
  has: (word: string) => boolean;
  collect: (word: string, rootId: string) => boolean;
  count: number;
  rootCount: number;
  collectedOn: (rootId: string) => number;
}

const Ctx = createContext<CollectionApi | null>(null);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [words, setWords] = useState<Record<string, CollectedWord>>(() =>
    typeof localStorage === 'undefined' ? {} : loadCollection(),
  );

  useEffect(() => {
    saveCollection(words);
  }, [words]);

  const wordsRef = useRef(words);
  wordsRef.current = words;

  const collect = useCallback((word: string, rootId: string) => {
    const key = word.toLowerCase();
    if (wordsRef.current[key]) return false;
    const next = {
      ...wordsRef.current,
      [key]: { word, rootId, at: Date.now() },
    };
    wordsRef.current = next;
    setWords(next);
    return true;
  }, []);

  const api = useMemo<CollectionApi>(() => {
    const list = Object.values(words);
    const roots = new Set(list.map((w) => w.rootId));
    return {
      words,
      has: (word) => !!words[word.toLowerCase()],
      collect,
      count: list.length,
      rootCount: roots.size,
      collectedOn: (rootId) => list.filter((w) => w.rootId === rootId).length,
    };
  }, [words, collect]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCollection() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCollection outside provider');
  return ctx;
}

export function collectedRootsInOrder(words: Record<string, CollectedWord>) {
  const first = new Map<string, number>();
  for (const item of Object.values(words)) {
    const prev = first.get(item.rootId);
    if (prev == null || item.at < prev) first.set(item.rootId, item.at);
  }
  return [...first.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([id]) => atlas.byId.get(id))
    .filter((r): r is NonNullable<typeof r> => !!r);
}
