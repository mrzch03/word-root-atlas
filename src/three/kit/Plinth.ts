import * as THREE from 'three';
import { bakeAo, bevelBox, type BasinCut } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

interface Slab {
  x: number;
  z: number;
  w: number;
  d: number;
}

/** Back bar plus two quay arms. The bite opens on +Z. */
function harbourSlabs(w: number, d: number, basin: BasinCut): Slab[] {
  const front = d / 2;
  const back = -d / 2;
  const inner = front - basin.d;
  const x0 = (basin.x ?? 0) - basin.w / 2;
  const x1 = (basin.x ?? 0) + basin.w / 2;
  const backDepth = Math.max(0.08, inner - back);
  return [
    { x: 0, z: (back + inner) / 2, w, d: backDepth },
    { x: (-w / 2 + x0) / 2, z: (inner + front) / 2, w: Math.max(0.08, x0 + w / 2), d: basin.d },
    { x: (x1 + w / 2) / 2, z: (inner + front) / 2, w: Math.max(0.08, w / 2 - x1), d: basin.d },
  ];
}

/**
 * Cut earth. The lowest band is a whole stone slab, so the harbour has a floor.
 * The bands above stop at the bite. Colours are one earth family, and the top is thin.
 */
export function Plinth(w: number, h: number, d: number, palette: KitPalette, basin?: BasinCut) {
  const group = new THREE.Group();
  const bands = [
    { share: 0.32, color: palette.stone, cut: false },
    { share: 0.28, color: palette.soil, cut: true },
    { share: 0.26, color: palette.sand, cut: true },
    { share: 0.14, color: palette.deck, cut: true },
  ];
  const open = basin && basin.w > 0.12 && basin.d > 0.12 ? basin : undefined;
  let y = 0;
  bands.forEach((band, i) => {
    const lh = h * band.share;
    const mat = clay(band.color, 0.86, 0, true);
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -i;
    mat.polygonOffsetUnits = -i * 2;
    const parts = open && band.cut ? harbourSlabs(w, d, open) : [{ x: 0, z: 0, w, d }];
    for (const part of parts) {
      const geo = bakeAo(bevelBox(part.w + 0.02, lh + 0.01, part.d + 0.02, Math.min(0.055, lh * 0.45), 3), 0.26);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(part.x, y, part.z);
      mesh.castShadow = i === bands.length - 1;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    y += lh;
  });
  if (open) pebbles(group, w, d, h, open, palette);
  return group;
}

/** A few stones pressed into the cut, so the face is not a flat painted band. */
function pebbles(group: THREE.Group, w: number, d: number, h: number, basin: BasinCut, palette: KitPalette) {
  const mat = clay(palette.pebble, 0.94);
  const front = d / 2 - 0.015;
  const inner = front - basin.d;
  const x0 = (basin.x ?? 0) - basin.w / 2;
  const x1 = (basin.x ?? 0) + basin.w / 2;
  const spots: [number, number, number, number][] = [
    [-w * 0.22, h * 0.2, front, 0.036],
    [w * 0.18, h * 0.36, front, 0.028],
    [-w * 0.34, h * 0.5, front, 0.022],
    [w * 0.32, h * 0.16, front, 0.03],
    [x0 + 0.015, h * 0.46, inner + basin.d * 0.35, 0.026],
    [x1 - 0.015, h * 0.3, inner + basin.d * 0.55, 0.032],
    [(x0 + x1) * 0.5, h * 0.22, inner + 0.02, 0.034],
    [x0 + 0.2, h * 0.58, inner + 0.015, 0.02],
  ];
  for (const [x, py, z, s] of spots) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(s, 7, 5), mat);
    mesh.position.set(x, py, z);
    mesh.scale.set(1.15, 0.72, 0.9);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
}
