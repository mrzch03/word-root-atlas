import * as THREE from 'three';
import { bakeAo, bevelBox, groundContact, roundedBox } from './geom';
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
    awning?: boolean;
  },
  palette: KitPalette,
) {
  const group = new THREE.Group();
  const plaster = clay(palette.plaster, 0.62, 0, true);
  const shade = clay(palette.plasterShade, 0.74, 0, true);
  const opening = clay(palette.opening, 0.9);
  const body = new THREE.Mesh(bakeAo(bevelBox(opts.w, opts.h, opts.d, 0.05, 3), 0.38), plaster);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const arches = opts.arches ?? 0;
  if (arches > 0) {
    const gap = opts.w / (arches + 1);
    for (let i = 1; i <= arches; i += 1) {
      const cx = -opts.w / 2 + gap * i;
      const aw = Math.min(0.2, gap * 0.42);
      const ah = Math.min(opts.h * 0.58, 0.4);
      const hole = new THREE.Mesh(bevelBox(aw, ah, 0.07, Math.min(0.03, aw * 0.4)), opening);
      hole.position.set(cx, 0.015, opts.d / 2 - 0.02);
      hole.receiveShadow = true;
      group.add(hole);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(aw * 0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), opening);
      crown.scale.set(1, 1, 0.28);
      crown.position.set(cx, 0.015 + ah * 0.92, opts.d / 2 - 0.02);
      group.add(crown);
    }
  }

  const wins = opts.windows ?? 0;
  if (wins > 0) {
    const gap = opts.w / (wins + 1);
    for (let i = 1; i <= wins; i += 1) {
      const cx = -opts.w / 2 + gap * i;
      const wy = opts.h * 0.64;
      const win = new THREE.Mesh(bevelBox(0.09, 0.11, 0.06, 0.016), opening);
      win.position.set(cx, wy, opts.d / 2 - 0.012);
      win.receiveShadow = true;
      group.add(win);
      const sill = new THREE.Mesh(bevelBox(0.14, 0.022, 0.06, 0.006), shade);
      sill.position.set(cx, wy - 0.07, opts.d / 2 + 0.012);
      sill.castShadow = true;
      group.add(sill);
    }
  }

  const tiled = opts.roof === 'tile';
  const roof = new THREE.Mesh(
    bevelBox(opts.w * 1.08, tiled ? 0.09 : 0.05, opts.d * 1.08, 0.02, 2),
    clay(tiled ? palette.roof : palette.plasterShade, tiled ? 0.68 : 0.76),
  );
  roof.position.y = opts.h;
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);

  if (opts.parapet !== false && !tiled) {
    const lip = 0.04;
    const rims = [
      [0, opts.h + 0.045, opts.d / 2, opts.w, lip, 0.035],
      [0, opts.h + 0.045, -opts.d / 2, opts.w, lip, 0.035],
      [-opts.w / 2, opts.h + 0.045, 0, 0.035, lip, opts.d],
      [opts.w / 2, opts.h + 0.045, 0, 0.035, lip, opts.d],
    ] as const;
    for (const [x, py, z, rw, rh, rd] of rims) {
      const rim = new THREE.Mesh(roundedBox(rw, rh, rd, 0.008), shade);
      rim.position.set(x, py, z);
      rim.castShadow = true;
      group.add(rim);
    }
  }

  if (opts.awning) {
    const cloth = new THREE.Mesh(bevelBox(opts.w * 0.7, 0.028, opts.d * 0.46, 0.01), clay(palette.roof, 0.66));
    cloth.position.set(0, opts.h * 0.66, opts.d / 2 + 0.06);
    cloth.rotation.x = 0.22;
    cloth.castShadow = true;
    group.add(cloth);
  }

  const steps = opts.steps ?? 0;
  for (let i = 0; i < steps; i += 1) {
    const step = new THREE.Mesh(bevelBox(opts.w * 0.38 - i * 0.03, 0.04, 0.14, 0.008), shade);
    step.position.set(0, i * 0.04, opts.d / 2 + 0.06 + i * 0.12);
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  }

  group.add(groundContact(opts.w * 0.9, opts.d * 0.9));
  return group;
}
