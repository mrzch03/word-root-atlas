import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import { roots } from '../data';
import { useCollection } from '../lib/collection';
import { layoutBranches, type BranchLayout, type LeafSpot } from '../lib/treeLayout';

const leafGeometry = (() => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.18, 0.22, 0.26, 0.58, 0.01, 0.96);
  shape.bezierCurveTo(-0.22, 0.58, -0.16, 0.22, 0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 1,
    curveSegments: 10,
  });
  geo.center();
  return geo;
})();

const vOut = new THREE.Vector3();
const vTip = new THREE.Vector3();
const vX = new THREE.Vector3();
const vY = new THREE.Vector3();
const vZ = new THREE.Vector3();
const vUp = new THREE.Vector3(0, 1, 0);
const basis = new THREE.Matrix4();

function placeLeaf(dummy: THREE.Object3D, leaf: LeafSpot, scale: number, i: number) {
  dummy.position.set(leaf.x, leaf.y, leaf.z);
  vOut.set(leaf.x, 0, leaf.z);
  if (vOut.lengthSq() < 1e-6) vOut.set(1, 0, 0);
  vOut.normalize();
  vTip.set(vOut.x * 0.35, 1, vOut.z * 0.35).normalize();
  vX.crossVectors(vUp, vOut);
  if (vX.lengthSq() < 1e-6) vX.set(1, 0, 0);
  vX.normalize();
  vZ.crossVectors(vX, vTip).normalize();
  vY.crossVectors(vZ, vX).normalize();
  basis.makeBasis(vX, vY, vZ);
  dummy.quaternion.setFromRotationMatrix(basis);
  dummy.rotateY(((leaf.word.charCodeAt(0) + i) % 7) * 0.12 - 0.36);
  dummy.scale.setScalar(scale);
  dummy.updateMatrix();
}

function Controls({ reduced }: { reduced: boolean }) {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);
  useEffect(() => {
    controls.enableDamping = !reduced;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 4.2;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0.55;
    controls.maxPolarAngle = 1.2;
    controls.target.set(0, 1.35, 0);
    controls.update();
    return () => controls.dispose();
  }, [controls, reduced]);
  useFrame(() => controls.update());
  return null;
}

function Trunk({ height }: { height: number }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const y = i / 16;
      const r = 0.26 * (1 - y) ** 0.72 + 0.045 + Math.sin(y * 7) * 0.012;
      pts.push(new THREE.Vector2(Math.max(0.04, r), y * height));
    }
    return new THREE.LatheGeometry(pts, 18);
  }, [height]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} castShadow={false}>
      <meshStandardMaterial color="#6d5142" roughness={1} metalness={0} />
    </mesh>
  );
}

function Branch({ points }: { points: [number, number, number][] }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
    return new THREE.TubeGeometry(curve, 18, 0.032, 6, false);
  }, [points]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#7d5c49" roughness={1} metalness={0} />
    </mesh>
  );
}

function Leaves({
  leaves,
  color,
  ghost,
  hovered,
  reduced,
  onSelect,
  onHover,
}: {
  leaves: LeafSpot[];
  color: string;
  ghost?: boolean;
  hovered: string | null;
  reduced: boolean;
  onSelect: (leaf: LeafSpot) => void;
  onHover: (leaf: LeafSpot | null, x?: number, y?: number) => void;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ghost ? '#b7a48e' : color,
        roughness: 1,
        metalness: 0,
      }),
    [color, ghost],
  );
  useEffect(() => () => mat.dispose(), [mat]);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    leaves.forEach((leaf, i) => {
      let scale = ghost ? 0.42 : 0.72;
      if (!ghost && !reduced && leaf.at) {
        const t = Math.min(1, Math.max(0, (Date.now() - leaf.at) / 680));
        const eased = 1 - (1 - t) ** 3;
        scale = 0.12 + 0.6 * eased;
      }
      if (hovered === leaf.word) scale *= 1.22;
      placeLeaf(dummy, leaf, scale, i);
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  if (leaves.length === 0) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[leafGeometry, mat, leaves.length]}
      onClick={(e) => {
        e.stopPropagation();
        const id = e.instanceId;
        if (id == null) return;
        onSelect(leaves[id]);
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        const id = e.instanceId;
        if (id == null) return;
        const ev = e.nativeEvent;
        onHover(leaves[id], ev.clientX, ev.clientY);
      }}
      onPointerOut={() => onHover(null)}
    />
  );
}

