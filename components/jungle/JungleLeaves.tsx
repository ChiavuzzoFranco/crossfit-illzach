// Feuilles en SVG (sans 3D) pour encadrer les sections secondaires.
// Même dessin que le feuillage 3D : aplats noirs, rouges et orange du logo.
import type { CSSProperties } from 'react';

const COLORS = { black: '#141010', blood: '#8E1A0E', red: '#E0281A', ember: '#E8642A', peach: '#F2A273' };

function Leaf({ kind, color, style }: { kind: 'pointed' | 'palm'; color: string; style: CSSProperties }) {
  if (kind === 'palm') {
    const leaflets = Array.from({ length: 14 }, (_, i) => {
      const t = 0.08 + (i / 14) * 0.88;
      const y = 196 - t * 190;
      const len = 18 + Math.sin(t * Math.PI) * 46;
      return { y, len, t };
    });
    return (
      <svg viewBox="0 0 120 200" style={style} className="absolute" aria-hidden>
        {leaflets.map((l, i) => (
          <g key={i} fill={color}>
            <path d={`M60,${l.y} q${-l.len * 0.5},-6 ${-l.len},${-l.len * 0.35 - 6 * (1 - l.t)} q${l.len * 0.55},${l.len * 0.1} ${l.len},${l.len * 0.35 + 6 * (1 - l.t)}Z`} />
            <path d={`M60,${l.y} q${l.len * 0.5},-6 ${l.len},${-l.len * 0.35 - 6 * (1 - l.t)} q${-l.len * 0.55},${l.len * 0.1} ${-l.len},${l.len * 0.35 + 6 * (1 - l.t)}Z`} />
          </g>
        ))}
        <path d="M60,198 Q64,100 60,4" stroke={color} strokeWidth="3" fill="none" />
      </svg>
    );
  }
  const dark = color === COLORS.black;
  return (
    <svg viewBox="0 0 100 200" style={style} className="absolute" aria-hidden>
      <path d="M50,196 C-8,140 4,40 50,4 C96,40 108,140 50,196Z" fill={color} stroke={dark ? '#3a0d06' : 'rgba(0,0,0,0.25)'} strokeWidth="2.5" />
      <path d="M50,194 Q53,100 50,10" stroke={dark ? '#3a0d06' : 'rgba(0,0,0,0.3)'} strokeWidth="2.5" fill="none" />
      {[40, 70, 100, 130, 160].map((y) => (
        <g key={y} stroke={dark ? '#3a0d06' : 'rgba(0,0,0,0.3)'} strokeWidth="1.6" fill="none">
          <path d={`M50,${y + 12} Q30,${y} 14,${y - 14}`} />
          <path d={`M50,${y + 12} Q70,${y} 86,${y - 14}`} />
        </g>
      ))}
    </svg>
  );
}

type Spot = { x: string; y: string; w: number; rot: number; kind: 'pointed' | 'palm'; color: keyof typeof COLORS };

// Compositions prêtes à l'emploi (positions en % de la section)
const SETS: Record<'corners' | 'left' | 'right' | 'bottom', Spot[]> = {
  corners: [
    { x: '-4%', y: '-6%', w: 180, rot: 140, kind: 'palm', color: 'black' },
    { x: '2%', y: '-8%', w: 110, rot: 160, kind: 'pointed', color: 'red' },
    { x: '88%', y: '-6%', w: 150, rot: -150, kind: 'pointed', color: 'black' },
    { x: '82%', y: '-10%', w: 120, rot: -130, kind: 'pointed', color: 'ember' },
    { x: '-5%', y: '78%', w: 140, rot: 40, kind: 'pointed', color: 'blood' },
    { x: '90%', y: '74%', w: 190, rot: -40, kind: 'palm', color: 'black' },
  ],
  left: [
    { x: '-6%', y: '8%', w: 170, rot: 70, kind: 'palm', color: 'black' },
    { x: '-4%', y: '40%', w: 120, rot: 100, kind: 'pointed', color: 'red' },
    { x: '-7%', y: '62%', w: 140, rot: 60, kind: 'pointed', color: 'black' },
  ],
  right: [
    { x: '92%', y: '6%', w: 170, rot: -70, kind: 'palm', color: 'black' },
    { x: '94%', y: '38%', w: 120, rot: -100, kind: 'pointed', color: 'ember' },
    { x: '90%', y: '64%', w: 140, rot: -60, kind: 'pointed', color: 'blood' },
  ],
  bottom: [
    { x: '6%', y: '78%', w: 130, rot: 20, kind: 'pointed', color: 'black' },
    { x: '30%', y: '84%', w: 110, rot: -10, kind: 'pointed', color: 'red' },
    { x: '58%', y: '80%', w: 170, rot: 8, kind: 'palm', color: 'black' },
    { x: '82%', y: '82%', w: 120, rot: -25, kind: 'pointed', color: 'ember' },
  ],
};

export default function JungleLeaves({ set = 'corners', opacity = 1 }: { set?: keyof typeof SETS; opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10" style={{ opacity }} aria-hidden>
      {SETS[set].map((s, i) => (
        <Leaf
          key={i}
          kind={s.kind}
          color={COLORS[s.color]}
          style={{ left: s.x, top: s.y, width: s.w, height: s.w * 2, transform: `rotate(${s.rot}deg)`, transformOrigin: '50% 100%', filter: 'drop-shadow(6px 8px 0 rgba(0,0,0,0.45))' }}
        />
      ))}
    </div>
  );
}
