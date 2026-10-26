import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/** Sit a geometry on y = 0 and centre it in x/z. */
export function seat(geo: THREE.BufferGeometry) {
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  if (!box) return geo;
  geo.translate(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
  return geo;
}

export interface BasinCut {
  w: number;
  d: number;
  x?: number;
}

/**
 * Footprint in the shape's XY plane.
 * After extrudeFootprint, shape −Y is world +Z, the side the camera rests on.
 * A basin opens that edge.
 */
export function harborShape(w: number, d: number, basin?: BasinCut, radius = 0.11): THREE.Shape {
  const r = Math.min(radius, w * 0.12, d * 0.12);
  const hw = w / 2;
  const hd = d / 2;
  const shape = new THREE.Shape();
  const plain = !basin || basin.w < 0.08 || basin.d < 0.08;
  const bx = basin?.x ?? 0;
  const x0 = basin ? Math.max(-hw + r * 2, bx - basin.w / 2) : 0;
  const x1 = basin ? Math.min(hw - r * 2, bx + basin.w / 2) : 0;
  const inner = basin ? Math.min(hd - r, -hd + basin.d) : 0;
  shape.moveTo(-hw + r, -hd);
  if (!plain && basin && x1 > x0 + 0.05 && inner > -hd + 0.05) {
    shape.lineTo(x0, -hd);
    shape.lineTo(x0, inner);
    shape.lineTo(x1, inner);
    shape.lineTo(x1, -hd);
  }
  shape.lineTo(hw - r, -hd);
  shape.absarc(hw - r, -hd + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(hw, hd - r);
  shape.absarc(hw - r, hd - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-hw + r, hd);
  shape.absarc(-hw + r, hd - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hw, -hd + r);
  shape.absarc(-hw + r, -hd + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

/**
 * Extrude a footprint. Bottom sits on y = 0. The cap faces up, so the key light hits the deck.
 * Shape −Y points to world +Z.
 */
export function extrudeFootprint(shape: THREE.Shape, height: number, bevel = 0.012): THREE.BufferGeometry {
  const lip = Math.min(bevel, height * 0.18);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.02, height - lip * 2),
    bevelEnabled: lip > 0.001,
    bevelThickness: lip,
    bevelSize: lip * 0.65,
    bevelSegments: 1,
    curveSegments: 8,
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  if (box) geo.translate(0, -box.min.y, 0);
  geo.computeVertexNormals();
  return geo;
}

/** A RoundedBox whose bottom sits on y = 0. Radius stays inside the smallest side. */
export function bevelBox(w: number, h: number, d: number, radius = 0.04, segments = 2): THREE.BufferGeometry {
  const ww = Math.max(0.02, w);
  const hh = Math.max(0.02, h);
  const dd = Math.max(0.02, d);
  const r = Math.min(Math.max(0.001, radius), ww * 0.48, hh * 0.48, dd * 0.48);
  const geo = new RoundedBoxGeometry(ww, hh, dd, segments, r);
  geo.translate(0, hh / 2, 0);
  return geo;
}

/** Darken the foot and the tucked faces, so a piece sits without a flat ambient wash. */
export function bakeAo(geo: THREE.BufferGeometry, strength = 0.32): THREE.BufferGeometry {
  geo.computeVertexNormals();
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  const minY = box?.min.y ?? 0;
  const span = Math.max(0.001, (box?.max.y ?? 1) - minY);
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i += 1) {
    const y = (pos.getY(i) - minY) / span;
    const up = norm ? Math.max(0, norm.getY(i)) : 1;
    const tuck = (1 - y) * (1 - up * 0.8);
    const k = Math.max(0.58, 1 - strength * tuck);
    colors[i * 3] = k;
    colors[i * 3 + 1] = k;
    colors[i * 3 + 2] = k;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

/** A softly beveled box whose bottom sits on y = 0. */
export function roundedBox(w: number, h: number, d: number, bevel = 0.028): THREE.BufferGeometry {
  return bevelBox(w, h, d, Math.max(0.008, bevel * 0.85), 2);
}

let contactMat: THREE.MeshBasicMaterial | null = null;

/** A small blob where a piece meets the deck. Shared material, one texture. */
export function groundContact(w: number, d: number): THREE.Mesh {
  if (!contactMat) {
    const map = shadowTexture();
    contactMat = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), contactMat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.012;
  mesh.renderOrder = 2;
  mesh.castShadow = false;
  return mesh;
}

/** Elevation with arch doors and square windows. Extruded, bottom on y = 0. */
export function facade(w: number, h: number, depth: number, arches: number, windows: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(w / 2, h);
  shape.lineTo(-w / 2, h);
  shape.closePath();

  const count = Math.max(0, arches);
  if (count > 0) {
    const gap = w / (count + 1);
    for (let i = 1; i <= count; i += 1) {
      const cx = -w / 2 + gap * i;
      const r = Math.min(0.16, h * 0.28, gap * 0.32);
      const spring = 0.05 + r;
      const hole = new THREE.Path();
      // Opposite winding to the outer wall, or the arch fills back in.
      hole.moveTo(cx - r, 0.04);
      hole.lineTo(cx - r, spring);
      hole.absarc(cx, spring, r, Math.PI, 0, true);
      hole.lineTo(cx + r, 0.04);
      hole.closePath();
      shape.holes.push(hole);
    }
  }

  const wins = Math.max(0, windows);
  if (wins > 0) {
    const gap = w / (wins + 1);
    const wy = h * 0.62;
    for (let i = 1; i <= wins; i += 1) {
      const cx = -w / 2 + gap * i;
      const hw = Math.min(0.07, w * 0.08);
      const hh = Math.min(0.1, h * 0.14);
      const hole = new THREE.Path();
      hole.moveTo(cx - hw, wy - hh);
      hole.lineTo(cx - hw, wy + hh);
      hole.lineTo(cx + hw, wy + hh);
      hole.lineTo(cx + hw, wy - hh);
      hole.closePath();
      shape.holes.push(hole);
    }
  }

  const opened = count > 0 || wins > 0;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    // Bevel plus holes spikes the corners. Openings stay crisp; solid blocks get a lip.
    bevelEnabled: !opened,
    bevelThickness: 0.014,
    bevelSize: 0.012,
    bevelSegments: 1,
    curveSegments: 10,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

/** Soft radial blob, used as the contact shadow on the page. */
export function shadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const g = canvas.getContext('2d');
  if (!g) return new THREE.CanvasTexture(canvas);
  const grad = g.createRadialGradient(128, 128, 10, 128, 128, 96);
  grad.addColorStop(0, 'rgba(62, 44, 32, 0.32)');
  grad.addColorStop(0.5, 'rgba(62, 44, 32, 0.1)');
  grad.addColorStop(1, 'rgba(62, 44, 32, 0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** A gentle ripple normal map. Scrolled on the water. */
export function rippleNormal(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext('2d');
  const data = g?.getImageData(0, 0, size, size);
  if (!g || !data) return new THREE.CanvasTexture(canvas);
  const px = data.data;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      const hx = Math.cos(u * Math.PI * 8) * Math.sin(v * Math.PI * 6) * 0.65;
      const hy = Math.sin(u * Math.PI * 8) * Math.cos(v * Math.PI * 6) * 0.5;
      const nx = -hx;
      const ny = -hy;
      const nz = 1.6;
      const len = Math.hypot(nx, ny, nz);
      const i = (y * size + x) * 4;
      px[i] = (nx / len) * 127 + 128;
      px[i + 1] = (ny / len) * 127 + 128;
      px[i + 2] = (nz / len) * 127 + 128;
      px[i + 3] = 255;
    }
  }
  g.putImageData(data, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.2, 1.6);
  return tex;
}
