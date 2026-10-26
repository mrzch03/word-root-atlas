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
    float dep = d.r * smoothstep(0.12, 0.5, d.a);
    vec3 p = position + normal * dep * uAmp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uColor;
  uniform sampler2D uDepth;
  uniform float uDevelop;
  uniform float uSheen;
  uniform float uDebug;
  uniform vec2 uTilt;
  void main() {
    float a = texture2D(uDepth, vUv).a;
    if (a < 0.42) discard;
    float alpha = smoothstep(0.42, 0.78, a);
    float dep = texture2D(uDepth, vUv).r;
    if (uDebug > 0.5) {
      gl_FragColor = vec4(vec3(dep), 1.0);
      return;
    }
    // Parallax: nearer texels slide farther than the back wall.
    vec2 uv = vUv - uTilt * (dep - 0.15) * 0.22;
    uv = clamp(uv, vec2(0.002), vec2(0.998));
    // Step inside the matte so the cream rim is not sampled.
    uv = mix(uv, vec2(0.5), (1.0 - smoothstep(0.55, 1.0, a)) * 0.012);
    vec3 col = texture2D(uColor, uv).rgb;
    float g = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 grey = mix(vec3(0.78), vec3(g), 0.5);
    vec3 rgb = mix(grey, col, clamp(uDevelop, 0.0, 1.0));
    float band = smoothstep(0.16, 0.0, abs(vUv.x - uSheen));
    rgb += band * 0.08 * clamp(uDevelop, 0.0, 1.0);
    gl_FragColor = vec4(rgb, alpha);
  }
`;

const SHADOW_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SHADOW_FRAG = /* glsl */ `
  varying vec2 vUv;
  void main() {
    // A soft ellipse on the page, under the miniature. Not a copy of the silhouette.
    vec2 p = (vUv - vec2(0.5, 0.58)) * vec2(1.35, 3.1);
    float e = length(p);
    float a = smoothstep(0.55, 0.08, e);
    if (a < 0.02) discard;
    gl_FragColor = vec4(0.11, 0.09, 0.07, a * 0.42);
  }
`;

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/**
 * Opened card: a displaced plane, turned ±25° / ±10°.
 * The contact shadow sits on the page and slides as the mesh turns.
 */
export default function DioramaCard({
  src,
  depth,
  intro,
  debugDepth = false,
}: {
  src: string;
  depth: string;
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
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    const mobile = el.clientWidth < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.background = 'transparent';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 0.75, 0.05, 40);
    camera.position.z = 5.35;

    const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
    blank.needsUpdate = true;
    const uniforms: {
      uColor: { value: THREE.Texture };
      uDepth: { value: THREE.Texture };
      uDevelop: { value: number };
      uAmp: { value: number };
      uSheen: { value: number };
      uDebug: { value: number };
      uTilt: { value: THREE.Vector2 };
    } = {
      uColor: { value: blank },
      uDepth: { value: blank },
      uDevelop: { value: intro ? 0 : 1 },
      uAmp: { value: 1.45 },
      uSheen: { value: 0.35 },
      uDebug: { value: debugDepth ? 1 : 0 },
      uTilt: { value: new THREE.Vector2() },
    };
    const geo = new THREE.PlaneGeometry(1.5, 2, 80, 106);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 2;

    const shadowGeo = new THREE.PlaneGeometry(1.85, 2.25);
    const shadowMat = new THREE.ShaderMaterial({
      vertexShader: SHADOW_VERT,
      fragmentShader: SHADOW_FRAG,
      transparent: true,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.z = -0.55;
    shadow.position.y = -0.95;
    shadow.renderOrder = 1;
    scene.add(shadow);
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
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uDepth.value = tex;
        depthTex = tex;
      } else {
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
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
    const allowOri = window.matchMedia('(pointer: coarse)').matches;

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
      if (!allowOri || (e.gamma == null && e.beta == null)) return;
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
        const shown = pending.color && pending.depth && getComputedStyle(el).opacity === '1';
        if (shown) introT += dt;
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
      uniforms.uTilt.value.set(Math.sin(yaw), -Math.sin(pitch));
      mesh.rotation.y = yaw;
      mesh.rotation.x = pitch;
      shadow.position.x = Math.sin(yaw) * 0.85;
      shadow.position.y = -0.95 - Math.sin(pitch) * 0.2;
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
      shadowGeo.dispose();
      shadowMat.dispose();
      blank.dispose();
      colorTex?.dispose();
      depthTex?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete el.dataset.ready;
    };
  }, [src, depth, intro, debugDepth]);

  return <div ref={host} className="diorama" aria-hidden="true" />;
}
