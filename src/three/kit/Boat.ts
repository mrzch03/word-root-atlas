import * as THREE from 'three';
import { clay, glow } from './materials';
import type { KitPalette } from './palette';

/** Pointed hull, mast, and a lateen sail. Origin sits on the waterline. */
export function Boat(palette: KitPalette, scale = 1) {
  const group = new THREE.Group();
  const hullMat = clay(palette.hull, 0.55);
  const keelMat = clay(palette.keel, 0.42, 0.06);
  const wood = clay(palette.wood, 0.58);
  const sailMat = clay(palette.sail, 0.45);
  sailMat.side = THREE.DoubleSide;
  glow(sailMat, palette.sail, 0.32);

  const plan = new THREE.Shape();
  plan.moveTo(-0.58, 0);
  plan.bezierCurveTo(-0.64, 0.2, -0.22, 0.24, 0.18, 0.2);
  plan.bezierCurveTo(0.52, 0.16, 0.78, 0.07, 0.8, 0);
  plan.bezierCurveTo(0.78, -0.07, 0.52, -0.16, 0.18, -0.2);
  plan.bezierCurveTo(-0.22, -0.24, -0.64, -0.2, -0.58, 0);
  const hullGeo = new THREE.ExtrudeGeometry(plan, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 12,
  });
  hullGeo.rotateX(-Math.PI / 2);
  hullGeo.computeBoundingBox();
  const minY = hullGeo.boundingBox?.min.y ?? 0;
  hullGeo.translate(0, -minY - 0.09, 0);
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.025, 0.28), clay(palette.deck, 0.7));
  deck.position.set(-0.02, 0.045, 0);
  deck.castShadow = true;
  group.add(deck);

  const keel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.035, 0.045), keelMat);
  keel.position.set(0.02, -0.1, 0);
  keel.castShadow = true;
  group.add(keel);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.92, 8), wood);
  mast.position.set(-0.08, 0.5, 0);
  mast.castShadow = true;
  group.add(mast);

  const sailShape = new THREE.Shape();
  sailShape.moveTo(0, 0.02);
  sailShape.lineTo(0.05, 0.98);
  sailShape.quadraticCurveTo(0.5, 0.34, 0.86, 0.04);
  sailShape.closePath();
  const sailGeo = new THREE.ExtrudeGeometry(sailShape, { depth: 0.012, bevelEnabled: false, curveSegments: 8 });
  sailGeo.translate(-0.1, 0.14, -0.006);
  const cloth = new THREE.Mesh(sailGeo, sailMat);
  cloth.castShadow = true;
  group.add(cloth);

  const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.02, 6), wood);
  yard.rotation.z = -0.82;
  yard.position.set(0.26, 0.55, 0);
  yard.castShadow = true;
  group.add(yard);

  group.scale.setScalar(scale);
  return group;
}
