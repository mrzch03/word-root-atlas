import * as THREE from 'three';
import { bakeAo, bevelBox, groundContact } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

export function Rock(palette: KitPalette, scale = 1) {
  const group = new THREE.Group();
  const mat = clay(palette.pebble, 0.9, 0, true);
  const a = new THREE.Mesh(bakeAo(bevelBox(0.28, 0.16, 0.22, 0.05, 2), 0.2), mat);
  a.position.set(0, 0, 0);
  a.castShadow = true;
  a.receiveShadow = true;
  group.add(a);
  const b = new THREE.Mesh(bakeAo(bevelBox(0.16, 0.12, 0.14, 0.04, 2), 0.18), mat);
  b.position.set(0.08, 0.1, 0.04);
  b.rotation.y = 0.6;
  b.castShadow = true;
  b.receiveShadow = true;
  group.add(b);
  group.add(groundContact(0.34, 0.28));
  group.scale.setScalar(scale);
  return group;
}
