import * as THREE from 'three';
import { clay } from './materials';
import type { KitPalette } from './palette';

export function Palm(palette: KitPalette, scale = 1) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.055, 0.62, 8),
    clay(palette.trunk, 0.8),
  );
  trunk.position.y = 0.31;
  trunk.castShadow = true;
  group.add(trunk);

  const leaf = clay(palette.leaf, 0.62);
  leaf.side = THREE.DoubleSide;
  const frondGeo = new THREE.BufferGeometry();
  frondGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([0, 0, 0, 0.46, 0.015, 0.055, 0.46, 0.015, -0.055, 0, 0, 0, 0.46, 0.015, -0.055, 0.3, -0.01, 0], 3),
  );
  frondGeo.computeVertexNormals();
  for (let i = 0; i < 7; i += 1) {
    const arm = new THREE.Group();
    const frond = new THREE.Mesh(frondGeo, leaf);
    frond.castShadow = true;
    arm.add(frond);
    arm.rotation.y = (i / 7) * Math.PI * 2 + 0.2;
    arm.rotation.z = -0.72;
    arm.position.y = 0.58;
    group.add(arm);
  }
  group.scale.setScalar(scale);
  return group;
}
