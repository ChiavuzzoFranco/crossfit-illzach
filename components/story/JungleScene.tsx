'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { story, smooth } from './store';
import { makeLeafTextures, LEAF_COLORS } from './leaves';

const EYE = 1.7;
const BG = new THREE.Color('#080808');
const RED = new THREE.Color('#FF2E00');

// Parcours de la caméra dans la jungle
const CAM_START = 10.5;
const CAM_END = -6;
const GORILLA_Z = -15;

function prng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// ---------------------------------------------------------------------------
// Feuillage : 3 formes × instances, écartées autour de la caméra quand elle avance
// ---------------------------------------------------------------------------
const leafVert = /* glsl */ `
  uniform float uTime, uCamZ, uStill;
  uniform vec2 uCamXY;
  uniform float uClear;
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
    // on écarte les feuilles devant soi (et elles restent écartées une fois passées)
    float ahead = uCamZ - center.z;
    float push = 1.0 - smoothstep(0.4, 7.5, ahead);
    // on écarte autour de l'axe de la caméra (elle peut monter ou se décaler)
    vec2 rel = center.xy - uCamXY;
    float radial = length(rel);
    vec2 dir = radial > 0.05 ? rel / radial : aDir;
    float amount = push * (2.8 + 1.2 * aSeed) * (1.0 - smoothstep(2.5, 7.0, radial) * 0.6);
    world.xy += dir * amount;
    // dégagement du centre (toutes profondeurs devant la caméra) quand la tribu dessine
    world.xy += dir * uClear * step(0.0, ahead) * 6.0 * (1.0 - smoothstep(3.0, 9.0, radial));
    vec4 mv = viewMatrix * world;
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const leafFrag = /* glsl */ `
  uniform sampler2D uMap; uniform vec3 uBg; uniform vec3 uRim;
  varying vec2 vUv; varying vec3 vColor; varying float vDark; varying float vDist;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    if (t.a < 0.5) discard;
    float shade = 0.82 + 0.18 * t.r;
    vec3 col = vColor * shade;
    // feuilles noires : nervures et contours rouge sombre ; feuilles colorées : nervures plus foncées
    col = mix(col * (1.0 - 0.35 * t.g), col + uRim * t.g, vDark);
    // brume : les feuilles lointaines se fondent dans le noir
    float fog = smoothstep(9.0, 26.0, vDist);
    col = mix(col, uBg, fog);
    // trop près : on évite les aplats qui mangent l'écran
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Foliage({ count }: { count: number }) {
  const maps = useMemo(() => makeLeafTextures(), []);
  const refs = [useRef<THREE.InstancedMesh>(null), useRef<THREE.InstancedMesh>(null), useRef<THREE.InstancedMesh>(null)];

  // Répartition des feuilles par forme (pointue / palme / fendue)
  const sets = useMemo(() => {
    const r = prng(2024);
    const per = [Math.round(count * 0.45), Math.round(count * 0.3), Math.round(count * 0.25)];
    return per.map((n, shape) => {
      const mats: THREE.Matrix4[] = [];
      const color = new Float32Array(n * 3);
      const seed = new Float32Array(n);
      const dark = new Float32Array(n);
      const dir = new Float32Array(n * 2);
      const q = new THREE.Quaternion();
      const e = new THREE.Euler();
      for (let i = 0; i < n; i++) {
        const z = 9.2 - Math.pow(r(), 0.9) * 21; // de 9.2 (contre la caméra) à -12
        const a = r() * Math.PI * 2;
        // proche de l'axe au début (mur de feuillage), plus large ensuite
        const rad = 0.2 + Math.pow(r(), 0.75) * (z > 4 ? 3.2 : 6.5);
        const x = Math.cos(a) * rad * 1.25;
        const y = EYE + Math.sin(a) * rad * 0.85;
        // la pointe de la feuille regarde vers l'extérieur (cadre végétal comme sur le logo)
        e.set((r() - 0.5) * 0.7, (r() - 0.5) * 0.7, a - Math.PI / 2 + (r() - 0.5) * 0.6);
        q.setFromEuler(e);
        const s = (shape === 1 ? 2.2 : 1.5) * (0.8 + r() * 0.9) * (z > 4 ? 1.1 : 1);
        mats.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s, s, s)));
        // couleurs : majorité noire, puis les rouges et orange du logo
        const pick = r();
        const c =
          pick < 0.5 ? LEAF_COLORS.black :
          pick < 0.66 ? LEAF_COLORS.blood :
          pick < 0.84 ? LEAF_COLORS.red :
          pick < 0.97 ? LEAF_COLORS.ember : LEAF_COLORS.peach;
        color.set([c.r, c.g, c.b], i * 3);
        dark[i] = pick < 0.5 ? 1 : 0;
        seed[i] = r();
        const len = Math.hypot(Math.cos(a), Math.sin(a)) || 1;
        dir.set([Math.cos(a) / len, Math.sin(a) / len], i * 2);
      }
      return { n, mats, color, seed, dark, dir };
    });
  }, [count]);

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
              uCamZ: { value: CAM_START },
              uCamXY: { value: new THREE.Vector2(0, EYE) },
              uClear: { value: 0 },
              uStill: { value: 0 },
              uBg: { value: BG.clone() },
              uRim: { value: new THREE.Color('#3a0d06') },
            },
          }),
      ),
    [maps],
  );

  const geometries = useMemo(
    () =>
      sets.map((set) => {
        const g = new THREE.PlaneGeometry(1, 2, 1, 4);
        g.translate(0, 1, 0); // pivot à la base de la feuille
        g.setAttribute('aColor', new THREE.InstancedBufferAttribute(set.color, 3));
        g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(set.seed, 1));
        g.setAttribute('aDark', new THREE.InstancedBufferAttribute(set.dark, 1));
        g.setAttribute('aDir', new THREE.InstancedBufferAttribute(set.dir, 2));
        return g;
      }),
    [sets],
  );

  useEffect(() => {
    refs.forEach((ref, k) => {
      const mesh = ref.current;
      if (!mesh) return;
      sets[k].mats.forEach((m, i) => mesh.setMatrixAt(i, m));
      mesh.instanceMatrix.needsUpdate = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sets]);

  useFrame((state, dt) => {
    // on dégage le centre quand la tribu dessine quelque chose (séance, formats)
    const clear = Math.max(
      smooth(0.0, 0.15, story.session) * (1 - smooth(0.05, 0.3, story.last)) * 0.6,
      smooth(0.0, 0.12, story.formats) * (1 - smooth(0.0, 0.15, story.week) * 0.55) * (1 - smooth(0.0, 0.3, story.trial)),
    );
    refs.forEach((ref) => {
      if (!ref.current) return;
      const u = (ref.current.material as THREE.ShaderMaterial).uniforms;
      u.uClear.value = THREE.MathUtils.damp(u.uClear.value, clear, 3, dt);
      u.uTime.value = state.clock.elapsedTime;
      u.uCamZ.value = state.camera.position.z;
      (u.uCamXY.value as THREE.Vector2).set(state.camera.position.x, state.camera.position.y);
    });
  });

  return (
    <>
      {sets.map((set, k) => (
        <instancedMesh key={k} ref={refs[k]} args={[geometries[k], materials[k], set.n]} frustumCulled={false} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Lueur rouge au cœur de la jungle
// ---------------------------------------------------------------------------
function RedGlow() {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        toneMapped: false,
        uniforms: { uI: { value: 0.35 }, uRed: { value: RED.clone() }, uBg: { value: BG.clone() } },
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uI; uniform vec3 uRed; uniform vec3 uBg; varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * vec2(1.6, 1.0);
            float d = length(p);
            float g = exp(-d * d * 22.0);
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
    const target = 0.4 + smooth(0.3, 0.8, story.jungle) * 0.5 - smooth(0.05, 0.3, story.people) * 0.45 + story.cheer * 0.5 + smooth(0.1, 0.5, story.trial) * 0.45;
    u.uI.value = THREE.MathUtils.damp(u.uI.value, target, 3, dt);
  });
  return (
    <mesh ref={ref} position={[0, 3, -30]} material={mat}>
      <planeGeometry args={[90, 50]} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Le gorille (logo, sans le texte), révélé au fond de la jungle
// ---------------------------------------------------------------------------
function Gorilla() {
  const tex = useLoader(THREE.TextureLoader, '/logo.png');
  const ref = useRef<THREE.Mesh>(null);
  const map = useMemo(() => {
    const t = tex.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    // on ne garde que le gorille et son feuillage (partie haute de l'image)
    t.repeat.set(1, 0.655);
    t.offset.set(0, 0.345);
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }, [tex]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    const reveal = smooth(0.5, 0.82, story.jungle);
    const dim = 1 - smooth(0.02, 0.25, story.people) * 0.82;
    const calm = 1 - smooth(0.0, 0.1, story.formats) * 0.6;
    const back = smooth(0.1, 0.5, story.trial);
    const target = reveal * Math.max(Math.min(1, dim + story.cheer * 0.55) * calm, back);
    m.opacity = THREE.MathUtils.damp(m.opacity, target, 4, dt);
    ref.current.visible = m.opacity > 0.01;
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.006;
    ref.current.scale.setScalar(breathe * (0.92 + reveal * 0.08));
  });

  const w = 11;
  const h = w * ((1016 * 0.655) / 1169);
  return (
    <mesh ref={ref} position={[0, 3.1, GORILLA_Z]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={map} transparent opacity={0} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// La tribu : éclaboussures de peinture (une par personne), qui changent de formation
// A caché → B autour de toi → C constellation → D cercle d'échauffement
// → E groupes avec un coach → F lignes du WOD → G tout le monde autour du dernier
// ---------------------------------------------------------------------------
export const HIGHLIGHT_SPOTS: [number, number, number][] = [
  [-2.4, 3.3, -10.5],
  [2.6, 2.4, -10],
  [-0.6, 4.3, -11],
  [3.2, 4.0, -11],
  [0.6, 1.6, -9.5],
];
const LAST_INDEX = 5;          // la personne qui finit en dernier
const GROUPS = 7;              // groupes de technique (un coach chacun)
const COACH_FROM = 6;          // indices 6..12 : les coachs
export const LAST_SPOT: [number, number, number] = [0, 1.05, -8.8];

function Tribe({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const r = prng(77);
    const F = (n: number) => new Float32Array(n);
    // (le cercle D et les lignes F sont calculés dans le shader : limite d'attributs WebGL)
    const A = F(count * 3), B = F(count * 3), C = F(count * 3), E = F(count * 3), G = F(count * 3);
    const H = F(count * 3), I = F(count * 3), J = F(count * 3), K = F(count * 3);
    const meta = F(count * 4); // seed, hid, big, index
    const col = F(count * 3);
    const seed = { set: (v: number, i: number) => { meta[i * 4] = v; } };
    const hid = { set: (v: number, i: number) => { meta[i * 4 + 1] = v; } };
    const big = { set: (v: number, i: number) => { meta[i * 4 + 2] = v; } };
    const palette = [LEAF_COLORS.red, LEAF_COLORS.red, LEAF_COLORS.red, LEAF_COLORS.ember, LEAF_COLORS.ember, LEAF_COLORS.peach];
    for (let i = 0; i < count; i++) {
      seed.set(r(), i);
      meta[i * 4 + 3] = i;
      // A : cachés dans le feuillage
      const a = r() * Math.PI * 2;
      const rad = 4 + r() * 4;
      A.set([Math.cos(a) * rad * 1.3, EYE + Math.sin(a) * rad * 0.7, -9 - r() * 6], i * 3);
      // B : autour de toi
      const ang = (r() - 0.5) * Math.PI * 1.2;
      const rr = 2 + r() * 3.5;
      B.set([Math.sin(ang) * rr, 0.6 + r() * 2.4, CAM_END - 1 - Math.cos(ang) * rr], i * 3);
      // C : constellation
      C.set([(r() - 0.5) * 17, 0.3 + r() * 5.4, -8.5 - r() * 4], i * 3);
      // E : petits groupes de technique
      const g = i % GROUPS;
      const gx = -5.4 + g * (10.8 / (GROUPS - 1));
      const gz = -9.6 - (g % 2) * 2;
      const ga = r() * Math.PI * 2;
      const gr = 0.35 + r() * 0.55;
      E.set([gx + Math.cos(ga) * gr, 0.75 + r() * 0.3, gz + Math.sin(ga) * gr * 0.8], i * 3);
      // G : en fer à cheval autour du dernier
      const ha = (r() - 0.5) * Math.PI * 1.75;
      const hr = 1.5 + r() * 2.6;
      G.set([LAST_SPOT[0] + Math.sin(ha) * hr, 0.6 + r() * 1.7, LAST_SPOT[2] - Math.cos(ha) * hr * 0.8], i * 3);

      // H : une barre olympique (CrossFit), face à toi
      const FZ = -10.5, FY = 2.2;
      if (i % 5 < 2) {
        H.set([-4.3 + r() * 8.6, FY + (r() - 0.5) * 0.08, FZ + (r() - 0.5) * 0.08], i * 3);
      } else {
        const side = i % 2 ? 1 : -1;
        const pa = r() * Math.PI * 2;
        const pr = Math.sqrt(r()) * 1.25;
        H.set([side * (2.9 + r() * 0.35), FY + Math.sin(pa) * pr, FZ + Math.cos(pa) * pr * 0.5], i * 3);
      }
      // I : la boucle Hyrox, avec 8 ateliers en grappes
      let ta = (i / count) * Math.PI * 2;
      if (i % 3 === 0) ta = Math.round((ta / (Math.PI * 2)) * 8) / 8 * Math.PI * 2 + (r() - 0.5) * 0.12;
      I.set([Math.cos(ta) * 4.6 + (r() - 0.5) * 0.15, FY + Math.sin(ta) * 2.0 + (r() - 0.5) * 0.15, FZ + (r() - 0.5) * 0.3], i * 3);
      // J : les 3 zones ATHX, trois colonnes
      const colI = i % 3;
      const colH = [2.6, 3.7, 3.1][colI];
      J.set([(colI - 1) * 3 + (r() - 0.5) * 0.9, 0.4 + r() * colH, FZ + (r() - 0.5) * 0.6], i * 3);
      // K : à la fin, la tribu t'entoure à nouveau
      const ka = (r() - 0.5) * Math.PI * 1.3;
      const kr = 2.2 + r() * 3.4;
      K.set([Math.sin(ka) * kr, 0.5 + r() * 2.8, -6.2 - Math.cos(ka) * kr], i * 3);

      const pc = palette[Math.floor(r() * palette.length)];
      col.set([pc.r, pc.g, pc.b], i * 3);
      hid.set(-1, i);
      big.set(1, i);
    }
    HIGHLIGHT_SPOTS.forEach((p, k) => {
      C.set(p, k * 3);
      hid.set(k, k);
      col.set([LEAF_COLORS.red.r, LEAF_COLORS.red.g, LEAF_COLORS.red.b], k * 3);
    });
    // le dernier : au centre du fer à cheval, et à sa place dans les lignes
    G.set(LAST_SPOT, LAST_INDEX * 3);
    hid.set(5, LAST_INDEX);
    // les coachs : rouge vif, au centre de leur groupe
    for (let g = 0; g < GROUPS && COACH_FROM + g < count; g++) {
      const i = COACH_FROM + g;
      const gx = -5.4 + g * (10.8 / (GROUPS - 1));
      const gz = -9.6 - (g % 2) * 2;
      E.set([gx, 1.15, gz + 0.1], i * 3);
      col.set([RED.r, RED.g, RED.b], i * 3);
      big.set(1.35, i);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(A, 3));
    geom.setAttribute('aB', new THREE.BufferAttribute(B, 3));
    geom.setAttribute('aC', new THREE.BufferAttribute(C, 3));
    geom.setAttribute('aE', new THREE.BufferAttribute(E, 3));
    geom.setAttribute('aG', new THREE.BufferAttribute(G, 3));
    geom.setAttribute('aH', new THREE.BufferAttribute(H, 3));
    geom.setAttribute('aI', new THREE.BufferAttribute(I, 3));
    geom.setAttribute('aJ', new THREE.BufferAttribute(J, 3));
    geom.setAttribute('aK', new THREE.BufferAttribute(K, 3));
    geom.setAttribute('aMeta', new THREE.BufferAttribute(meta, 4));
    geom.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
    return geom;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 }, uOn: { value: 0 }, uPulse: { value: 0 }, uDpr: { value: 1 }, uAnyHi: { value: 0 },
          uAB: { value: 0 }, uBC: { value: 0 }, uCD: { value: 0 }, uDE: { value: 0 }, uEF: { value: 0 }, uFG: { value: 0 },
          uEffort: { value: 0 }, uLast: { value: 0 }, uCheer: { value: 0 }, uStill: { value: 0 },
          uCount: { value: count },
          uShape: { value: 0 },
          uGH: { value: 0 }, uHI: { value: 0 }, uIJ: { value: 0 }, uJK: { value: 0 }, uDim: { value: 0 },
          uHi: { value: [0, 0, 0, 0, 0] },
        },
        vertexShader: /* glsl */ `
          uniform float uTime, uOn, uPulse, uDpr, uAnyHi, uStill;
          uniform float uAB, uBC, uCD, uDE, uEF, uFG, uEffort, uLast, uCheer;
          uniform float uGH, uHI, uIJ, uJK, uDim, uCount, uShape;
          uniform float uHi[5];
          attribute vec3 aB, aC, aE, aG, aH, aI, aJ, aK, aCol;
          attribute vec4 aMeta;
          #define aSeed aMeta.x
          #define aHid aMeta.y
          #define aBig aMeta.z
          varying float vA; varying vec3 vCol; varying float vSeed; varying float vHi;
          float st(float u) { float t = clamp(u * 1.35 - aSeed * 0.35, 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
          void main() {
            vec3 p = mix(position, aB, st(uAB));
            p = mix(p, aC, st(uBC));
            // D : grand cercle d'échauffement
            float ca = aMeta.w / uCount * 6.2831853;
            float cr = 3.3 + (fract(aSeed * 91.7) - 0.5) * 0.35;
            vec3 D = vec3(cos(ca) * cr, 0.8 + fract(aSeed * 53.1) * 0.35, -10.5 + sin(ca) * cr * 0.9);
            // F : lignes du WOD
            float row = mod(aMeta.w, 4.0);
            float colN = floor(aMeta.w / 4.0);
            float perRow = ceil(uCount / 4.0);
            vec3 Fp = vec3(-6.0 + colN * (12.0 / max(perRow - 1.0, 1.0)), 0.85, -8.4 - row * 1.5);
            p = mix(p, D, st(uCD));
            p = mix(p, aE, st(uDE));
            p = mix(p, Fp, st(uEF));
            p = mix(p, aG, st(uFG));
            p = mix(p, aH, st(uGH));
            p = mix(p, aI, st(uHI));
            p = mix(p, aJ, st(uIJ));
            p = mix(p, aK, st(uJK));
            float t = uTime * (1.0 - uStill);
            p.y += sin(t * (0.5 + aSeed) + aSeed * 40.0) * 0.05;
            // le WOD : tout le monde bouge (burpees, sauts)
            p.y += abs(sin(t * 4.5 + aSeed * 12.0)) * 0.32 * uEffort;
            // les encouragements : on saute, on applaudit
            bool isLast = abs(aHid - 5.0) < 0.5;
            p.y += isLast ? 0.0 : abs(sin(t * 7.0 + aSeed * 20.0)) * 0.22 * uCheer;

            float hi = 0.0;
            for (int k = 0; k < 5; k++) { if (abs(aHid - float(k)) < 0.5) hi = uHi[k]; }
            if (isLast) hi = uLast;
            vHi = hi;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float d = max(-mv.z, 0.001);
            float size = (0.28 + aSeed * 0.3) * aBig * (1.0 + hi * 2.6 + uPulse * 0.6 + uCheer * 0.25 + uShape * 0.6);
            gl_PointSize = clamp(size * uDpr * 300.0 / d, 0.0, 80.0 * uDpr);
            vA = uOn * smoothstep(0.7, 1.8, d) * mix(1.0, 0.35, max(uAnyHi, uLast * (1.0 - uCheer * 0.6)) * (1.0 - hi));
            vA *= 1.0 - uDim;
            vCol = aCol; vSeed = aSeed;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vA; varying vec3 vCol; varying float vSeed; varying float vHi;
          void main() {
            vec2 q = gl_PointCoord - 0.5;
            float ang = atan(q.y, q.x);
            // contour irrégulier : une goutte de peinture, pas un disque parfait
            float edge = 0.34 + 0.035 * sin(ang * 3.0 + vSeed * 20.0) + 0.025 * sin(ang * 7.0 - vSeed * 13.0) + 0.015 * sin(ang * 13.0 + vSeed * 5.0);
            float r = length(q);
            float a = 1.0 - smoothstep(edge - 0.02, edge + 0.02, r);
            vec2 sp = vec2(cos(vSeed * 40.0), sin(vSeed * 40.0)) * 0.43;
            a = max(a, 1.0 - smoothstep(0.035, 0.055, length(q - sp)));
            if (a < 0.01) discard;
            gl_FragColor = vec4(mix(vCol, vec3(1.0), vHi), a * vA);
          }
        `,
      }),
    [count],
  );

  useFrame((state, dt) => {
    if (!ref.current) return;
    const u = (ref.current.material as THREE.ShaderMaterial).uniforms;
    const s = story;
    const d = (key: string, target: number, speed = 2.5) => { u[key].value = THREE.MathUtils.damp(u[key].value, target, speed, dt); };
    u.uTime.value = state.clock.elapsedTime;
    u.uDpr.value = state.gl.getPixelRatio();
    u.uOn.value = smooth(0.66, 0.82, s.jungle);
    d('uAB', smooth(0.7, 1, s.jungle));
    d('uBC', smooth(0.02, 0.3, s.people));
    d('uCD', smooth(0.12, 0.3, s.session));
    d('uDE', smooth(0.42, 0.56, s.session));
    d('uEF', smooth(0.66, 0.8, s.session));
    d('uFG', smooth(0.12, 0.36, s.last));
    d('uEffort', smooth(0.72, 0.84, s.session) * (1 - smooth(0.05, 0.2, s.last)), 4);
    d('uLast', smooth(0.02, 0.2, s.last) * (1 - smooth(0.92, 1, s.last)), 4);
    d('uCheer', s.cheer, 4);
    d('uPulse', s.greeted, 3);
    d('uGH', smooth(0.0, 0.12, s.formats));
    d('uShape', smooth(0.0, 0.12, s.formats) * (1 - smooth(0.0, 0.12, s.week)), 3);
    d('uHI', smooth(0.33, 0.45, s.formats));
    d('uIJ', smooth(0.66, 0.78, s.formats));
    d('uJK', smooth(0.05, 0.45, s.trial));
    d('uDim', smooth(0.0, 0.12, s.week) * (1 - smooth(0.0, 0.3, s.trial)) * 0.4, 3);
    const hi = u.uHi.value as number[];
    let any = 0;
    for (let k = 0; k < 5; k++) { hi[k] = THREE.MathUtils.damp(hi[k], s.highlight[k], 5, dt); any = Math.max(any, hi[k]); }
    u.uAnyHi.value = any;
  });

  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}

// ---------------------------------------------------------------------------
// Caméra
// ---------------------------------------------------------------------------
function CameraRig({ still }: { still: boolean }) {
  const v = useRef({ p: new THREE.Vector3(0, EYE, CAM_START), l: new THREE.Vector3(0, EYE, -30), tp: new THREE.Vector3(), tl: new THREE.Vector3(), m: new THREE.Vector2(), first: true });

  useFrame((state, dt) => {
    const s = story;
    const c = v.current;
    const cam = state.camera as THREE.PerspectiveCamera;
    const portrait = state.size.width / state.size.height < 0.8 ? 1 : 0;
    c.m.x = THREE.MathUtils.damp(c.m.x, s.mouseX, 2.5, dt);
    c.m.y = THREE.MathUtils.damp(c.m.y, s.mouseY, 2.5, dt);
    const t = still ? 0 : state.clock.elapsedTime;

    const walk = smooth(0, 0.86, s.jungle);
    let z = THREE.MathUtils.lerp(CAM_START, CAM_END, walk);
    z -= s.name * 0.6;
    // petit balancement de marche
    const bob = Math.sin(walk * 28) * 0.03 * (1 - walk);
    c.tp.set(c.m.x * 0.4, EYE + c.m.y * 0.25 + bob + Math.sin(t * 0.7) * 0.02, z);
    c.tl.set(c.m.x * 1.2, EYE + 0.6 + c.m.y * 0.4, -30);

    // Les gens : un pas en arrière pour voir toute la tribu
    const pp = smooth(0, 0.3, s.people);
    c.tp.z += pp * 0.9;
    c.tp.y += pp * 0.3;
    let hx = 0, hy = 0, hw = 0;
    s.highlight.forEach((w, k) => { hx += HIGHLIGHT_SPOTS[k][0] * w; hy += HIGHLIGHT_SPOTS[k][1] * w; hw += w; });
    if (hw > 0) { c.tl.x += (hx / hw) * 0.6 * pp; c.tl.y += (hy / hw - EYE) * 0.4 * pp; }

    // La séance : on prend de la hauteur pour voir les formations
    const se = smooth(0, 0.15, s.session) * (1 - smooth(0.05, 0.3, s.last));
    c.tp.lerp(new THREE.Vector3(c.m.x * 0.5, EYE + 2.1 + c.m.y * 0.2, -4.2), se);
    c.tl.lerp(new THREE.Vector3(c.m.x * 0.8, 0.5, -11), se);
    // Le dernier : on s'approche, à hauteur d'homme
    const la = smooth(0.05, 0.3, s.last);
    const shake = s.cheer * 0.025 * (still ? 0 : Math.sin(t * 31));
    c.tp.lerp(new THREE.Vector3(c.m.x * 0.3 + shake, EYE - 0.1, -4.4), la);
    c.tl.lerp(new THREE.Vector3(LAST_SPOT[0] + c.m.x * 0.4, LAST_SPOT[1] + 0.35, LAST_SPOT[2] - 2), la);

    // Les formats : face aux formes dessinées par la tribu
    const fo = smooth(0.0, 0.12, s.formats);
    c.tp.lerp(new THREE.Vector3(c.m.x * 0.6, 2.2 + c.m.y * 0.3, -2.8 + portrait * 5.5), fo);
    // desktop : on regarde un peu à gauche pour que les formes se placent à droite du texte
    c.tl.lerp(new THREE.Vector3(c.m.x * 0.6 - (1 - portrait) * 3.2, 2.1 - portrait * 0.6, -11), fo);
    // Le sentier de la semaine : la caméra glisse sur le côté, comme on marche
    const wk = smooth(0.0, 0.08, s.week) * (1 - smooth(0.0, 0.3, s.trial));
    c.tp.x += (s.week - 0.5) * 5 * wk;
    c.tl.x += (s.week - 0.5) * 9 * wk;
    // L'essai : retour dans la clairière, face au gorille, la tribu autour
    const tr = smooth(0.05, 0.45, s.trial);
    c.tp.lerp(new THREE.Vector3(c.m.x * 0.4, EYE + c.m.y * 0.2, -5.4), tr);
    c.tl.lerp(new THREE.Vector3(c.m.x * 1.0, EYE + 1.2, -30), tr);

    if (c.first) { c.p.copy(c.tp); c.l.copy(c.tl); c.first = false; }
    const k = 1 - Math.exp(-dt * 4.5);
    c.p.lerp(c.tp, k);
    c.l.lerp(c.tl, k);
    cam.position.copy(c.p);
    cam.lookAt(c.l);
    cam.fov = THREE.MathUtils.damp(cam.fov, 52 + portrait * 14, 4, dt);
    cam.updateProjectionMatrix();
  });
  return null;
}

// ---------------------------------------------------------------------------
function Scene({ mobile, still }: { mobile: boolean; still: boolean }) {
  return (
    <>
      <color attach="background" args={['#080808']} />
      <RedGlow />
      <Suspense fallback={null}>
        <Gorilla />
      </Suspense>
      <Foliage count={mobile ? 170 : 300} />
      <Tribe count={mobile ? 80 : 140} />
      <CameraRig still={still} />
      <EffectComposer multisampling={mobile ? 0 : 4} enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.92} luminanceSmoothing={0.15} radius={0.6} />
        <Noise opacity={mobile ? 0.05 : 0.07} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </>
  );
}

export default function JungleScene({ active }: { active: boolean }) {
  const [{ mobile, still }] = useState(() => ({
    mobile: window.matchMedia('(max-width: 767px), (pointer: coarse)').matches,
    still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, EYE, CAM_START], fov: 52, near: 0.1, far: 80 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
    >
      <Scene mobile={mobile} still={still} />
    </Canvas>
  );
}
