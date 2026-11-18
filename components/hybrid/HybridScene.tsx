'use client';
import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  RoundedBox,
  Text,
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { hybridStore, STATION_COUNT, stationU } from './store';

const RED = new THREE.Color('#FF2E00');
const FONT = '/fonts/Anton-Regular.ttf';
const FLOOR_Y = -2.6;
const TRACK_W = 2.4;
const TRACK_T = 0.16;
const WORLD_UP = new THREE.Vector3(0, 1, 0);

const STATIONS = ['SKI ERG', 'SLED PUSH', 'SLED PULL', 'BURPEE BROAD JUMP', 'ROWING', 'FARMERS CARRY', 'SANDBAG LUNGES', 'WALL BALLS'];
const ZONES = [
  { id: '01', name: 'STRENGTH', x: -3.4 },
  { id: '02', name: 'ENDURANCE', x: 0 },
  { id: '03', name: 'METCON X', x: 3.4 },
];

// ---------------------------------------------------------------------------
// Tracé : boucle organique autour du centre (où se trouvent les monolithes ATHX)
// ---------------------------------------------------------------------------
const CURVE = new THREE.CatmullRomCurve3(
  [
    [0, 0, 17], [11, 1.2, 13], [17.5, 0.4, 3], [15, -0.6, -8.5], [6, 1.4, -16.5],
    [-5.5, 0.2, -16], [-15.5, -0.8, -7], [-17, 0.6, 5], [-10, 1.2, 14.5],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  true,
  'centripetal',
);
const CURVE_LEN = CURVE.getLength();

// Paramètre t de la courbe pour une progression de course u
const uToT = (u: number) => 0.012 + u * 0.965;

function frameAt(t: number) {
  const p = CURVE.getPointAt(t);
  const tan = CURVE.getTangentAt(t).normalize();
  const side = new THREE.Vector3().crossVectors(WORLD_UP, tan).normalize();
  const up = new THREE.Vector3().crossVectors(tan, side).normalize();
  return { p, tan, side, up };
}

// Bande extrudée le long de la courbe, définie par deux décalages (côté, hauteur)
function buildStrip(a: [number, number], b: [number, number], segments = 900) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) % 1;
    const { p, side, up } = frameAt(t);
    const va = p.clone().addScaledVector(side, a[0]).addScaledVector(up, a[1]);
    const vb = p.clone().addScaledVector(side, b[0]).addScaledVector(up, b[1]);
    pos.push(va.x, va.y, va.z, vb.x, vb.y, vb.z);
    uv.push(i / segments, 1, i / segments, 0);
    if (i < segments) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// ---------------------------------------------------------------------------
// Shader des lignes lumineuses de la piste
// ---------------------------------------------------------------------------
const lineVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const lineFrag = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uLength;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float along = vUv.x;
    float across = vUv.y;
    float d = min(across, 1.0 - across);
    float aa = max(fwidth(across) * 1.5, 0.002);

    // Bordures fines et nettes
    float edge = 1.0 - smoothstep(0.018, 0.018 + aa, d);
    // Halo très doux à l'intérieur des bordures
    float glow = exp(-d * 28.0) * 0.18;

    // Pointillés de la ligne centrale
    float dashes = step(fract(along * uLength / 2.4), 0.45);
    float center = (1.0 - smoothstep(0.006, 0.006 + aa, abs(across - 0.5))) * dashes;

    // Distance déjà parcourue : plus lumineuse
    float covered = 1.0 - smoothstep(uProgress - 0.004, uProgress + 0.004, along);

    // Impulsions qui circulent
    float ph = fract(along * 5.0 - uTime * 0.07);
    float pulse = pow(1.0 - ph, 18.0);

    float i = edge * (0.55 + covered * 2.2 + pulse * 2.5)
            + glow * (0.6 + covered * 1.4)
            + center * (0.10 + covered * 0.55);
    gl_FragColor = vec4(uColor * clamp(i, 0.0, 6.0), 1.0);
  }
