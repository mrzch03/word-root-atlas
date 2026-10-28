import * as THREE from 'three';
import { bakeAo, bevelBox, groundContact } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

/** Planks, mooring posts, a rope coil, and stairs that climb back to the quay. */
export function Dock(length: number, width: number, palette: KitPalette) {
  const group = new THREE.Group();
  const wood = clay(palette.wood, 0.64, 0, true);
  const planks = 4;
  const gap = width / planks;
  for (let i = 0; i < planks; i += 1) {
    const plank = new THREE.Mesh(bakeAo(bevelBox(length, 0.05, Math.max(0.045, gap - 0.012), 0.012), 0.22), wood);
    plank.position.set(0, 0.05, (i - (planks - 1) / 2) * gap);
    plank.castShadow = true;
    plank.receiveShadow = true;
    group.add(plank);
  }

  const postMat = clay(palette.trunk, 0.7);
  const posts: [number, number][] = [
    [-length / 2 + 0.06, -width * 0.28],
    [-length / 2 + 0.06, width * 0.28],
    [length / 2 - 0.1, 0],
  ];
  for (const [x, z] of posts) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.034, 0.38, 10), postMat);
    post.position.set(x, 0.2, z);
    post.castShadow = true;
    group.add(post);
    const cap = new THREE.Mesh(bevelBox(0.07, 0.028, 0.07, 0.01), postMat);
    cap.position.set(x, 0.39, z);
    cap.castShadow = true;
    group.add(cap);
  }

  const stepMat = clay(palette.stone, 0.84, 0, true);
  for (let i = 0; i < 3; i += 1) {
    const step = new THREE.Mesh(bakeAo(bevelBox(0.15, 0.042, width * 0.72, 0.01)), stepMat);
    step.position.set(length / 2 + 0.08 + i * 0.14, 0.07 + i * 0.05, 0);
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  }

  const rope = clay(palette.wood, 0.78);
  const coil = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.013, 6, 16), rope);
  coil.rotation.x = Math.PI / 2;
  coil.position.set(length * 0.12, 0.09, width * 0.18);
  coil.castShadow = true;
  group.add(coil);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.01, 6, 12), rope);
  inner.rotation.x = Math.PI / 2;
  inner.position.set(length * 0.12, 0.1, width * 0.18);
  inner.castShadow = true;
  group.add(inner);

  group.add(groundContact(length * 0.85, width * 0.9));
  return group;
}
