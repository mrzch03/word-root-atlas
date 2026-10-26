import { describe, expect, it } from 'vitest';
import { hasScene } from '../registry';
import { portScene } from './port';

describe('port diorama', () => {
  it('is a real scene, and the other roots are not yet', () => {
    expect(hasScene('port')).toBe(true);
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