`;

function Track() {
  const geos = useMemo(() => {
    const h = TRACK_W / 2;
    return {
      top: buildStrip([h, 0], [-h, 0]),
      lines: buildStrip([h, 0.004], [-h, 0.004]),
      left: buildStrip([h, 0], [h, -TRACK_T]),
      right: buildStrip([-h, 0], [-h, -TRACK_T]),
    };
  }, []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: lineVert,
        fragmentShader: lineFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uLength: { value: CURVE_LEN },
          uColor: { value: RED.clone() },
        },
      }),
    [],
  );

  const lines = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (!lines.current) return;
    const u = (lines.current.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = state.clock.elapsedTime;
    const target = hybridStore.race > 0 ? uToT(hybridStore.race) : 0;
    u.uProgress.value = THREE.MathUtils.damp(u.uProgress.value, target, 4, dt);
  });

  return (
    <group>
      <mesh geometry={geos.top}>
        <meshPhysicalMaterial color="#101010" roughness={0.5} metalness={0.4} clearcoat={0.25} clearcoatRoughness={0.55} envMapIntensity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geos.left}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geos.right}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={lines} geometry={geos.lines} material={mat} renderOrder={2} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Portes des stations Hyrox
// ---------------------------------------------------------------------------
function Gate({ index }: { index: number }) {
  const u = stationU(index);
  const { p, tan, side, up } = useMemo(() => frameAt(uToT(u)), [u]);
  const quat = useMemo(
    () => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, up, tan)),
    [side, up, tan],
  );
  const glowMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#000', emissive: RED, emissiveIntensity: 0.35, toneMapped: false, side: THREE.DoubleSide }),
    [],
  );
  const light = useRef<THREE.PointLight>(null);
  const glowMesh = useRef<THREE.Mesh>(null);

  const halfW = TRACK_W / 2 + 0.35;
  const H = 2.7;
  const P = 0.12; // épaisseur des montants

  useFrame((_, dt) => {
    const race = hybridStore.race;
    const dist = race - u;
    const near = Math.exp(-Math.pow(dist * 14, 2));
    const passed = dist > 0.01 ? 0.9 : 0;
    const target = 0.35 + near * 5 + passed;
    if (glowMesh.current) {
      const m = glowMesh.current.material as THREE.MeshStandardMaterial; // matériau partagé par les 3 filets
      m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, target, 6, dt);
    }
    if (light.current) light.current.intensity = THREE.MathUtils.damp(light.current.intensity, near * 2.2, 6, dt);
  });

  const num = String(index + 1).padStart(2, '0');

  return (
    <group position={p} quaternion={quat}>
      {/* Structure */}
      <mesh position={[halfW, H / 2 - TRACK_T, 0]}>
        <boxGeometry args={[P, H, P]} />
        <meshPhysicalMaterial color="#0d0d0d" metalness={0.8} roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.45} />
      </mesh>
      <mesh position={[-halfW, H / 2 - TRACK_T, 0]}>
        <boxGeometry args={[P, H, P]} />
        <meshPhysicalMaterial color="#0d0d0d" metalness={0.8} roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.45} />
      </mesh>
      <mesh position={[0, H - TRACK_T, 0]}>
        <boxGeometry args={[halfW * 2 + P, P * 1.6, P]} />
        <meshPhysicalMaterial color="#0d0d0d" metalness={0.8} roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.45} />
      </mesh>

      {/* Filets lumineux, côté intérieur */}
      <group position={[0, 0, -P / 2 - 0.002]}>
        <mesh ref={glowMesh} position={[halfW - P / 2 - 0.012, H / 2 - TRACK_T, 0]} material={glowMat}>
          <planeGeometry args={[0.022, H - 0.1]} />
        </mesh>
        <mesh position={[-halfW + P / 2 + 0.012, H / 2 - TRACK_T, 0]} material={glowMat}>
          <planeGeometry args={[0.022, H - 0.1]} />
        </mesh>
        <mesh position={[0, H - TRACK_T - P * 0.8 - 0.012, 0]} material={glowMat}>
          <planeGeometry args={[halfW * 2 - P, 0.022]} />
        </mesh>
      </group>

      {/* Numéro + nom, lisibles des deux côtés */}
      {[{ z: -P / 2 - 0.01, ry: Math.PI }, { z: P / 2 + 0.01, ry: 0 }].map((f) => (
        <group key={f.ry} position={[0, H - TRACK_T + 0.62, f.z]} rotation={[0, f.ry, 0]}>
          <Text font={FONT} fontSize={0.62} anchorX="center" anchorY="middle" letterSpacing={0.02}>
            {num}
            <meshBasicMaterial color="#9a9a9a" side={THREE.FrontSide} toneMapped={false} />
          </Text>
          <Text font={FONT} position={[0, -0.5, 0]} fontSize={0.17} anchorX="center" anchorY="middle" letterSpacing={0.18}>
            {STATIONS[index]}
            <meshBasicMaterial color="#FF2E00" side={THREE.FrontSide} toneMapped={false} />
          </Text>
        </group>
      ))}

      <pointLight ref={light} color={RED} intensity={0} distance={7} decay={2} position={[0, H * 0.6, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Monolithes ATHX
// ---------------------------------------------------------------------------
function Monolith({ index }: { index: number }) {
  const z = ZONES[index];
  const group = useRef<THREE.Group>(null);
  const slit = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const H = 5.4;

  useFrame((_, dt) => {
    const a = hybridStore.athx;
    const active = a > 0.04 ? Math.min(2, Math.floor(((a - 0.04) / 0.96) * 3)) : -1;
    const on = active === index ? 1 : 0;
    const inAthx = a > 0.02 ? 1 : 0;
    if (slit.current) slit.current.emissiveIntensity = THREE.MathUtils.damp(slit.current.emissiveIntensity, 0.5 + inAthx * 0.6 + on * 4.5, 5, dt);
    if (light.current) light.current.intensity = THREE.MathUtils.damp(light.current.intensity, on * 4, 5, dt);
    if (group.current) group.current.position.y = THREE.MathUtils.damp(group.current.position.y, on * 0.25, 4, dt);
  });

  return (
    <group position={[z.x, 0, 0]} rotation={[0, (1 - index) * 0.12, 0]}>
      <group ref={group}>
        <RoundedBox args={[1.9, H, 0.6]} radius={0.04} smoothness={4} position={[0, FLOOR_Y + H / 2, 0]}>
          <meshPhysicalMaterial color="#0b0b0b" metalness={0.8} roughness={0.38} clearcoat={0.8} clearcoatRoughness={0.32} />
        </RoundedBox>
        {/* Fente lumineuse */}
        <mesh position={[-0.62, FLOOR_Y + H / 2, 0.302]}>
          <planeGeometry args={[0.035, H - 0.7]} />
          <meshStandardMaterial ref={slit} color="#000" emissive={RED} emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
        <Text font={FONT} position={[0.45, FLOOR_Y + H - 0.65, 0.31]} fontSize={0.5} color="#EAEAEA" anchorX="center" anchorY="middle">
          {z.id}
        </Text>
        <Text font={FONT} position={[0.1, FLOOR_Y + H / 2 - 0.35, 0.31]} rotation={[0, 0, Math.PI / 2]} fontSize={0.42} color="#EAEAEA" fillOpacity={0.85} anchorX="center" anchorY="middle" letterSpacing={0.12}>
          {z.name}
        </Text>
        <pointLight ref={light} color={RED} intensity={0} distance={6} decay={2} position={[0, FLOOR_Y + 1.6, 1.6]} />
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Poussière en suspension (taille plafonnée : pas d'artefacts près de la caméra)
// ---------------------------------------------------------------------------
function Dust({ count, still }: { count: number; still: boolean }) {
  const { geo, mat } = useMemo(() => {
    let seed = 1337;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 50;
      pos[i * 3 + 1] = FLOOR_Y + 0.5 + rand() * 9;
      pos[i * 3 + 2] = (rand() - 0.5) * 50;
      rnd[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#FF5A2E') }, uDpr: { value: 1 } },
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uDpr;
        attribute float aRnd;
        varying float vA;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.25 + aRnd * 6.283) * 0.35;
          p.x += cos(uTime * 0.18 + aRnd * 12.0) * 0.25;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float d = max(-mv.z, 0.001);
          gl_PointSize = clamp((2.0 + aRnd * 2.5) * uDpr * (14.0 / d), 0.0, 5.0 * uDpr);
          // disparaît très près de la caméra et au loin
          vA = smoothstep(1.5, 4.0, d) * (1.0 - smoothstep(30.0, 55.0, d)) * (0.35 + aRnd * 0.65);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; varying float vA;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, r) * vA;
          gl_FragColor = vec4(uColor * a * 0.9, 1.0);
        }
      `,
    });
    return { geo: g, mat: m };
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const u = (ref.current.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = still ? 0 : state.clock.elapsedTime;
    u.uDpr.value = state.gl.getPixelRatio();
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

// ---------------------------------------------------------------------------
// Caméra pilotée par le scroll
// ---------------------------------------------------------------------------
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function CameraRig({ reducedMotion, mobile, onFx }: { reducedMotion: boolean; mobile: boolean; onFx: (speed: number) => void }) {
  const pos = useRef(new THREE.Vector3(0, 20, 34));
  const look = useRef(new THREE.Vector3());
  const first = useRef(true);
  const v = useRef({ hp: new THREE.Vector3(), hl: new THREE.Vector3(), rp: new THREE.Vector3(), rl: new THREE.Vector3(), ap: new THREE.Vector3(), al: new THREE.Vector3(), p: new THREE.Vector3(), l: new THREE.Vector3() });
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const s = hybridStore;
    const tmp = v.current;
    const camera = state.camera as THREE.PerspectiveCamera;
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, s.mouseX, 3, dt);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, s.mouseY, 3, dt);
    const mx = mouse.current.x, my = mouse.current.y;

    // 1. Vue d'ensemble (hero)
    const ang = 0.55 + time * 0.025 + mx * 0.18;
    const rad = 33 - s.hero * 6;
    tmp.hp.set(Math.sin(ang) * rad, 17 + my * 1.5 - s.hero * 3, Math.cos(ang) * rad);
    // décale le point visé vers la gauche de l'écran → la piste se place à droite du titre
    const shift = mobile ? 0 : 9;
    tmp.hl.set(-Math.cos(ang) * shift, -1.2 + (mobile ? 7 : 0), Math.sin(ang) * shift);

    // 2. Sur la piste
    const t = uToT(s.race);
    const fp = CURVE.getPointAt(t);
    const fl = CURVE.getPointAt((t + 0.028) % 1);
    tmp.rp.copy(fp).add(new THREE.Vector3(mx * 0.25, 1.15 + my * 0.12, 0));
    tmp.rl.copy(fl).add(new THREE.Vector3(0, 0.8, 0));

    // 3. Monolithes ATHX
    const a = smooth(0.08, 0.96, s.athx);
    const fx = -3.4 + a * 6.8;
    // desktop : le monolithe actif se place à gauche de la fiche ; mobile : centré et plus loin
    const off = mobile ? 0 : 1.9;
    tmp.ap.set(fx * 0.8 + off + mx * 0.6, FLOOR_Y + 3.4 + my * 0.3, mobile ? 11.5 : 8.2);
    tmp.al.set(fx + off, FLOOR_Y + (mobile ? 3.4 : 2.6), 0);

    const w1 = smooth(0.1, 1, s.hero);
    const w2 = smooth(0.0, 0.1, s.athx);

    tmp.p.lerpVectors(tmp.hp, tmp.rp, w1);
    tmp.l.lerpVectors(tmp.hl, tmp.rl, w1);
    tmp.p.y += Math.sin(w1 * Math.PI) * 2.5;

    tmp.p.lerp(tmp.ap, w2);
    tmp.l.lerp(tmp.al, w2);
    tmp.p.y += Math.sin(w2 * Math.PI) * 6;

    if (first.current) {
      pos.current.copy(tmp.p);
      look.current.copy(tmp.l);
      first.current = false;
    } else {
      const k = 1 - Math.exp(-dt * 5);
      pos.current.lerp(tmp.p, k);
      look.current.lerp(tmp.l, k);
    }
    camera.position.copy(pos.current);
    camera.lookAt(look.current);

    // Effet de vitesse : léger élargissement du champ de vision
    const speed = Math.min(1, Math.abs(s.velocity));
    const targetFov = 46 + speed * 9 * (1 - w2);
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4, dt);
    camera.updateProjectionMatrix();
    onFx(speed);
  });
  return null;
}

