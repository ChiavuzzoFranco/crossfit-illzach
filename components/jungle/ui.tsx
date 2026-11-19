// Briques visuelles de la jungle : éclaboussures, papier déchiré, stickers, tampon.
// Tout est généré de façon déterministe (identique serveur / client).
import type { CSSProperties, ReactNode } from 'react';

function prng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// --- Éclaboussure de peinture (SVG) ----------------------------------------
function splashPath(seed: number) {
  const r = prng(seed);
  const N = 32;
  const phases = [r() * 6.28, r() * 6.28, r() * 6.28];
  const spikes = Array.from({ length: 5 }, () => ({ a: r() * Math.PI * 2, h: 0.18 + r() * 0.28 }));
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    let rad = 1 + 0.07 * Math.sin(a * 3 + phases[0]) + 0.05 * Math.sin(a * 5 + phases[1]) + 0.03 * Math.sin(a * 9 + phases[2]);
    for (const s of spikes) {
      const d = Math.atan2(Math.sin(a - s.a), Math.cos(a - s.a));
      rad += s.h * Math.exp(-(d * d) / 0.012);
    }
    pts.push([100 + Math.cos(a) * rad * 62, 100 + Math.sin(a) * rad * 62]);
  }
  // Catmull-Rom → Bézier, boucle fermée
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  const drops = Array.from({ length: 7 }, () => {
    const a = r() * Math.PI * 2;
    const rr = 80 + r() * 18;
    return { x: 100 + Math.cos(a) * rr, y: 100 + Math.sin(a) * rr, s: 2 + r() * 5 };
  });
  return { d: d + ' Z', drops };
}
const SPLASHES = [11, 23, 37, 41, 59, 73].map(splashPath);

export function Splash({ variant = 0, className = '', style }: { variant?: number; className?: string; style?: CSSProperties }) {
  const s = SPLASHES[variant % SPLASHES.length];
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden preserveAspectRatio="none">
      <path d={s.d} fill="currentColor" />
      {s.drops.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.s} fill="currentColor" />)}
    </svg>
  );
}

// --- Papier déchiré (clip-path) ---------------------------------------------
function tornClip(seed: number) {
  const r = prng(seed);
  const pts: string[] = [];
  const edge = (n: number, f: (t: number, j: number) => string) => {
    for (let i = 0; i <= n; i++) pts.push(f(i / n, r()));
  };
  edge(36, (t, j) => `${(t * 100).toFixed(2)}% ${(j * 1.6).toFixed(2)}%`);
  edge(24, (t, j) => `${(100 - j * 1.2).toFixed(2)}% ${(t * 100).toFixed(2)}%`);
  edge(36, (t, j) => `${(100 - t * 100).toFixed(2)}% ${(100 - j * 1.6).toFixed(2)}%`);
  edge(24, (t, j) => `${(j * 1.2).toFixed(2)}% ${(100 - t * 100).toFixed(2)}%`);
  return `polygon(${pts.join(',')})`;
}
export const TORN = tornClip(97);

// --- Sticker (étiquette inclinée, ombre franche) ---------------------------
export function Sticker({
  children,
  rot = 0,
  tone = 'white',
  className = '',
}: {
  children: ReactNode;
  rot?: number;
  tone?: 'white' | 'red' | 'black' | 'peach';
  className?: string;
}) {
  const tones = {
    white: 'bg-white text-bg',
    red: 'bg-primary text-white',
    black: 'bg-bg text-white border border-white/30',
    peach: 'bg-peach text-bg',
  };
  return (
    <span
      className={`inline-block font-display uppercase tracking-wide shadow-[5px_5px_0_rgba(0,0,0,0.65)] ${tones[tone]} ${className}`}
      style={{ transform: `rotate(${rot}deg) skewX(-6deg)` }}
    >
      {children}
    </span>
  );
}

// --- Tampon de la tribu ------------------------------------------------------
export function Stamp({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fill="currentColor" fontSize="10.5" letterSpacing="2.2" style={{ fontFamily: 'var(--font-anton)' }}>
        <textPath href="#stamp-circle">TRIBU · CROSSFIT ILLZACH · BIENVENUE ·</textPath>
      </text>
      <text x="60" y="68" textAnchor="middle" fill="currentColor" fontSize="22" style={{ fontFamily: 'var(--font-anton)' }}>OK</text>
    </svg>
  );
}

// --- Rotation pseudo-aléatoire stable pour une liste -------------------------
export const tilt = (i: number, amp = 4) => (((i * 7919) % 11) / 10 - 0.5) * 2 * amp;
