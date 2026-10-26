import * as THREE from 'three';
import { facade, roundedBox } from './geom';
import { clay } from './materials';
import type { KitPalette } from './palette';

export function Building(
  opts: {
    w: number;
    h: number;
    d: number;
    arches?: number;
    windows?: number;
    roof?: 'flat' | 'tile';
    parapet?: boolean;
    steps?: number;
  },
  palette: KitPalette,
) {
  const group = new THREE.Group();
  const plaster = clay(palette.plaster, 0.86);
  const shade = clay(palette.plasterShade, 0.9);
  const opening = clay(palette.opening, 0.95);
  const wall = new THREE.Mesh(facade(opts.w, opts.h, opts.d, opts.arches ?? 0, opts.windows ?? 0), plaster);
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  if ((opts.arches ?? 0) > 0 || (opts.windows ?? 0) > 0) {
    const liner = new THREE.Mesh(roundedBox(opts.w * 0.9, opts.h * 0.9, 0.03, 0.004), opening);
    liner.position.set(0, opts.h * 0.02, -opts.d / 2 + 0.05);
    liner.castShadow = false;
    liner.receiveShadow = true;
    group.add(liner);
  }

  const roofColor = opts.roof === 'tile' ? palette.roof : palette.plasterShade;
  const roof = new THREE.Mesh(
    roundedBox(opts.w * 1.08, opts.roof === 'tile' ? 0.1 : 0.06, opts.d * 1.08, 0.016),
    clay(roofColor, opts.roof === 'tile' ? 0.62 : 0.84),
  );
  roof.position.y = opts.h;
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);

  if (opts.parapet !== false && opts.roof !== 'tile') {
    const lip = 0.045;
    const parapetMat = shade;
    const rims = [
      [0, opts.h + 0.05, opts.d / 2, opts.w, lip, 0.04],
      [0, opts.h + 0.05, -opts.d / 2, opts.w, lip, 0.04],
      [-opts.w / 2, opts.h + 0.05, 0, 0.04, lip, opts.d],
      [opts.w / 2, opts.h + 0.05, 0, 0.04, lip, opts.d],
    ] as const;
    for (const [x, y, z, rw, rh, rd] of rims) {
      const rim = new THREE.Mesh(roundedBox(rw, rh, rd, 0.008), parapetMat);
      rim.position.set(x, y, z);
      rim.castShadow = true;
      group.add(rim);
    }
  }

  const steps = opts.steps ?? 0;
  for (let i = 0; i < steps; i += 1) {
    const step = new THREE.Mesh(roundedBox(opts.w * 0.42 - i * 0.04, 0.045, 0.16, 0.008), shade);
    step.position.set(0, i * 0.045, opts.d / 2 + 0.08 + i * 0.14);
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  }
  return group;
}
