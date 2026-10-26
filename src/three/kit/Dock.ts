import * as THREE from 'three';
import { roundedBox } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

export function Dock(length: number, width: number, palette: KitPalette) {
  const group = new THREE.Group();
  const wood = clay(palette.wood, 0.68);
  const planks = 5;
  const plankW = width / planks - 0.012;
  for (let i = 0; i < planks; i += 1) {
    const plank = new THREE.Mesh(roundedBox(length, 0.04, Math.max(0.03, plankW), 0.006), wood);
    plank.position.set(0, 0.08, (i - (planks - 1) / 2) * (width / planks));
    plank.castShadow = true;
    plank.receiveShadow = true;
    group.add(plank);
  }
  const postMat = clay(palette.trunk, 0.75);
  for (const x of [-length / 2 + 0.04, length / 2 - 0.04]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.22, 8), postMat);
    post.position.set(x, 0.11, 0);
    post.castShadow = true;
    group.add(post);
  }
  return group;
}
