import * as THREE from 'three';
import { groundContact } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

/** A tiny person: capsule body, round head. */
export function Figure(palette: KitPalette) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 4, 8), clay(palette.cloth, 0.7));
  body.position.y = 0.12;
  body.castShadow = true;
  group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), clay(palette.skin, 0.62));
  head.position.y = 0.24;
  head.castShadow = true;
  group.add(head);
  group.add(groundContact(0.16, 0.14));
  return group;
}
