import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPiece } from '../three/kit';
import { develop } from '../three/kit/materials';
import { shadowTexture } from '../three/kit/geom';
import { portPalette, portScene } from '../three/scenes/port';
import type { DioramaScene, ScenePiece } from '../three/scenes/types';

const PITCH_MIN = THREE.MathUtils.degToRad(15);
const PITCH_MAX = THREE.MathUtils.degToRad(55);
const PITCH_HOME = THREE.MathUtils.degToRad(34);
const RADIUS_HOME = 11.2;
const RADIUS_MIN = 8.4;
const RADIUS_MAX = 15;
const INTRO_YAW = -2.55;

const SCENES: Record<string, DioramaScene> = { port: portScene };

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/** Bounce that stays in 0..1, so a falling piece never goes through the floor. */
function bounceOut(t: number) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

function placeCamera(camera: THREE.PerspectiveCamera, yaw: number, pitch: number, radius: number, look: THREE.Vector3) {
  const c = Math.cos(pitch);
  camera.position.set(radius * c * Math.sin(yaw), radius * Math.sin(pitch), radius * c * Math.cos(yaw));
  camera.lookAt(look);
}

interface RigPiece {
  group: THREE.Group;
  rest: THREE.Vector3;
  delay: number;
  intro: 'rise' | 'drop' | 'fill';
  bob: boolean;
}

function introOf(piece: ScenePiece): RigPiece['intro'] {
  if (piece.kind === 'plinth') return 'rise';
  if (piece.kind === 'water') return 'fill';
  return 'drop';
}

/**
 * A real miniature, for the roots that have one.
 * Drag orbits a full turn. Pitch stays between 15° and 55°.
 */
