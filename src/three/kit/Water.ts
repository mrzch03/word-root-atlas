import * as THREE from 'three';
import { DEVELOP_GREY } from './materials';
import type { KitPalette } from './palette';
import { rippleNormal } from './geom';

/**
 * A volume of water, bottom on y = 0.
 * The side faces carry the depth tint; the cap carries the ripple.
 */
export function Water(w: number, h: number, d: number, palette: KitPalette) {
  const group = new THREE.Group();
  const bodyH = Math.max(0.05, h - 0.035);
  const geo = new THREE.BoxGeometry(w, bodyH, d, 1, 8, 1);
  geo.translate(0, bodyH / 2, 0);

  const deep = new THREE.Color(palette.seaDeep);
  const shallow = new THREE.Color(palette.sea);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uDeep: { value: deep },
      uShallow: { value: shallow },
      uGrey: { value: DEVELOP_GREY.clone() },
      uDevelop: { value: 1 },
      uHeight: { value: bodyH },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying float vH;
      varying vec3 vPos;
      uniform float uHeight;
      void main() {
        vH = clamp(position.y / max(uHeight, 0.001), 0.0, 1.0);
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vH;
      varying vec3 vPos;
      uniform vec3 uDeep;
      uniform vec3 uShallow;
      uniform vec3 uGrey;
      uniform float uDevelop;
      uniform float uTime;
      void main() {
        float t = smoothstep(0.0, 0.92, vH);
        vec3 water = mix(uDeep, uShallow, t);
        float caustic = sin(vPos.x * 9.0 + uTime) * sin(vPos.z * 7.5 - uTime * 0.85);
        water += vec3(0.05, 0.07, 0.06) * smoothstep(0.55, 1.0, vH) * (0.35 + 0.65 * caustic);
        vec3 col = mix(uGrey, water, uDevelop);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  material.userData.water = true;
  const body = new THREE.Mesh(geo, material);
  body.receiveShadow = true;
  body.castShadow = false;
  group.add(body);

  const normal = rippleNormal();
  const skin = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette.sea),
    roughness: 0.18,
    metalness: 0.04,
    normalMap: normal,
    normalScale: new THREE.Vector2(0.28, 0.28),
    emissive: new THREE.Color(palette.sea),
    emissiveIntensity: 0.18,
  });
  skin.userData.target = new THREE.Color(palette.sea);
  skin.userData.emissiveTarget = new THREE.Color(palette.sea);
  skin.userData.emissiveIntensity = 0.18;
  skin.userData.ripple = normal;
  const top = new THREE.Mesh(new THREE.BoxGeometry(w * 0.992, 0.04, d * 0.992), skin);
  top.position.y = h - 0.02;
  top.receiveShadow = true;
  group.add(top);
  return group;
}
