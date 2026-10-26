import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import prompts from '../../illustration-prompts.json';
import { roots } from '../data';
import { rootColor, rootColors } from '../data/rootColors';
import { inflections, lookup, normalize } from './match';

describe('dataset', () => {
  it('has 40+ roots and 300+ words, 6–12 each, all unique', () => {
    expect(roots.length).toBeGreaterThanOrEqual(40);
    const words = roots.flatMap((r) => r.words.map((w) => w.word.toLowerCase()));
    expect(words.length).toBeGreaterThanOrEqual(300);
    expect(new Set(words).size).toBe(words.length);
    for (const root of roots) {
      expect(root.words.length).toBeGreaterThanOrEqual(6);
      expect(root.words.length).toBeLessThanOrEqual(12);
      expect(root.story.length).toBeGreaterThan(20);
      expect(root.artAlt.length).toBeGreaterThan(8);
      for (const word of root.words) {
        expect(word.gloss.trim()).not.toBe('');
        expect(word.parts.length).toBeGreaterThan(0);
        expect(word.example.toLowerCase()).toContain(word.word.toLowerCase());
        expect(word.exampleZh.trim()).not.toBe('');
      }
    }
  });

  it('matches illustration prompt ids', () => {
    const ids = new Set(roots.map((r) => r.id));
    expect(prompts.map((p) => p.rootId).sort()).toEqual([...ids].sort());
  });

  it('gives every root an OKLCH ramp and a picture', () => {
    expect(Object.keys(rootColors).sort()).toEqual(roots.map((r) => r.id).sort());
    for (const root of roots) {
      const color = rootColor(root.id);
      expect(color.accent).toMatch(/^#[0-9A-F]{6}$/);
      expect(color.deep).not.toBe(color.accent);
      expect(color.steps).toHaveLength(12);
      expect(existsSync(`public/illustrations/${root.id}.webp`)).toBe(true);
      expect(existsSync(`public/depth/${root.id}.webp`)).toBe(true);
    }
  });
});

describe('lookup', () => {
  it('matches case and simple inflections', () => {
    expect(lookup('Transport').kind).toBe('word');
    expect(lookup('TRANSPORTING')).toMatchObject({ kind: 'word', hit: { word: 'transport' } });
    expect(lookup('spectacles')).toMatchObject({ kind: 'word', hit: { word: 'spectacle' } });
    expect(lookup('dictionaries')).toMatchObject({ kind: 'word', hit: { word: 'dictionary' } });
    expect(lookup('benevolently')).toMatchObject({ kind: 'word', hit: { word: 'benevolent' } });
    expect(lookup('catalogue')).toMatchObject({ kind: 'word', hit: { word: 'catalog' } });
  });

  it('opens a root family when the root itself is typed', () => {
    expect(lookup('spect')).toMatchObject({ kind: 'root', root: { id: 'spect' } });
  });

  it('suggests neighbours instead of dying', () => {
    const miss = lookup('transpor');
    expect(miss.kind).toBe('miss');
    if (miss.kind === 'miss') {
      expect(miss.suggestions.some((s) => s.word === 'transport')).toBe(true);
    }
    expect(normalize('  Hello! ')).toBe('hello');
    expect(inflections('running')).toContain('run');
  });
});
