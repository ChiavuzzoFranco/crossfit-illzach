'use client';
// Briques 3D de la jungle, partagées par toutes les pages :
// feuillage instancié (style du logo), lueur rouge, gorille, éclaboussures.
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { makeLeafTextures, LEAF_COLORS } from './leaves';

export const BG = new THREE.Color('#080808');
export const RED = new THREE.Color('#FF2E00');
export const EYE = 1.7;

export function prng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// smoothstep sûr (bornes jamais égales)
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / Math.max(b - a, 1e-4));
  return t * t * (3 - 2 * t);
};

// ---------------------------------------------------------------------------
// Feuillage
// ---------------------------------------------------------------------------
const leafVert = /* glsl */ `
  uniform float uTime, uCamZ, uStill, uPush, uFogNear, uFogFar;
  uniform vec2 uCamXY;
  attribute vec3 aColor; attribute float aSeed; attribute float aDark; attribute vec2 aDir;
  varying vec2 vUv; varying vec3 vColor; varying float vDark; varying float vDist;
  void main() {
    vUv = uv;
    vColor = aColor; vDark = aDark;
    vec4 center = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec3 p = position;
    // le vent : la pointe bouge plus que la base
    p.x += sin(uTime * (0.7 + aSeed) + aSeed * 30.0) * 0.06 * uv.y * (1.0 - uStill);
    vec4 world = modelMatrix * instanceMatrix * vec4(p, 1.0);
    // on écarte les feuilles devant la caméra (et elles restent écartées une fois passées)
    float ahead = uCamZ - center.z;
    float push = (1.0 - smoothstep(0.4, 7.5, ahead)) * uPush;
    vec2 rel = center.xy - uCamXY;
    float radial = length(rel);
    vec2 dir = radial > 0.05 ? rel / radial : aDir;
    world.xy += dir * push * (2.8 + 1.2 * aSeed) * (1.0 - smoothstep(2.5, 7.0, radial) * 0.6);
    vec4 mv = viewMatrix * world;
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const leafFrag = /* glsl */ `
  uniform sampler2D uMap; uniform vec3 uBg; uniform vec3 uRim; uniform float uFogNear, uFogFar;
  varying vec2 vUv; varying vec3 vColor; varying float vDark; varying float vDist;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    if (t.a < 0.5) discard;
    vec3 col = vColor * (0.82 + 0.18 * t.r);
    // feuilles noires : nervures rouge sombre ; feuilles colorées : nervures plus foncées
    col = mix(col * (1.0 - 0.35 * t.g), col + uRim * t.g, vDark);
    col = mix(col, uBg, smoothstep(uFogNear, max(uFogFar, uFogNear + 0.01), vDist));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export type LeafPlacement = { pos: THREE.Vector3; rot: THREE.Euler; scale: number; dir: [number, number] };

// Disposition « tunnel » : un mur de feuillage autour de l'axe de la caméra (z décroissant)
export function tunnelLayout(count: number, seed = 2024, zFrom = 9.2, depth = 21): LeafPlacement[] {
  const r = prng(seed);
  return Array.from({ length: count }, () => {
    const z = zFrom - Math.pow(r(), 0.9) * depth;
    const a = r() * Math.PI * 2;
    const rad = 0.2 + Math.pow(r(), 0.75) * (z > 4 ? 3.2 : 6.5);
    return {
      pos: new THREE.Vector3(Math.cos(a) * rad * 1.25, EYE + Math.sin(a) * rad * 0.85, z),
      rot: new THREE.Euler((r() - 0.5) * 0.7, (r() - 0.5) * 0.7, a - Math.PI / 2 + (r() - 0.5) * 0.6),
      scale: (0.8 + r() * 0.9) * (z > 4 ? 1.1 : 1),
      dir: [Math.cos(a), Math.sin(a)],
    };
  });
}

// Disposition « cadre » : feuillage seulement sur les bords (le centre reste libre pour le texte)
export function frameLayout(count: number, seed = 404): LeafPlacement[] {
  const r = prng(seed);
  return Array.from({ length: count }, () => {
    const z = 2 - r() * 10;
    const a = r() * Math.PI * 2;
    const rad = 2.5 + Math.pow(r(), 1.3) * 3.6 + (2 - z) * 0.28;
    return {
      pos: new THREE.Vector3(Math.cos(a) * rad * 1.45, EYE + Math.sin(a) * rad * 0.72, z),
      rot: new THREE.Euler((r() - 0.5) * 0.6, (r() - 0.5) * 0.6, a - Math.PI / 2 + (r() - 0.5) * 0.8),
      scale: 0.9 + r() * 1.1,
      dir: [Math.cos(a), Math.sin(a)],
    };
  });
}