function PlinthBase() {
  const shadow = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const g = canvas.getContext('2d');
    if (!g) return null;
    const grd = g.createRadialGradient(64, 64, 8, 64, 64, 62);
    grd.addColorStop(0, 'rgba(92, 72, 52, 0.28)');
    grd.addColorStop(1, 'rgba(92, 72, 52, 0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useEffect(() => () => shadow?.dispose(), [shadow]);
  return (
    <group>
      {shadow && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.56, 0]}>
          <planeGeometry args={[4.4, 4.4]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} />
        </mesh>
      )}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[2.35, 0.2, 2.35]} />
        <meshStandardMaterial color="#a89078" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0, -0.24, 0]}>
        <boxGeometry args={[2.22, 0.14, 2.22]} />
        <meshStandardMaterial color="#c4a888" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2.08, 0.16, 2.08]} />
        <meshStandardMaterial color="#efe6d8" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function Growth({
  branches,
  reduced,
  hovered,
  onSelect,
  onHover,
}: {
  branches: BranchLayout[];
  reduced: boolean;
  hovered: string | null;
  onSelect: (leaf: LeafSpot) => void;
  onHover: (leaf: LeafSpot | null, x?: number, y?: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    const t = clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.32) * 0.012;
    group.current.rotation.x = Math.sin(t * 0.21) * 0.008;
  });
  const sapling = branches.length === 0;
  return (
    <group ref={group}>
      <PlinthBase />
      <Trunk height={sapling ? 1.55 : 3.7} />
      {sapling && (
        <>
          <mesh geometry={leafGeometry} position={[0.22, 1.35, 0.05]} scale={0.85}>
            <meshStandardMaterial color="#738468" roughness={1} metalness={0} />
          </mesh>
          <mesh geometry={leafGeometry} position={[-0.16, 1.2, -0.08]} scale={0.7} rotation={[0, 0.8, 0]}>
            <meshStandardMaterial color="#8a9478" roughness={1} metalness={0} />
          </mesh>
        </>
      )}
      {branches.map((branch) => (
        <group key={branch.rootId}>
          <Branch points={branch.points} />
          <Leaves
            key={`${branch.rootId}-on-${branch.leaves.filter((l) => l.collected).length}`}
            leaves={branch.leaves.filter((l) => l.collected)}
            color={branch.color}
            hovered={hovered}
            reduced={reduced}
            onSelect={onSelect}
            onHover={onHover}
          />
          <Leaves
            key={`${branch.rootId}-off-${branch.leaves.filter((l) => !l.collected).length}`}
            leaves={branch.leaves.filter((l) => !l.collected)}
            color={branch.color}
            ghost
            hovered={hovered}
            reduced={reduced}
            onSelect={onSelect}
            onHover={onHover}
          />
        </group>
      ))}
    </group>
  );
}

export default function TreeScene({
  reduced,
  hovered,
  onSelect,
  onHover,
}: {
  reduced: boolean;
  hovered: string | null;
  onSelect: (leaf: LeafSpot) => void;
  onHover: (leaf: LeafSpot | null, x?: number, y?: number) => void;
}) {
  const bag = useCollection();
  const branches = useMemo(() => layoutBranches(roots, bag.words), [bag.words]);
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [2.7, 3.9, 4.15], fov: 32, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
        gl.setClearColor('#f3efe6');
      }}
    >
      <hemisphereLight args={['#f7f1e6', '#cbbba6', 0.92]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[4.5, 7.5, 3.2]} intensity={0.72} color="#fff6ea" />
      <directionalLight position={[-3.5, 2.4, -2]} intensity={0.22} color="#eadcc8" />
      <Controls reduced={reduced} />
      <Growth branches={branches} reduced={reduced} hovered={hovered} onSelect={onSelect} onHover={onHover} />
    </Canvas>
  );
}