// ---------------------------------------------------------------------------
// Scène
// ---------------------------------------------------------------------------
function Scene({ mobile, reducedMotion }: { mobile: boolean; reducedMotion: boolean }) {
  const caOffset = useMemo(() => new THREE.Vector2(0, 0), []);

  return (
    <>
      <color attach="background" args={['#080808']} />
      <fog attach="fog" args={['#080808', 18, 62]} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[30, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[-14, 4, 6]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[14, 4, -6]} rotation-y={-Math.PI / 2} scale={[12, 2, 1]} />
        <Lightformer form="ring" intensity={3} color="#FF2E00" position={[0, 2, -14]} scale={6} />
        <Lightformer form="rect" intensity={1.6} color="#FF2E00" position={[0, -1, 14]} rotation-y={Math.PI} scale={[20, 1, 1]} />
      </Environment>

      <ambientLight intensity={0.08} />
      <directionalLight position={[8, 14, 6]} intensity={0.5} />

      <Track />
      {Array.from({ length: STATION_COUNT }, (_, i) => <Gate key={i} index={i} />)}
      {ZONES.map((_, i) => <Monolith key={i} index={i} />)}

      {/* Sol */}
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[220, 220]} />
        {mobile ? (
          <meshStandardMaterial color="#060606" roughness={0.9} metalness={0.2} />
        ) : (
          <MeshReflectorMaterial
            blur={[400, 120]}
            resolution={512}
            mixBlur={1}
            mixStrength={9}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0}
            envMapIntensity={0}
            mirror={0}
          />
        )}
      </mesh>

      <Dust count={mobile ? 160 : 380} still={reducedMotion} />

      <CameraRig
        reducedMotion={reducedMotion}
        mobile={mobile}
        onFx={(speed) => {
          caOffset.set(speed * 0.0022, speed * 0.0012);
        }}
      />

      <EffectComposer multisampling={mobile ? 0 : 4} enableNormalPass={false}>
        <Bloom mipmapBlur intensity={mobile ? 0.9 : 1.1} luminanceThreshold={0.9} luminanceSmoothing={0.2} radius={0.7} />
        <ChromaticAberration offset={caOffset} radialModulation={false} modulationOffset={0} blendFunction={BlendFunction.NORMAL} />
        <Noise opacity={mobile ? 0.04 : 0.055} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.28} darkness={0.8} />
      </EffectComposer>
    </>
  );
}

export default function HybridScene({ active }: { active: boolean }) {
  // Ce module n'est chargé que côté client (dynamic ssr:false) : lecture directe sans risque d'hydratation
  const [{ mobile, reducedMotion }] = useState(() => ({
    mobile: window.matchMedia('(max-width: 767px), (pointer: coarse)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 20, 34], fov: 46, near: 0.1, far: 120 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
    >
      <Scene mobile={mobile} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
