import * as THREE from 'three';
import { groundContact } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

export function Amphora(palette: KitPalette, scale = 1) {
  const pts = [
    new THREE.Vector2(0.012, 0),
    new THREE.Vector2(0.07, 0.012),
    new THREE.Vector2(0.11, 0.08),
    new THREE.Vector2(0.112, 0.16),
    new THREE.Vector2(0.078, 0.24),
    new THREE.Vector2(0.042, 0.3),
    new THREE.Vector2(0.058, 0.34),
    new THREE.Vector2(0.036, 0.37),
  ];
  const geo = new THREE.LatheGeometry(pts, 20);
  const mesh = new THREE.Mesh(geo, clay(palette.clay, 0.58));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const group = new THREE.Group();
  group.add(mesh);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.01, 6, 12, Math.PI), clay(palette.clay, 0.58));
  handle.position.set(0.07, 0.3, 0);
  handle.rotation.z = -0.4;
  group.add(handle);
  group.add(groundContact(0.22 * scale, 0.18 * scale));
  group.scale.setScalar(scale);
  return group;
}