export function Foliage({
  layout,
  push = 1,
  fog = [9, 26],
  seed = 7,
}: {
  layout: LeafPlacement[];
  push?: number;
  fog?: [number, number];
  seed?: number;
}) {
  const maps = useMemo(() => makeLeafTextures(), []);
  const m0 = useRef<THREE.InstancedMesh>(null);
  const m1 = useRef<THREE.InstancedMesh>(null);
  const m2 = useRef<THREE.InstancedMesh>(null);

  // Répartition : feuilles pointues / palmes / fendues ; couleurs : noir majoritaire + logo
  const sets = useMemo(() => {
    const r = prng(seed);
    const buckets: LeafPlacement[][] = [[], [], []];
    layout.forEach((l) => {
      const k = r();
      buckets[k < 0.45 ? 0 : k < 0.75 ? 1 : 2].push(l);
    });
    return buckets.map((list, shape) => {
      const n = list.length;
      const color = new Float32Array(n * 3);
      const seeds = new Float32Array(n);
      const dark = new Float32Array(n);
      const dir = new Float32Array(n * 2);
      const mats = list.map((l, i) => {
        const pick = r();
        const c =
          pick < 0.5 ? LEAF_COLORS.black :
          pick < 0.66 ? LEAF_COLORS.blood :
          pick < 0.84 ? LEAF_COLORS.red :
          pick < 0.97 ? LEAF_COLORS.ember : LEAF_COLORS.peach;
        color.set([c.r, c.g, c.b], i * 3);
        dark[i] = pick < 0.5 ? 1 : 0;
        seeds[i] = r();
        dir.set(l.dir, i * 2);
        const s = l.scale * (shape === 1 ? 2.2 : 1.5);
        return new THREE.Matrix4().compose(l.pos, new THREE.Quaternion().setFromEuler(l.rot), new THREE.Vector3(s, s, s));
      });
      const g = new THREE.PlaneGeometry(1, 2, 1, 4);
      g.translate(0, 1, 0); // pivot à la base de la feuille
      g.setAttribute('aColor', new THREE.InstancedBufferAttribute(color, 3));
      g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
      g.setAttribute('aDark', new THREE.InstancedBufferAttribute(dark, 1));
      g.setAttribute('aDir', new THREE.InstancedBufferAttribute(dir, 2));
      return { n, mats, geo: g };
    });
  }, [layout, seed]);

  const materials = useMemo(
    () =>
      maps.map(
        (map) =>
          new THREE.ShaderMaterial({
            vertexShader: leafVert,
            fragmentShader: leafFrag,
            side: THREE.DoubleSide,
            uniforms: {
              uMap: { value: map },
              uTime: { value: 0 },
              uCamZ: { value: 10 },
              uCamXY: { value: new THREE.Vector2(0, EYE) },
              uStill: { value: 0 },
              uPush: { value: push },
              uFogNear: { value: fog[0] },
              uFogFar: { value: fog[1] },
              uBg: { value: BG.clone() },
              uRim: { value: new THREE.Color('#3a0d06') },
            },
          }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maps],
  );

  useEffect(() => {
    [m0, m1, m2].forEach((ref, k) => {
      const mesh = ref.current;
      if (!mesh) return;
      sets[k].mats.forEach((m, i) => mesh.setMatrixAt(i, m));
      mesh.instanceMatrix.needsUpdate = true;
    });
  }, [sets]);

  useFrame((state) => {
    [m0, m1, m2].forEach((ref) => {
      if (!ref.current) return;
      const u = (ref.current.material as THREE.ShaderMaterial).uniforms;
      u.uTime.value = state.clock.elapsedTime;
      u.uCamZ.value = state.camera.position.z;
      (u.uCamXY.value as THREE.Vector2).set(state.camera.position.x, state.camera.position.y);
      u.uPush.value = push;
    });
  });

  return (
    <>
      <instancedMesh ref={m0} args={[sets[0].geo, materials[0], Math.max(sets[0].n, 1)]} frustumCulled={false} />
      <instancedMesh ref={m1} args={[sets[1].geo, materials[1], Math.max(sets[1].n, 1)]} frustumCulled={false} />
      <instancedMesh ref={m2} args={[sets[2].geo, materials[2], Math.max(sets[2].n, 1)]} frustumCulled={false} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Lueur rouge au cœur de la jungle (fond)
// ---------------------------------------------------------------------------
export function RedGlow({ intensity, position = [0, 3, -30] as [number, number, number], size = [90, 50] as [number, number] }: {
  intensity: () => number;
  position?: [number, number, number];
  size?: [number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        toneMapped: false,
        uniforms: { uI: { value: 0.4 }, uRed: { value: RED.clone() }, uBg: { value: BG.clone() } },
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uI; uniform vec3 uRed; uniform vec3 uBg; varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * vec2(1.6, 1.0);
            float g = exp(-dot(p, p) * 22.0);
            vec3 col = mix(uBg, uRed * 0.32, g * uI) + uRed * pow(g, 5.0) * 0.18 * uI;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  );
  useFrame((_, dt) => {
    if (!ref.current) return;
    const u = (ref.current.material as THREE.ShaderMaterial).uniforms;
    u.uI.value = THREE.MathUtils.damp(u.uI.value, intensity(), 3, dt);
  });
  return (
    <mesh ref={ref} position={position} material={mat}>
      <planeGeometry args={size} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Le gorille du logo (sans le texte)
// ---------------------------------------------------------------------------
export function Gorilla({ opacity, position = [0, 3.1, -15] as [number, number, number], width = 11 }: {
  opacity: () => number;
  position?: [number, number, number];
  width?: number;
}) {
  const tex = useLoader(THREE.TextureLoader, '/logo.png');
  const ref = useRef<THREE.Mesh>(null);
  const map = useMemo(() => {
    const t = tex.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.repeat.set(1, 0.655);
    t.offset.set(0, 0.345);
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }, [tex]);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    m.opacity = THREE.MathUtils.damp(m.opacity, opacity(), 4, dt);
    ref.current.visible = m.opacity > 0.01;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.006);
  });
  const h = width * ((1016 * 0.655) / 1169);
  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[width, h]} />
      <meshBasicMaterial map={map} transparent opacity={0} toneMapped={false} depthWrite={false} fog={false} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Éclaboussures de peinture flottantes (ambiance)
// ---------------------------------------------------------------------------
export function Splats({ count, box, opacity = () => 1, seed = 77 }: {
  count: number;
  box: { center: [number, number, number]; size: [number, number, number] };
  opacity?: () => number;
  seed?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat } = useMemo(() => {
    const r = prng(seed);
    const pos = new Float32Array(count * 3);
    const meta = new Float32Array(count * 4); // seed, r, g, b
    const pal = [LEAF_COLORS.red, LEAF_COLORS.red, LEAF_COLORS.ember, LEAF_COLORS.peach];
    for (let i = 0; i < count; i++) {
      pos.set([0, 1, 2].map((k) => box.center[k] + (r() - 0.5) * box.size[k]), i * 3);
      const c = pal[Math.floor(r() * pal.length)];
      meta.set([r(), c.r, c.g, c.b], i * 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aMeta', new THREE.BufferAttribute(meta, 4));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: { uTime: { value: 0 }, uDpr: { value: 1 }, uA: { value: 1 } },
      vertexShader: /* glsl */ `
        uniform float uTime, uDpr; attribute vec4 aMeta;
        varying vec3 vCol; varying float vSeed; varying float vFade;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * (0.4 + aMeta.x) + aMeta.x * 40.0) * 0.12;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float d = max(-mv.z, 0.001);
          gl_PointSize = clamp((0.25 + aMeta.x * 0.3) * uDpr * 300.0 / d, 0.0, 60.0 * uDpr);
          vFade = smoothstep(0.8, 2.0, d);
          vCol = aMeta.yzw; vSeed = aMeta.x;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uA; varying vec3 vCol; varying float vSeed; varying float vFade;
        void main() {
          vec2 q = gl_PointCoord - 0.5;
          float ang = atan(q.y, q.x);
          float edge = 0.34 + 0.035 * sin(ang * 3.0 + vSeed * 20.0) + 0.025 * sin(ang * 7.0 - vSeed * 13.0);
          float a = 1.0 - smoothstep(edge - 0.02, edge + 0.02, length(q));
          vec2 sp = vec2(cos(vSeed * 40.0), sin(vSeed * 40.0)) * 0.43;
          a = max(a, 1.0 - smoothstep(0.035, 0.055, length(q - sp)));
          if (a < 0.01) discard;
          gl_FragColor = vec4(vCol, a * uA * vFade);
        }
      `,
    });
    return { geo: g, mat: m };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seed]);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const u = (ref.current.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uDpr.value = state.gl.getPixelRatio();
    u.uA.value = THREE.MathUtils.damp(u.uA.value, opacity(), 3, dt);
  });
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
