'use client';
// Fond 3D « jungle » posé derrière une section (hero de chaque page).
// La progression de scroll de la section parente pilote la caméra : on avance dans le feuillage.
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { EYE, Foliage, Gorilla, RedGlow, Splats, clamp, frameLayout, smooth, tunnelLayout } from './foliage';

type Variant = 'hero' | 'frame';
type Shared = { progress: number; mx: number; my: number };

function Rig({ variant, shared, still }: { variant: Variant; shared: Shared; still: boolean }) {
  const v = useRef({ p: new THREE.Vector3(0, EYE, 10), l: new THREE.Vector3(0, EYE, -30), m: new THREE.Vector2(), first: true });
  useFrame((state, dt) => {
    const c = v.current;
    const cam = state.camera as THREE.PerspectiveCamera;
    const portrait = state.size.width / state.size.height < 0.8 ? 1 : 0;
    c.m.x = THREE.MathUtils.damp(c.m.x, shared.mx, 2.5, dt);
    c.m.y = THREE.MathUtils.damp(c.m.y, shared.my, 2.5, dt);
    const t = still ? 0 : state.clock.elapsedTime;
    const p = shared.progress;
    const z = variant === 'hero'
      ? THREE.MathUtils.lerp(10.5, -5, smooth(0, 0.9, p))
      : THREE.MathUtils.lerp(4.5, 2.2, p);
    const tp = new THREE.Vector3(c.m.x * 0.4, EYE + c.m.y * 0.25 + Math.sin(t * 0.7) * 0.02, z);
    const tl = new THREE.Vector3(c.m.x * 1.2, EYE + 0.6 + c.m.y * 0.4, -30);
    if (c.first) { c.p.copy(tp); c.l.copy(tl); c.first = false; }
    const k = 1 - Math.exp(-dt * 4.5);
    c.p.lerp(tp, k);
    c.l.lerp(tl, k);
    cam.position.copy(c.p);
    cam.lookAt(c.l);
    cam.fov = THREE.MathUtils.damp(cam.fov, 52 + portrait * 14, 4, dt);
    cam.updateProjectionMatrix();
  });
  return null;
}

function Scene({ variant, gorilla, splats, shared, mobile, still }: {
  variant: Variant; gorilla: boolean; splats: boolean; shared: Shared; mobile: boolean; still: boolean;
}) {
  const layout = useMemo(
    () => (variant === 'hero' ? tunnelLayout(mobile ? 170 : 300) : frameLayout(mobile ? 110 : 190)),
    [variant, mobile],
  );
  return (
    <>
      <color attach="background" args={['#080808']} />
      <RedGlow intensity={() => (variant === 'hero' ? 0.4 + smooth(0.3, 0.8, shared.progress) * 0.5 : 0.55)} />
      {gorilla && (
        <Suspense fallback={null}>
          <Gorilla opacity={() => (variant === 'hero' ? smooth(0.35, 0.8, shared.progress) : 0.35)} />
        </Suspense>
      )}
      <Foliage layout={layout} push={variant === 'hero' ? 1 : 0.4} />
      {splats && (
        <Splats
          count={mobile ? 40 : 80}
          box={{ center: [0, 2.2, -9], size: [18, 6, 8] }}
          opacity={() => (variant === 'hero' ? smooth(0.55, 0.85, shared.progress) : 0.8)}
        />
      )}
      <Rig variant={variant} shared={shared} still={still} />
      <EffectComposer multisampling={mobile ? 0 : 4} enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.92} luminanceSmoothing={0.15} radius={0.6} />
        <Noise opacity={mobile ? 0.05 : 0.07} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </>
  );
}

export default function JungleBackdrop({
  variant = 'hero',
  gorilla = false,
  splats = false,
  className = 'absolute inset-0',
}: {
  variant?: Variant;
  gorilla?: boolean;
  splats?: boolean;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const shared = useMemo<Shared>(() => ({ progress: 0, mx: 0, my: 0 }), []);
  const [visible, setVisible] = useState(true);
  const [env] = useState(() => ({
    mobile: typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches,
    still: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));

  useEffect(() => {
    const el = wrap.current;
    const section = el?.parentElement;
    if (!el || !section) return;
    // pause quand la scène sort de l'écran
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(section);
    let raf = 0;
    const loop = () => {
      const r = section.getBoundingClientRect();
      const span = Math.max(r.height - window.innerHeight, window.innerHeight * 0.6);
      shared.progress = clamp(-r.top / span);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onMove = (e: PointerEvent) => {
      shared.mx = (e.clientX / window.innerWidth) * 2 - 1;
      shared.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); };
  }, [shared]);

  return (
    <div ref={wrap} className={`${className} pointer-events-none`} aria-hidden>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={env.mobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, EYE, 10], fov: 52, near: 0.1, far: 80 }}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      >
        <Scene variant={variant} gorilla={gorilla} splats={splats} shared={shared} mobile={env.mobile} still={env.still} />
      </Canvas>
    </div>
  );
}
