import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAX_YAW = THREE.MathUtils.degToRad(25);
const MAX_PITCH = THREE.MathUtils.degToRad(10);

const VERT = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uDepth;
  uniform float uAmp;
  void main() {
    vUv = uv;
    vec4 d = texture2D(uDepth, uv);
    vec3 p = position + normal * d.r * d.a * uAmp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uColor;
  uniform sampler2D uDepth;
  uniform float uDevelop;
  uniform float uSheen;
  void main() {
    float a = texture2D(uDepth, vUv).a;
    if (a < 0.06) discard;
    vec3 col = texture2D(uColor, vUv).rgb;
    float g = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 grey = mix(vec3(0.78), vec3(g), 0.5);
    vec3 rgb = mix(grey, col, clamp(uDevelop, 0.0, 1.0));
    float band = smoothstep(0.16, 0.0, abs(vUv.x - uSheen));
    rgb += band * 0.10 * clamp(uDevelop, 0.0, 1.0);
    gl_FragColor = vec4(rgb, smoothstep(0.06, 0.28, a));
  }
`;

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/**
 * The opened card: a displaced plane you can turn ±25° / ±10°.
 * Cream ground is masked out so the miniature reads as an object.
 */
export default function DioramaCard({
  src,
  depth,
  intro,
}: {
  src: string;
  depth: string;
  intro: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    const mobile = el.clientWidth < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 0.75, 0.1, 20);
    camera.position.z = 4.4;

    const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
    blank.needsUpdate = true;
    const uniforms: {
      uColor: { value: THREE.Texture };
      uDepth: { value: THREE.Texture };
      uDevelop: { value: number };
      uAmp: { value: number };
      uSheen: { value: number };
    } = {
      uColor: { value: blank },
      uDepth: { value: blank },
      uDevelop: { value: intro ? 0 : 1 },
      uAmp: { value: 0.26 },
      uSheen: { value: 0.35 },
    };
    const geo = new THREE.PlaneGeometry(1.5, 2, 64, 86);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    let colorTex: THREE.Texture | undefined;
    let depthTex: THREE.Texture | undefined;
    const pending = { color: false, depth: false };
    const take = (kind: 'color' | 'depth', tex: THREE.Texture) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.NoColorSpace;
      tex.anisotropy = 4;
      if (kind === 'depth') {
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        uniforms.uDepth.value = tex;
        depthTex = tex;
      } else {
        uniforms.uColor.value = tex;
        colorTex = tex;
      }
      pending[kind] = true;
      if (pending.color && pending.depth) el.dataset.ready = 'true';
    };
    loader.load(src, (tex) => take('color', tex));
    loader.load(depth, (tex) => take('depth', tex));

    let yaw = 0;
    let pitch = 0;
    let vy = 0;
    let vp = 0;
    let dragging = false;
    let px = 0;
    let py = 0;
    let introT = 0;
    let ori = false;
    let oriYaw = 0;
    let oriPitch = 0;

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      introT = 99;
      px = e.clientX;
      py = e.clientY;
      vy = 0;
      vp = 0;
      const DeviceOri = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      DeviceOri.requestPermission?.().catch(() => undefined);
    };
    let lastMove = performance.now();
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const step = Math.max(0.008, (now - lastMove) / 1000);
      lastMove = now;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      px = e.clientX;
      py = e.clientY;
      const dyaw = clamp(dx * 0.0055, -0.09, 0.09);
      const dpitch = clamp(dy * 0.0038, -0.05, 0.05);
      yaw = clamp(yaw + dyaw, -MAX_YAW, MAX_YAW);
      pitch = clamp(pitch + dpitch, -MAX_PITCH, MAX_PITCH);
      vy = dyaw / step;
      vp = dpitch / step;
    };
    const onUp = () => {
      dragging = false;
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const onOri = (e: DeviceOrientationEvent) => {
      ori = true;
      oriYaw = clamp((e.gamma ?? 0) / 38, -1, 1) * MAX_YAW;
      oriPitch = clamp(((e.beta ?? 40) - 40) / 48, -1, 1) * MAX_PITCH;
    };
    window.addEventListener('deviceorientation', onOri);

    let last = performance.now();
    let frame = 0;
    const stiffness = 16;
    const damping = 7.2;
    const loop = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frame = requestAnimationFrame(loop);
      if (intro && introT < 1.6) {
        introT += dt;
        const u = Math.min(1, introT / 1.6);
        const s = Math.sin(u * Math.PI);
        yaw = s * THREE.MathUtils.degToRad(20);
        pitch = s * THREE.MathUtils.degToRad(3);
        vy = 0;
        vp = 0;
        uniforms.uDevelop.value = Math.min(1, introT / 0.9);
      } else if (!dragging) {
        const goalY = ori ? oriYaw : 0;
        const goalP = ori ? oriPitch : 0;
        vy += ((goalY - yaw) * stiffness - vy * damping) * dt;
        vp += ((goalP - pitch) * stiffness - vp * damping) * dt;
        yaw = clamp(yaw + vy * dt, -MAX_YAW, MAX_YAW);
        pitch = clamp(pitch + vp * dt, -MAX_PITCH, MAX_PITCH);
        if (Math.abs(yaw) >= MAX_YAW - 1e-4 && Math.sign(vy) === Math.sign(yaw)) vy = 0;
        if (Math.abs(pitch) >= MAX_PITCH - 1e-4 && Math.sign(vp) === Math.sign(pitch)) vp = 0;
        uniforms.uDevelop.value = 1;
      }
      uniforms.uSheen.value = 0.5 + Math.sin(now * 0.0014) * 0.08 + (yaw / MAX_YAW) * 0.28;
      mesh.rotation.y = yaw;
      mesh.rotation.x = pitch;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('deviceorientation', onOri);
      geo.dispose();
      mat.dispose();
      blank.dispose();
      colorTex?.dispose();
      depthTex?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete el.dataset.ready;
    };
  }, [src, depth, intro]);

  return <div ref={host} className="diorama" aria-hidden="true" />;
}
