'use client';
import { forwardRef } from 'react';
import Reveal from './Reveal';
import { useVisitor } from './visitor';

// Archétypes (pas de faux témoignages) — à compléter plus tard par de vraies citations de membres
export const PEOPLE: { line: string; sub: string; w: [number, number] }[] = [
  { line: 'Celui qui n’avait jamais touché une barre.', sub: 'On a tous commencé quelque part.', w: [0.2, 0.34] },
  { line: 'Celle qui reprend après une grossesse.', sub: 'À son rythme, avec un coach qui adapte chaque mouvement.', w: [0.34, 0.48] },
  { line: 'Ceux qui passent à midi, entre deux réunions.', sub: 'Une heure pour soi, et des collègues devenus copains.', w: [0.48, 0.62] },
  { line: 'Le compétiteur qui prépare son Hyrox.', sub: 'Et qui sera le premier à t’encourager.', w: [0.62, 0.76] },
  { line: 'De 18 à 65 ans. Débutants, confirmés.', sub: 'Personne ne juge personne. Tout le monde progresse.', w: [0.76, 0.88] },
];

const PeopleChapter = forwardRef<HTMLElement>(function PeopleChapter(_, ref) {
  const { name } = useVisitor();
  return (
    <section ref={ref} id="la-tribu" data-ch="people" className="relative z-10 h-[520svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden pointer-events-none">
        <Reveal w={[0.0, 0.2]} className="absolute inset-x-0 top-[20%] px-4 md:px-12 text-center">
          <div className="relative inline-block">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[180%] bg-[radial-gradient(closest-side,rgba(8,8,8,0.92),rgba(8,8,8,0.6)_55%,transparent)] -z-10" />
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gray-400 mb-4">Regarde autour de toi</p>
          <h2 className="font-display uppercase text-white text-6xl md:text-[9vw] leading-[0.85]">
            Toute une <span className="text-primary">tribu.</span>
          </h2>
          </div>
        </Reveal>

        {PEOPLE.map((p, i) => (
          <Reveal key={p.line} w={p.w} className="absolute left-4 right-4 bottom-10 md:left-12 md:right-auto md:bottom-14 md:max-w-2xl">
            <div className="absolute -inset-x-16 -inset-y-14 bg-[radial-gradient(closest-side,rgba(8,8,8,0.88),rgba(8,8,8,0.5)_60%,transparent)] -z-10" />
            <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-2">Tu croiseras…</p>
            <p className="font-display uppercase text-white text-4xl md:text-6xl leading-[0.92] mb-3">{p.line}</p>
            <p className="font-body text-gray-300 text-base md:text-lg">{p.sub}</p>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-4">{String(i + 1).padStart(2, '0')} / 05</p>
          </Reveal>
        ))}

        <Reveal w={[0.88, 1.2]} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[180%] bg-[radial-gradient(closest-side,rgba(8,8,8,0.92),rgba(8,8,8,0.6)_55%,transparent)] -z-10" />
          <p className="font-display uppercase text-white text-5xl md:text-[8vw] leading-[0.88] mb-4 [text-shadow:0_6px_40px_rgba(0,0,0,0.8)]">
            Tout le monde a eu<br />un premier jour.
          </p>
          <p className="font-brush text-primary text-3xl md:text-5xl -rotate-2">
            {name ? `${name}, le tien commence ici.` : 'Le tien commence ici.'}
          </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
});

export default PeopleChapter;
