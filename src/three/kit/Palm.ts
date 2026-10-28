import * as THREE from 'three';
import { bevelBox, groundContact } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

/** Thick fronds. A paper triangle aliases to a green line at this size. */
export function Palm(palette: KitPalette, scale = 1) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 0.58, 8), clay(palette.trunk, 0.78));
  trunk.position.y = 0.29;
  trunk.castShadow = true;
  group.add(trunk);

  const leaf = clay(palette.leaf, 0.58);
  const frondGeo = bevelBox(0.46, 0.09, 0.2, 0.028, 2);
  const count = 7;
  for (let i = 0; i < count; i += 1) {
    const arm = new THREE.Group();
    const frond = new THREE.Mesh(frondGeo, leaf);
    frond.position.x = 0.2;
    frond.castShadow = true;
    arm.add(frond);
    arm.rotation.y = (i / count) * Math.PI * 2 + 0.4;
    arm.rotation.z = -0.62;
    arm.position.y = 0.54;
    group.add(arm);
  }
  group.add(groundContact(0.26, 0.26));
  group.scale.setScalar(scale);
  return group;
}
