import { rootColor } from '../../data/rootColors';
import { paletteFrom, type KitPalette } from '../kit/palette';
import type { DioramaScene } from './types';

/**
 * Harbour for portāre, "to carry".
 * The block is cut open toward the camera. Stone stays whole, as the floor.
 * Soil, sand, and the deck stop at the harbour, so the strata and the
 * water's cross-section are both visible. Other roots follow this list.
 */
const H = 0.82;
const D = 2.5;
const BASIN = { w: 1.78, d: 1.32, x: 0.02 };
const DECK = H;
const FLOOR = H * 0.22;
const waterW = BASIN.w - 0.1;
const waterD = BASIN.d - 0.05;
const waterH = H - FLOOR - 0.05;
const waterZ = D / 2 - 0.025 - waterD / 2;
const waterY = FLOOR - 0.01;

export const portPalette: KitPalette = paletteFrom(rootColor('port'));

export const portScene: DioramaScene = {
  id: 'port',
  look: [0.18, 0.36, 0.2],
  pieces: [
    {
      kind: 'plinth',
      id: 'plinth',
      at: [0, 0, 0],
      delay: 0,
      w: 3.4,
      h: H,
      d: D,
      basin: BASIN,
    },
    {
      kind: 'water',
      id: 'water',
      at: [BASIN.x ?? 0, waterY, waterZ],
      delay: 0.16,
      w: waterW,
      h: waterH,
      d: waterD,
    },
    {
      kind: 'building',
      id: 'warehouse',
      at: [-0.42, DECK, -0.7],
      yaw: 0.04,
      delay: 0.34,
      w: 1.42,
      h: 0.76,
      d: 0.78,
      arches: 2,
      windows: 2,
      roof: 'flat',
      steps: 3,
    },
    {
      kind: 'building',
      id: 'tower',
      at: [1.05, DECK, -0.58],
      yaw: -0.18,
      delay: 0.46,
      w: 0.64,
      h: 1.12,
      d: 0.64,
      arches: 1,
      windows: 1,
      roof: 'tile',
      parapet: false,
    },
    {
      kind: 'building',
      id: 'house',
      at: [-1.28, DECK, 0.38],
      yaw: 0.22,
      delay: 0.54,
      w: 0.6,
      h: 0.5,
      d: 0.48,
      arches: 1,
      roof: 'tile',
      parapet: false,
    },
    {
      kind: 'dock',
      id: 'dock',
      at: [0.78, DECK - 0.05, 0.58],
      yaw: 0.06,
      delay: 0.5,
      length: 0.98,
      width: 0.34,
    },
    { kind: 'palm', id: 'palm', at: [-0.55, 0.74, 0.42], delay: 0.58, scale: 1.15 },
    { kind: 'amphora', id: 'jar-a', at: [-0.12, DECK, -0.22], yaw: 0.4, delay: 0.64, scale: 0.92 },
    { kind: 'amphora', id: 'jar-b', at: [0.18, DECK, -0.16], yaw: -0.6, delay: 0.7, scale: 0.66 },
    { kind: 'rock', id: 'rock-a', at: [1.4, DECK, 0.92], delay: 0.6, scale: 1.05 },
    { kind: 'rock', id: 'rock-b', at: [0.55, FLOOR, 1.02], delay: 0.66, scale: 0.72 },
    { kind: 'figure', id: 'porter', at: [0.48, DECK, -0.28], yaw: 0.7, delay: 0.76 },
    {
      kind: 'boat',
      id: 'boat',
      at: [0.02, waterY + waterH - 0.02, waterZ - 0.04],
      yaw: -0.42,
      delay: 0.9,
      scale: 0.9,
    },
  ],
};
