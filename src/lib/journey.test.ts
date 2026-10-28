import { describe, expect, it } from 'vitest';
import { roots } from '../data';
import { lookup } from './match';
import { journeyMode, journeyTiming, splitSurface } from './journey';

const FAUCET = ['transport', 'biology', 'describe', 'important', 'chronometer'];

describe('root journey', () => {
  it('is fuller the first time and shorter on a repeat', () => {
    expect(journeyMode(false, false)).toBe('full');
    expect(journeyMode(false, true)).toBe('short');
    expect(journeyMode(true, true)).toBe('brief');
    expect(journeyMode(true, false)).toBe('brief');
    const full = journeyTiming('full');
    const short = journeyTiming('short');
    const brief = journeyTiming('brief');
    expect(full.total).toBeGreaterThan(short.total);
    expect(short.total).toBeGreaterThan(brief.total);
    expect(full.total).toBeLessThan(4000);
    expect(full.riseAt).toBeLessThan(full.total);
    expect(short.riseAt).toBeLessThan(short.total);
  });

  it('opens the faucet words and finds the root inside them', () => {
    for (const word of FAUCET) {
      const found = lookup(word);
      expect(found.kind).toBe('word');
      if (found.kind !== 'word') continue;
      const parts = splitSurface(found.hit.word, found.hit.root);
      expect(parts.mid.length).toBeGreaterThan(1);
      expect(found.hit.word.toLowerCase()).toContain(parts.mid.toLowerCase());
    }
    const port = roots.find((r) => r.id === 'port');
    expect(port).toBeTruthy();
    if (!port) return;
    expect(splitSurface('transport', port)).toMatchObject({ pre: 'trans', mid: 'port', post: '' });
    expect(splitSurface('important', port).mid.toLowerCase()).toBe('port');
  });
});
