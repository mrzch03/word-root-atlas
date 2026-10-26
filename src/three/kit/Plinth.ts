import * as THREE from 'three';
import { extrudeFootprint, harborShape, type BasinCut } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

/**
 * A cut block of earth. The lowest band is solid stone, so the harbour has a floor.
 * The bands above are bitten out, and those cut faces are the strata.
 */
export function Plinth(w: number, h: number, d: number, palette: KitPalette, basin?: BasinCut) {
  const group = new THREE.Group();
  const strata = [
    { share: 0.22, color: palette.stone, cut: false },
    { share: 0.26, color: palette.soil, cut: true },
    { share: 0.24, color: palette.sand, cut: true },
    { share: 0.28, color: palette.deck, cut: true },
  ];
  let y = 0;
  strata.forEach((layer, i) => {
    const lh = h * layer.share;
    const shape = harborShape(w, d, layer.cut ? basin : undefined);
    const mesh = new THREE.Mesh(extrudeFootprint(shape, lh, 0.01), clay(layer.color, 0.8));
    mesh.position.y = y;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -i;
    mat.polygonOffsetUnits = -i * 2;
    mesh.castShadow = i === strata.length - 1;
    mesh.receiveShadow = true;
    group.add(mesh);
    y += lh;
  });
  return group;
}
