'use client';
import { forwardRef } from 'react';
import Reveal from './Reveal';

// Une séance d'une heure, racontée. Fenêtres = progression du chapitre.
export const STEPS: { time: string; title: string; text: string; w: [number, number] }[] = [
  { time: '18:30', title: 'L’accueil', text: 'On se check, on se demande comment s’est passée la journée. Le coach connaît déjà ton prénom.', w: [0.0, 0.2] },
  { time: '18:40', title: 'L’échauffement', text: 'Tous ensemble, en cercle. Ça transpire déjà, et ça rigole aussi.', w: [0.2, 0.42] },
  { time: '18:50', title: 'La technique', text: 'En petits groupes. Le coach te montre, te corrige, adapte la charge. Tu n’es jamais livré à toi-même.', w: [0.42, 0.66] },
  { time: '19:05', title: 'Le WOD', text: 'Le chrono démarre. Chacun à son niveau, tous en même temps. Et autour de toi, ça encourage.', w: [0.66, 0.92] },
];

const SessionChapter = forwardRef<HTMLElement>(function SessionChapter(_, ref) {
  return (
    <section ref={ref} id="la-seance" data-ch="session" className="relative z-10 h-[520svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden pointer-events-none">
        {/* Horloge de la séance (mise à jour par la boucle de scroll) */}
        <Reveal w={[0.0, 1.05]} className="absolute top-24 md:top-28 left-4 md:left-12">
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gray-400 mb-1">Ta séance · 1 heure</p>
          <p className="font-display text-6xl md:text-8xl leading-none tabular-nums text-white">
            <span data-clock="1110,60">18:30</span>
          </p>
        </Reveal>

        {/* Frise des étapes */}
        <Reveal w={[0.0, 1.05]} className="absolute top-24 md:top-28 right-4 md:right-12 hidden md:flex flex-col items-end gap-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex items-center gap-3">
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-gray-500" data-step={i}>{s.title}</span>
              <span className="block w-8 h-[3px] bg-white/15 overflow-hidden">
                <span className="block h-full bg-primary origin-left" data-step-bar={i} style={{ transform: 'scaleX(0)' }} />
              </span>
            </div>
          ))}
        </Reveal>

        {STEPS.map((s) => (
          <Reveal key={s.title} w={s.w} className="absolute left-4 right-4 bottom-10 md:left-12 md:right-auto md:bottom-14 md:max-w-2xl">
            <div className="absolute -inset-x-16 -inset-y-14 bg-[radial-gradient(closest-side,rgba(8,8,8,0.88),rgba(8,8,8,0.5)_60%,transparent)] -z-10" />
            <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-1">{s.time}</p>
            <p className="font-display uppercase text-white text-5xl md:text-7xl leading-[0.9] mb-3">{s.title}</p>
            <p className="font-body text-gray-300 text-base md:text-lg max-w-xl">{s.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
});

export default SessionChapter;
