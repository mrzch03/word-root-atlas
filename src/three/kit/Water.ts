import * as THREE from 'three';
import { DEVELOP_GREY } from './materials';
import type { KitPalette } from './palette';

/**
 * A volume of water, bottom on y = 0.
 * Transmission against a clear canvas samples black, so the depth, the ripple,
 * and the glint are in one shader. The cut face is the gradient.
 */
export function Water(w: number, h: number, d: number, palette: KitPalette) {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d, 1, 10, 1);
  geo.translate(0, h / 2, 0);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    premultipliedAlpha: true,
    toneMapped: false,
    uniforms: {
      uDeep: { value: new THREE.Color(palette.seaDeep) },
      uShallow: { value: new THREE.Color(palette.sea) },
      uGrey: { value: DEVELOP_GREY.clone() },
      uDevelop: { value: 1 },
      uHeight: { value: h },
      uTime: { value: 0 },
      uLight: { value: new THREE.Vector3(-4.6, 8.4, 2.8).normalize() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vPos;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vPos = position;
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = cameraPosition - world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vPos;
      varying vec3 vNormal;
      varying vec3 vView;
      uniform vec3 uDeep;
      uniform vec3 uShallow;
      uniform vec3 uGrey;
      uniform float uDevelop;
      uniform float uHeight;
      uniform float uTime;
      uniform vec3 uLight;
      void main() {
        float h = clamp(vPos.y / max(uHeight, 0.001), 0.0, 1.0);
        vec3 n = normalize(vNormal);
        float up = smoothstep(0.45, 1.0, n.y);
        float wave = sin(vPos.x * 9.0 + uTime) * sin(vPos.z * 7.0 - uTime * 0.75);
        float wave2 = cos(vPos.x * 5.5 - uTime * 0.45) * sin(vPos.z * 6.5 + uTime * 0.3);
        n.x += (wave * 0.18 + wave2 * 0.08) * up;
        n.z += (wave2 * 0.16 - wave * 0.06) * up;
        n = normalize(n);
        vec3 water = mix(uDeep, uShallow, smoothstep(0.05, 0.9, h));
        vec3 L = normalize(uLight);
        float ndl = clamp(dot(n, L), 0.0, 1.0);
        vec3 V = normalize(vView);
        vec3 H = normalize(L + V);
        float spec = pow(clamp(dot(n, H), 0.0, 1.0), 56.0) * up;
        float glint = smoothstep(0.72, 1.0, sin(vPos.x * 14.0 + uTime * 1.3) * sin(vPos.z * 11.0 - uTime));
        water *= 0.78 + 0.22 * ndl;
        water += vec3(1.0, 0.95, 0.88) * (spec * 0.85 + glint * up * 0.12);
        float alpha = mix(0.94, 0.78, h);
        vec3 col = mix(uGrey, water, uDevelop);
        vec3 x = col * 1.2;
        col = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
        gl_FragColor = vec4(col * alpha, alpha);
      }
    `,
  });
  material.userData.water = true;
  const body = new THREE.Mesh(geo, material);
  body.receiveShadow = true;
  body.castShadow = false;
  group.add(body);
  return group;
}