export default function DioramaCard({ rootId, intro }: { rootId: string; intro: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const sceneDef = SCENES[rootId];
    if (!el || !sceneDef) return;
    let disposed = false;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const look = new THREE.Vector3(...sceneDef.look);
    const camera = new THREE.PerspectiveCamera(32, 0.75, 0.05, 40);

    const hemi = new THREE.HemisphereLight('#fff8ef', '#e7c9a4', 0.48);
    scene.add(hemi);
    const key = new THREE.DirectionalLight('#fff6e8', Math.PI * 1.22);
    key.position.set(3.4, 6.8, 2.6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.00035;
    key.shadow.normalBias = 0.035;
    const shadowCam = key.shadow.camera;
    shadowCam.left = -3.2;
    shadowCam.right = 3.2;
    shadowCam.top = 3.2;
    shadowCam.bottom = -3.2;
    shadowCam.near = 0.5;
    shadowCam.far = 16;
    scene.add(key);
    scene.add(key.target);
    key.target.position.copy(look);
    const fill = new THREE.DirectionalLight('#d7ecf6', Math.PI * 0.28);
    fill.position.set(-3.2, 2.4, -2);
    scene.add(fill);

    const blob = shadowTexture();
    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(2.7, 2.05),
      new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false, toneMapped: false }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = -0.02;
    contact.renderOrder = -1;
    scene.add(contact);

    const palette = portPalette;
    const pieces: RigPiece[] = sceneDef.pieces.map((piece) => {
      const group = createPiece(piece, palette);
      group.position.set(piece.at[0], piece.at[1], piece.at[2]);
      group.rotation.y = piece.yaw ?? 0;
      scene.add(group);
      return {
        group,
        rest: group.position.clone(),
        delay: piece.delay,
        intro: introOf(piece),
        bob: piece.kind === 'boat',
      };
    });

    const ripples: THREE.Texture[] = [];
    const waters: THREE.ShaderMaterial[] = [];
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      const mat = mesh.material as THREE.Material | undefined;
      const ripple = mat?.userData?.ripple as THREE.Texture | undefined;
      if (ripple) ripples.push(ripple);
      if (mat instanceof THREE.ShaderMaterial && mat.uniforms.uTime) waters.push(mat);
    });

    let yaw = intro ? INTRO_YAW : 0.55;
    let pitch = PITCH_HOME;
    let radius = RADIUS_HOME;
    let vy = 0;
    let vp = 0;
    let vr = 0;
    let dragging = false;
    let introT = intro ? 0 : 20;
    let lastInteract = intro ? performance.now() : 0;
    let nudgeYaw = 0;
    let nudgePitch = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch: number | null = null;

    const applyPieces = (time: number) => {
      for (const piece of pieces) {
        const p = intro ? clamp((introT - piece.delay) / 0.72, 0, 1) : 1;
        const eased = p <= 0 ? 0 : p >= 1 ? 1 : bounceOut(p);
        piece.group.visible = piece.intro === 'rise' || p > 0;
        if (piece.intro === 'rise') {
          piece.group.position.y = piece.rest.y - (1 - eased) * 0.95;
        } else if (piece.intro === 'fill') {
          piece.group.position.copy(piece.rest);
          piece.group.scale.y = Math.max(0.001, eased);
        } else {
          piece.group.position.y = piece.rest.y + (1 - eased) * 1.35;
          if (piece.bob && p >= 1) {
            piece.group.position.y = piece.rest.y + Math.sin(time * 0.0016 + piece.rest.x) * 0.02;
          }
        }
        develop(piece.group, eased);
      }
    };

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      introT = 99;
      lastInteract = performance.now();
      vy = 0;
      vp = 0;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      el.setPointerCapture?.(e.pointerId);
      const DeviceOri = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      DeviceOri.requestPermission?.().catch(() => undefined);
    };
    let lastMove = performance.now();
    const onMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (!dragging || !prev) return;
      lastInteract = performance.now();
      if (pointers.size >= 2) {
        const pts = [...pointers.values()];
        const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (pinch != null) radius = clamp(radius * (pinch / d), RADIUS_MIN, RADIUS_MAX);
        pinch = d;
        return;
      }
      pinch = null;
      const now = performance.now();
      const step = Math.max(0.008, (now - lastMove) / 1000);
      lastMove = now;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const dyaw = dx * 0.0085;
      const dpitch = -dy * 0.005;
      yaw += dyaw;
      pitch = clamp(pitch + dpitch, PITCH_MIN, PITCH_MAX);
      vy = dyaw / step;
      vp = dpitch / step;
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      pinch = null;
      if (pointers.size === 0) dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      lastInteract = performance.now();
      introT = 99;
      radius = clamp(radius + e.deltaY * 0.0045, RADIUS_MIN, RADIUS_MAX);
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    const allowOri = window.matchMedia('(pointer: coarse)').matches;
    const onOri = (e: DeviceOrientationEvent) => {
      if (!allowOri || e.gamma == null) return;
      nudgeYaw = clamp(e.gamma / 40, -1, 1) * THREE.MathUtils.degToRad(8);
      nudgePitch = clamp(((e.beta ?? 40) - 40) / 50, -1, 1) * THREE.MathUtils.degToRad(5);
    };
    window.addEventListener('deviceorientation', onOri);

    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frame = requestAnimationFrame(loop);
      const shown = getComputedStyle(el).opacity !== '0';
      if (intro && introT < 3.2 && shown) introT += dt;
      if (intro && introT < 2.9) {
        const u = clamp(introT / 2.7, 0, 1);
        yaw = INTRO_YAW + u * Math.PI;
        pitch = PITCH_HOME;
        vy = 0;
        vp = 0;
      } else if (!dragging) {
        const idle = now - lastInteract > 1100;
        if (idle) yaw += dt * 0.22;
        vy *= Math.exp(-3.2 * dt);
        vp *= Math.exp(-3.2 * dt);
        yaw += vy * dt;
        pitch = clamp(pitch + vp * dt, PITCH_MIN, PITCH_MAX);
        radius = clamp(radius + vr * dt, RADIUS_MIN, RADIUS_MAX);
        vr *= Math.exp(-4 * dt);
      }
      for (const tex of ripples) tex.offset.x = now * 0.00004;
      for (const mat of waters) mat.uniforms.uTime.value = now * 0.0015;
      applyPieces(now);
      placeCamera(camera, yaw + nudgeYaw, clamp(pitch + nudgePitch, PITCH_MIN, PITCH_MAX), radius, look);
      renderer.render(scene, camera);
      if (!el.dataset.ready) el.dataset.ready = 'true';
    };
    applyPieces(0);
    placeCamera(camera, yaw, pitch, radius, look);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('deviceorientation', onOri);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mat of mats) {
          const standard = mat as THREE.MeshStandardMaterial;
          standard.map?.dispose();
          standard.normalMap?.dispose();
          mat.dispose();
        }
      });
      blob.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete el.dataset.ready;
    };
  }, [rootId, intro]);

  return <div ref={host} className="diorama" aria-hidden="true" />;
}
