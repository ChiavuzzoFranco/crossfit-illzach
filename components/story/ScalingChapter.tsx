'use client';
import { forwardRef, useState } from 'react';
import { Sticker, tilt } from './ui';

// Le même WOD, trois versions. Exemple pédagogique (le coach adapte au cas par cas).
const LEVELS = ['Découverte', 'Intermédiaire', 'Confirmé'] as const;
const WOD: { move: string; versions: [string, string, string] }[] = [
  { move: 'Thrusters', versions: ['Avec une barre légère ou deux haltères', 'Barre à 30 kg', 'Barre à 43 kg'] },
  { move: 'Tractions', versions: ['Tirage incliné aux anneaux', 'Tractions avec élastique', 'Tractions strictes'] },
  { move: 'Box', versions: ['Step-ups sur la box', 'Box jumps, 50 cm', 'Box jumps, 60 cm'] },
];

const ScalingChapter = forwardRef<HTMLElement>(function ScalingChapter(_, ref) {
  const [level, setLevel] = useState(0);
  return (
    <section ref={ref} id="pour-tous" data-ch="scaling" className="relative z-10 md:h-[220svh]">
      <div className="md:sticky md:top-0 min-h-[100svh] flex items-center px-4 md:px-12 py-24">
        <div className="reveal-on-scroll relative w-full max-w-6xl mx-auto grid md:grid-cols-[1fr_1.1fr] gap-12 md:gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-10 bg-[radial-gradient(closest-side,rgba(8,8,8,0.85),rgba(8,8,8,0.45)_60%,transparent)] -z-10" />
            <p className="font-brush text-primary text-3xl md:text-5xl -rotate-2 mb-2">Ouvert à tous</p>
            <h2 className="font-display uppercase text-white text-5xl md:text-7xl leading-[0.88] mb-6">
              Même WOD.<br />Même chrono.<br /><span className="text-primary">Même tribu.</span>
            </h2>
            <p className="font-body text-gray-200 text-base md:text-lg leading-relaxed max-w-md">
              Juste la bonne version pour toi. Mal au genou ? Reprise après une grossesse ? Première fois ?
              Le coach adapte chaque mouvement. Zéro ego, zéro pression.
            </p>
          </div>

          {/* Le WOD du jour, en stickers */}
          <div className="relative">
            <div className="absolute -inset-10 bg-[radial-gradient(closest-side,rgba(8,8,8,0.8),rgba(8,8,8,0.35)_60%,transparent)] -z-10" />
            <div className="flex items-baseline gap-4 mb-5">
              <p className="font-brush text-white text-3xl md:text-4xl -rotate-2">Le WOD du jour</p>
              <p className="font-display uppercase tracking-[0.2em] text-sm text-primary">12 min · AMRAP</p>
            </div>

            <p className="font-body text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-3">Choisis ta version</p>
            <div role="radiogroup" aria-label="Choisis ta version" className="flex flex-wrap gap-3 mb-10">
              {LEVELS.map((l, i) => (
                <button key={l} type="button" role="radio" aria-checked={level === i} onClick={() => setLevel(i)}>
                  <Sticker rot={tilt(i, 4)} tone={level === i ? 'red' : 'black'} className="px-4 py-2 text-sm md:text-base">
                    {l}
                  </Sticker>
                </button>
              ))}
            </div>

            <ul className="space-y-7">
              {WOD.map((w, i) => (
                <li key={w.move} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <p className="font-display uppercase text-white text-3xl md:text-4xl leading-none shrink-0 sm:w-48">
                    <span className="text-primary">10</span> {w.move}
                  </p>
                  <span key={`${w.move}-${level}`} className="hx-in">
                    <Sticker rot={tilt(i + level * 3, 3)} tone={level === 2 ? 'peach' : 'white'} className="px-4 py-2 text-base md:text-lg">
                      {w.versions[level]}
                    </Sticker>
                  </span>
                </li>
              ))}
            </ul>

            <p className="font-body text-xs text-gray-400 mt-8">Exemple : en cours, le coach ajuste chaque version à ton niveau du jour.</p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ScalingChapter;
