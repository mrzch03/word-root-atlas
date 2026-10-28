import * as THREE from 'three';

export const DEVELOP_GREY = new THREE.Color('#b9b4ac');

export function clay(hex: string, roughness = 0.72, metalness = 0, ao = false): THREE.MeshStandardMaterial {
  const target = new THREE.Color(hex);
  const mat = new THREE.MeshStandardMaterial({
    color: target.clone(),
    roughness,
    metalness,
    vertexColors: ao,
  });
  mat.userData.target = target;
  return mat;
}

/** A little self-light, so a saturated accent survives tone mapping. Fades in with the develop. */
export function glow(mat: THREE.MeshStandardMaterial, hex: string, intensity: number) {
  mat.emissive = new THREE.Color(0x000000);
  mat.emissiveIntensity = 0;
  mat.userData.emissiveTarget = new THREE.Color(hex);
  mat.userData.emissiveIntensity = intensity;
}

export function develop(root: THREE.Object3D, t: number) {
  const k = Math.min(1, Math.max(0, t));
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (mat instanceof THREE.MeshStandardMaterial && mat.userData.target instanceof THREE.Color) {
        mat.color.copy(DEVELOP_GREY).lerp(mat.userData.target, k);
      }
      if (mat instanceof THREE.MeshStandardMaterial && mat.userData.emissiveTarget instanceof THREE.Color) {
        mat.emissive.copy(mat.userData.emissiveTarget);
        mat.emissiveIntensity = (mat.userData.emissiveIntensity as number) * k;
      }
      const uniforms = (mat as THREE.ShaderMaterial).uniforms;
      if (uniforms?.uDevelop) uniforms.uDevelop.value = k;
    }
  });
}
