'use client';
import { forwardRef } from 'react';
import Reveal from './Reveal';
import TransitionLink from '../TransitionLink';

const FORMATS: {
  kicker: string;
  name: string;
  line: string;
  text: string;
  tags: string[];
  w: [number, number];
  link?: { href: string; label: string };
}[] = [
  {
    kicker: 'Le cœur de la box',
    name: 'CrossFit',
    line: 'Chaque jour, un WOD différent.',
    text: 'Force, gymnastique, cardio : une heure encadrée, en groupe. On apprend les mouvements, on progresse ensemble.',
    tags: ['WOD', 'Gym', 'Haltéro', 'FBB', 'HIIT', 'WOD Team'],
    w: [0.0, 0.33],
  },
  {
    kicker: 'La course fitness mondiale',
    name: 'Hyrox',
    line: '8 km. 8 ateliers. 1 chrono.',
    text: '1 km de course, puis un atelier (SkiErg, traîneau, rameur, wall balls…), huit fois de suite. En solo, en duo ou en relais.',
    tags: ['Open', 'Pro', 'Doubles', 'Relay'],
    w: [0.33, 0.66],
    link: { href: '/hybrid', label: 'Vivre la course en 3D' },
  },
  {
    kicker: 'Le test de l’athlète complet',
    name: 'ATHX',
    line: '3 zones. 3 scores.',
    text: 'Force maximale, endurance, puis un MetCon final. Chaque zone est notée, le classement se fait aux points.',
    tags: ['Lite', 'ATHX', 'Pro'],
    w: [0.66, 1.05],
    link: { href: '/hybrid', label: 'Découvrir ATHX' },
  },
];

const FormatsChapter = forwardRef<HTMLElement>(function FormatsChapter(_, ref) {
  return (
    <section ref={ref} id="formats" data-ch="formats" className="relative z-10 h-[420svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden pointer-events-none">
        <Reveal w={[0.0, 1.05]} className="absolute top-24 md:top-28 left-4 md:left-12">
          <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2">Tes formats</p>
        </Reveal>

        {FORMATS.map((f, i) => (
          <Reveal key={f.name} w={f.w} className="absolute left-4 right-4 bottom-10 md:left-12 md:right-auto md:bottom-14 md:max-w-2xl">
            <div className="absolute -inset-x-16 -inset-y-14 bg-[radial-gradient(closest-side,rgba(8,8,8,0.9),rgba(8,8,8,0.55)_60%,transparent)] -z-10" />
            <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gray-400 mb-2">
              {String(i + 1).padStart(2, '0')} / 03 · {f.kicker}
            </p>
            <p className="font-display uppercase text-white text-7xl md:text-9xl leading-[0.85]">{f.name}</p>
            <p className="font-display uppercase text-primary text-2xl md:text-3xl mt-2 mb-3">{f.line}</p>
            <p className="font-body text-gray-300 text-base md:text-lg max-w-xl">{f.text}</p>
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {f.tags.map((t) => (
                <span key={t} className="border border-white/20 px-3 py-1 font-body text-[11px] uppercase tracking-[0.2em] text-gray-300">{t}</span>
              ))}
              {f.link && (
                <TransitionLink
                  href={f.link.href}
                  className="pointer-events-auto ml-1 font-display uppercase tracking-widest text-sm text-primary hover:text-white transition-colors"
                >
                  {f.link.label} →
                </TransitionLink>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
});

export default FormatsChapter;
