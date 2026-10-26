import type { ScenePiece } from '../scenes/types';
import { Amphora } from './Amphora';
import { Boat } from './Boat';
import { Building } from './Building';
import { Dock } from './Dock';
import { Figure } from './Figure';
import type { KitPalette } from './palette';
import { Palm } from './Palm';
import { Plinth } from './Plinth';
import { Rock } from './Rock';
import { Water } from './Water';
import * as THREE from 'three';

export function createPiece(piece: ScenePiece, palette: KitPalette): THREE.Group {
  switch (piece.kind) {
    case 'plinth':
      return Plinth(piece.w, piece.h, piece.d, palette, piece.basin);
    case 'water':
      return Water(piece.w, piece.h, piece.d, palette);
    case 'building':
      return Building(piece, palette);
    case 'boat':
      return Boat(palette, piece.scale ?? 1);
    case 'amphora':
      return Amphora(palette, piece.scale ?? 1);
    case 'palm':
      return Palm(palette, piece.scale ?? 1);
    case 'rock':
      return Rock(palette, piece.scale ?? 1);
    case 'figure':
      return Figure(palette);
    case 'dock':
      return Dock(piece.length, piece.width ?? 0.42, palette);
    default:
      return new THREE.Group();
  }
}
