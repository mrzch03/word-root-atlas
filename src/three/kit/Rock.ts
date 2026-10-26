import * as THREE from 'three';
import { clay } from './materials';
import type { KitPalette } from './palette';

export function Rock(palette: KitPalette, scale = 1) {
  const geo = new THREE.SphereGeometry(0.16, 8, 6);
  geo.scale(1.15, 0.72, 0.95);
  geo.translate(0, 0.1, 0);
  const mat = clay(palette.stone, 0.86);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const group = new THREE.Group();
  group.add(mesh);
  group.scale.setScalar(scale);
  return group;
}
