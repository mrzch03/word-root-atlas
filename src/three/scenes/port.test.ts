import { describe, expect, it } from 'vitest';
import { PROCEDURAL_SCENES, hasScene } from '../registry';
import { portScene } from './port';

describe('port diorama', () => {
  it('keeps the procedural kit in the repo, and off the card', () => {
    expect(PROCEDURAL_SCENES).toBe(false);
    expect(hasScene('port')).toBe(false);
    expect(hasScene('bio')).toBe(false);
    expect(portScene.pieces.map((p) => p.kind)).toEqual(
      expect.arrayContaining(['plinth', 'water', 'building', 'boat', 'dock', 'palm', 'amphora', 'figure', 'rock']),
    );
    expect(portScene.pieces.filter((p) => p.kind === 'boat')).toHaveLength(1);
    const boat = portScene.pieces.find((p) => p.kind === 'boat');
    const plinth = portScene.pieces.find((p) => p.kind === 'plinth');
    expect(boat && plinth && boat.delay > plinth.delay).toBe(true);
  });
});
