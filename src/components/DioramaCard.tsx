import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAX_YAW = THREE.MathUtils.degToRad(18);
const MAX_PITCH = THREE.MathUtils.degToRad(8);
/** Far → near. Flat planes, no per-pixel displacement. */
const LAYER_Z = [-0.46, -0.12, 0.24, 0.62];

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uDevelop;
  uniform float uSheen;
  uniform float uShow;
  uniform float uDebug;
  uniform vec3 uTint;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float a = tex.a * uShow;
    if (a < 0.02) discard;
    vec3 col = tex.rgb / max(tex.a, 1e-3);
    if (uDebug > 0.5) {
      gl_FragColor = vec4(uTint, a);
      return;
    }
    float g = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 grey = mix(vec3(0.78), vec3(g), 0.5);
    vec3 rgb = mix(grey, col, clamp(uDevelop, 0.0, 1.0));
    float band = smoothstep(0.14, 0.0, abs(vUv.x - uSheen));
    rgb += band * 0.07 * clamp(uDevelop, 0.0, 1.0);
    gl_FragColor = vec4(rgb * a, a);
  }
`;

const SHADOW_FRAG = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - vec2(0.5, 0.5)) * vec2(1.15, 2.6);
    float a = smoothstep(0.52, 0.05, length(p));
    if (a < 0.02) discard;
    gl_FragColor = vec4(0.16, 0.13, 0.10, a * 0.18);
  }
`;

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/**
 * Opened card: four flat planes at different depths.
 * Drag yaws ±18° and pitches ±8°. Nothing is displaced per pixel.
 */
export default function DioramaCard({
  rootId,
  intro,
  debugDepth = false,
}: {
  rootId: string;
  intro: boolean;
  debugDepth?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.background = 'transparent';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 0.75, 0.05, 40);
    camera.position.z = 4.55;

    const group = new THREE.Group();
    scene.add(group);

    const shadowGeo = new THREE.PlaneGeometry(1.7, 2.15);
    const shadowMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: SHADOW_FRAG,
      transparent: true,
      depthWrite: false,
      premultipliedAlpha: true,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.set(0, -1.02, -0.45);
    shadow.renderOrder = 0;
    scene.add(shadow);

    const base = import.meta.env.BASE_URL;
    const layers = [0, 1, 2, 3].map((i) => `${base}layers/${rootId}/${i}.webp`);
    const tints = [
      new THREE.Color('#6a8fbf'),
      new THREE.Color('#7d9a6a'),
      new THREE.Color('#d2b15a'),
      new THREE.Color('#d06a48'),
    ];
    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.ShaderMaterial[] = [];
    const textures: THREE.Texture[] = [];
    const loaded = { n: 0, expect: layers.length };

    const plane = new THREE.PlaneGeometry(1.52, 2.02);
    geos.push(plane);

    layers.forEach((url, index) => {
      const uniforms = {
        uMap: { value: new THREE.Texture() },
        uDevelop: { value: intro ? 0 : 1 },
        uSheen: { value: index === layers.length - 1 ? 0.35 : -1 },
        uShow: { value: intro ? 0 : 1 },
        uDebug: { value: debugDepth ? 1 : 0 },
        uTint: { value: tints[index] ?? tints[0] },
      };
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        premultipliedAlpha: true,
      });
      mats.push(mat);
      const mesh = new THREE.Mesh(plane, mat);
      mesh.position.z = LAYER_Z[index] ?? 0;
      mesh.renderOrder = index + 1;
      group.add(mesh);

      const loader = new THREE.TextureLoader();
      loader.load(url, (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.NoColorSpace;
        tex.premultiplyAlpha = true;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 4;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uMap.value = tex;
        textures.push(tex);
        loaded.n += 1;
        if (loaded.n >= loaded.expect) el.dataset.ready = 'true';
      });
    });

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
    const allowOri = window.matchMedia('(pointer: coarse)').matches;

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
      px = e.clientX;
      py = e.clientY;
      vy = 0;
      vp = 0;
      el.setPointerCapture?.(e.pointerId);
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
      const dyaw = clamp(dx * 0.0042, -0.07, 0.07);
      const dpitch = clamp(dy * 0.0032, -0.04, 0.04);
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
      if (!allowOri || (e.gamma == null && e.beta == null)) return;
      ori = true;
      oriYaw = clamp((e.gamma ?? 0) / 42, -1, 1) * MAX_YAW;
      oriPitch = clamp(((e.beta ?? 40) - 40) / 55, -1, 1) * MAX_PITCH;
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
      const shown = loaded.n >= loaded.expect && getComputedStyle(el).opacity !== '0';
      if (intro && introT < 1.7) {
        if (shown) introT += dt;
        const u = Math.min(1, introT / 1.5);
        const s = Math.sin(u * Math.PI);
        yaw = s * THREE.MathUtils.degToRad(16);
        pitch = s * THREE.MathUtils.degToRad(3);
        vy = 0;
        vp = 0;
      } else if (!dragging) {
        const goalY = ori ? oriYaw : 0;
        const goalP = ori ? oriPitch : 0;
        vy += ((goalY - yaw) * stiffness - vy * damping) * dt;
        vp += ((goalP - pitch) * stiffness - vp * damping) * dt;
        yaw = clamp(yaw + vy * dt, -MAX_YAW, MAX_YAW);
        pitch = clamp(pitch + vp * dt, -MAX_PITCH, MAX_PITCH);
        if (Math.abs(yaw) >= MAX_YAW - 1e-4 && Math.sign(vy) === Math.sign(yaw)) vy = 0;
        if (Math.abs(pitch) >= MAX_PITCH - 1e-4 && Math.sign(vp) === Math.sign(pitch)) vp = 0;
      }
      group.rotation.y = yaw;
      group.rotation.x = pitch;
      // Shadow sits on the page and shifts slightly against the tilt.
      shadow.position.x = -Math.sin(yaw) * 0.16;
      shadow.position.y = -1.02 - Math.sin(pitch) * 0.06;
      const sheen = 0.42 + Math.sin(now * 0.0013) * 0.08 + (yaw / MAX_YAW) * 0.22;
      group.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.ShaderMaterial;
        const delay = index * 0.06;
        const rise = intro ? clamp((introT - delay) / 0.7, 0, 1) : 1;
        const eased = 1 - (1 - rise) ** 3;
        mesh.position.y = (1 - eased) * -0.38;
        mat.uniforms.uDevelop.value = intro ? clamp((introT - delay) / 0.85, 0, 1) : 1;
        mat.uniforms.uShow.value = eased;
        mat.uniforms.uSheen.value = index === group.children.length - 1 ? sheen : -1;
      });
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
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      shadowGeo.dispose();
      shadowMat.dispose();
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      delete el.dataset.ready;
    };
  }, [rootId, intro, debugDepth]);

  return <div ref={host} className="diorama" aria-hidden="true" />;
}
