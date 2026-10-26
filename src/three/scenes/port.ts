import { rootColor } from '../../data/rootColors';
import { paletteFrom, type KitPalette } from '../kit/palette';
import type { DioramaScene } from './types';

/**
 * Harbour for portāre, "to carry".
 * The block is smaller than the card, so the water and the boat stay the hero.
 * Stone is the whole floor. The three bands above stop at the harbour.
 * Other roots follow this list.
 */
const W = 3.05;
const H = 0.76;
const D = 2.35;
const BASIN = { w: 1.62, d: 1.22, x: 0 };
const DECK = H;
const waterW = BASIN.w - 0.12;
const waterD = BASIN.d - 0.06;
const waterY = H * 0.3;
const waterH = H - waterY - 0.045;
const waterZ = D / 2 - 0.02 - waterD / 2;

export const portPalette: KitPalette = paletteFrom(rootColor('port'));

export const portScene: DioramaScene = {
  id: 'port',
  look: [0.02, 0.42, 0.16],
  pieces: [
    {
      kind: 'plinth',
      id: 'plinth',
      at: [0, 0, 0],
      delay: 0,
      w: W,
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
      at: [-0.22, DECK, -0.58],
      yaw: 0.04,
      delay: 0.34,
      w: 0.98,
      h: 0.54,
      d: 0.52,
      arches: 2,
      windows: 2,
      roof: 'flat',
      awning: true,
      steps: 0,
    },
    {
      kind: 'building',
      id: 'tower',
      at: [0.86, DECK, -0.46],
      yaw: -0.16,
      delay: 0.46,
      w: 0.44,
      h: 0.78,
      d: 0.44,
      arches: 1,
      windows: 1,
      roof: 'tile',
      parapet: false,
    },
    {
      kind: 'building',
      id: 'house',
      at: [-1.16, DECK, 0.28],
      yaw: 0.18,
      delay: 0.54,
      w: 0.4,
      h: 0.36,
      d: 0.36,
      arches: 1,
      roof: 'tile',
      parapet: false,
    },
    {
      kind: 'dock',
      id: 'dock',
      at: [0.56, DECK - 0.06, 0.5],
      yaw: 0.04,
      delay: 0.5,
      length: 0.96,
      width: 0.32,
    },
    { kind: 'palm', id: 'palm', at: [-1.18, DECK, 0.78], delay: 0.58, scale: 1.05 },
    { kind: 'amphora', id: 'jar-a', at: [-0.08, DECK, -0.2], yaw: 0.4, delay: 0.64, scale: 0.86 },
    { kind: 'amphora', id: 'jar-b', at: [0.16, DECK, -0.14], yaw: -0.6, delay: 0.7, scale: 0.62 },
    { kind: 'rock', id: 'rock-a', at: [1.16, DECK, 0.7], delay: 0.6, scale: 0.95 },
    { kind: 'rock', id: 'rock-b', at: [0.28, waterY - 0.02, 0.98], delay: 0.66, scale: 0.62 },
    { kind: 'figure', id: 'porter', at: [0.34, DECK, -0.22], yaw: 0.65, delay: 0.76 },
    {
      kind: 'boat',
      id: 'boat',
      at: [-0.04, waterY + waterH - 0.03, waterZ - 0.02],
      yaw: -0.35,
      delay: 0.9,
      scale: 1.08,
    },
  ],
};
