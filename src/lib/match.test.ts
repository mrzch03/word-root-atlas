import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import prompts from '../../illustration-prompts.json';
import { roots, rootsByHue } from '../data';
import { batchIllustrated } from '../data/provisional';
import { hasSampledColor, rootColor, rootColors } from '../data/rootColors';
import { originStory } from '../data/stories';
import { inflections, lookup, normalize } from './match';

const illustrated = roots.filter((root) => root.illustrated);
const cream = roots.filter((root) => !root.illustrated);
const authored = illustrated.filter((root) => !batchIllustrated.has(root.id));
const batch = illustrated.filter((root) => batchIllustrated.has(root.id));

describe('dataset', () => {
  it('ships about 250 roots, with 78 paintings and the original 42 still fully written', () => {
    expect(roots.length).toBe(250);
    expect(illustrated).toHaveLength(78);
    expect(authored).toHaveLength(42);
    expect(batch).toHaveLength(36);
    expect(cream.length).toBe(roots.length - 78);
    const words = roots.flatMap((root) => root.words.map((word) => word.word.toLowerCase()));
    expect(words.length).toBeGreaterThanOrEqual(300);
    expect(new Set(words).size).toBe(words.length);
    const ids = roots.map((root) => root.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps illustrated roots strict, and cream roots searchable without a picture', () => {
    for (const root of authored) {
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
    for (const root of batch) {
      expect(root.words.length).toBeGreaterThanOrEqual(2);
      expect(root.artAlt.length).toBeGreaterThan(8);
      expect(existsSync(`public/illustrations/${root.id}.webp`)).toBe(true);
      expect(existsSync(`public/thumbs/${root.id}.webp`)).toBe(true);
      expect(hasSampledColor(root.id)).toBe(true);
    }
    for (const root of cream) {
      expect(root.words.length).toBeGreaterThanOrEqual(2);
      expect(root.words.length).toBeLessThanOrEqual(12);
      expect(root.artAlt.length).toBeGreaterThan(8);
      expect(existsSync(`public/illustrations/${root.id}.webp`)).toBe(false);
      for (const word of root.words) {
        expect(word.gloss.trim()).not.toBe('');
        expect(word.parts.length).toBeGreaterThan(0);
        expect(word.parts.every((part) => part.form.trim().length > 0)).toBe(true);
        if (word.example) {
          expect(word.example.toLowerCase()).toContain(word.word.toLowerCase());
          expect(word.exampleZh.trim()).not.toBe('');
        }
      }
    }
  });

  it('matches illustration prompt ids to the painted set only', () => {
    expect(prompts.map((prompt) => prompt.rootId).sort()).toEqual(illustrated.map((root) => root.id).sort());
  });

  it('gives painted roots a measured ramp and a picture, and cream roots a quiet placeholder', () => {
    expect(Object.keys(rootColors).sort()).toEqual(illustrated.map((root) => root.id).sort());
    for (const root of authored) {
      const color = rootColor(root.id);
      expect(hasSampledColor(root.id)).toBe(true);
      expect(color.accent).toMatch(/^#[0-9A-F]{6}$/);
      expect(color.deep).not.toBe(color.accent);
      expect(color.steps).toHaveLength(12);
      expect(color.steps[8]).toBe(color.accent);
      expect(color.steps[10]).toBe(color.deep);
      expect(existsSync(`public/illustrations/${root.id}.webp`)).toBe(true);
      expect(existsSync(`public/thumbs/${root.id}.webp`)).toBe(true);
      expect(existsSync(`public/depth/${root.id}.webp`)).toBe(true);
      for (const layer of [0, 1, 2, 3]) {
        expect(existsSync(`public/layers/${root.id}/${layer}.webp`)).toBe(true);
      }
    }
    const paintedHues = rootsByHue()
      .filter((root) => root.illustrated && !batchIllustrated.has(root.id))
      .map((root) => rootColor(root.id).hue);
    for (let i = 0; i < paintedHues.length; i += 1) {
      const gap = (paintedHues[(i + 1) % paintedHues.length] - paintedHues[i] + 360) % 360;
      expect(gap).toBeGreaterThanOrEqual(4.5);
    }
    for (const root of roots) {
      const story = originStory(root.id);
      expect(story?.originStory.length).toBeGreaterThan(40);
      expect(story?.sources.length).toBeGreaterThan(0);
      const color = rootColor(root.id);
      expect(color.accent).toMatch(/^#[0-9A-F]{6}$/);
      expect(color.steps).toHaveLength(12);
      expect(color.steps[8]).toBe(color.accent);
      if (!root.illustrated) expect(hasSampledColor(root.id)).toBe(false);
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
    expect(lookup('pos')).toMatchObject({ kind: 'root', root: { id: 'pos', illustrated: true } });
    expect(lookup('include')).toMatchObject({ kind: 'word', hit: { word: 'include', root: { id: 'clud', illustrated: true } } });
    expect(lookup('mortal')).toMatchObject({ kind: 'word', hit: { word: 'mortal', root: { id: 'mort', illustrated: true } } });
    expect(lookup('compose')).toMatchObject({ kind: 'word', hit: { word: 'compose', root: { id: 'pos' } } });
    expect(lookup('microbe')).toMatchObject({ kind: 'word', hit: { root: { id: 'micro', illustrated: false } } });
    expect(lookup('ped')).toMatchObject({ kind: 'root', root: { id: 'ped', illustrated: true } });
    expect(lookup('paed')).toMatchObject({ kind: 'root', root: { id: 'paed', root: 'paed' } });
    expect(lookup('manufacture')).toMatchObject({ kind: 'word', hit: { root: { id: 'manu' } } });
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
