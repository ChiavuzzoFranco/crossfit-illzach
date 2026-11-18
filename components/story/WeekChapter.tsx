'use client';
import { forwardRef } from 'react';
import { SCHEDULE, DAYS } from '@/lib/schedule';
import { goTo, setVisitor, useVisitor } from './visitor';
import { Sticker, Splash, tilt } from './ui';

const LABELS: Record<string, string> = { WEIGHTLIFTING: 'Haltéro', 'COURS SPÉ': 'Cours spé' };
const label = (t: string) => LABELS[t] ?? t;
const isHybrid = (t: string) => /HYROX|ATHX/.test(t);
export const slotKey = (day: string, time: string, type: string) => `${day} ${time} · ${label(type)}`;

const cap = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

// Liane : un trait ondulé dessiné au pinceau
function Vine() {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute left-0 right-0 top-0 w-full h-10 text-blood" aria-hidden>
      <path d="M0,18 C40,4 80,30 120,16 S200,4 240,20 S320,34 360,14 S400,10 400,12" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M0,22 C50,10 90,34 130,20 S210,8 250,24 S330,36 370,18" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
    </svg>
  );
}

const WeekChapter = forwardRef<HTMLElement>(function WeekChapter(_, ref) {
  const { slot, name } = useVisitor();

  return (
    <section ref={ref} id="planning" data-ch="week" className="relative z-10 h-[460svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Le sentier : glisse horizontalement au fil du scroll (data-htrack, piloté par la boucle) */}
        <div data-htrack className="absolute inset-y-0 left-0 flex items-center will-change-transform" style={{ transform: 'translate3d(0,0,0)' }}>
          {/* Entrée du sentier */}
          <div className="shrink-0 w-[88vw] md:w-[52vw] px-4 md:pl-12 md:pr-8">
            <p className="font-brush text-primary text-3xl md:text-5xl -rotate-3 mb-2">Ta semaine</p>
            <h2 className="font-display uppercase text-white text-5xl md:text-[6.5vw] leading-[0.86] mb-6 [text-shadow:0_6px_30px_rgba(0,0,0,0.8)]">
              La tribu se retrouve<br /><span className="text-primary">6 jours sur 7.</span>
            </h2>
            <p className="font-body text-gray-200 text-base md:text-lg max-w-md leading-relaxed [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
              Matin, midi, soir, samedi. Suis le sentier et attrape le rendez-vous qui te va :
              on te garde une place pour ta séance d’essai.
            </p>
            <p className="mt-6 flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.3em] text-gray-400">
              <span className="block w-10 h-px bg-primary" /> Scrolle pour avancer
            </p>
          </div>

          {/* Une étape par jour */}
          {DAYS.map((d, di) => (
            <div key={d} className="shrink-0 w-[86vw] md:w-[42vw] px-4 md:px-8 relative">
              <div className="relative">
                <Splash variant={di} className="absolute -left-10 -top-16 w-56 h-56 md:w-72 md:h-72 text-blood/70 -z-10" />
                <p className="font-brush text-primary text-6xl md:text-8xl -rotate-3 leading-none [text-shadow:0_4px_20px_rgba(0,0,0,0.7)]">{cap(d)}</p>
                <p className="font-body text-[11px] uppercase tracking-[0.3em] text-gray-300 mt-2 mb-8">
                  {SCHEDULE[d].length} rendez-vous
                </p>
              </div>

              {/* Les étiquettes accrochées à la liane */}
              <div className="relative pt-6">
                <Vine />
                <div className="flex flex-wrap gap-x-5 gap-y-8 pt-4">
                  {SCHEDULE[d].map((s, i) => {
                    const key = slotKey(d, s.time, s.type);
                    const on = slot === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setVisitor({ slot: on ? '' : key })}
                        className="group relative pt-5 transition-transform hover:-translate-y-1"
                      >
                        <span className="absolute left-1/2 top-0 h-5 w-px bg-blood" aria-hidden />
                        <Sticker
                          rot={tilt(di * 7 + i, 5)}
                          tone={on ? 'peach' : isHybrid(s.type) ? 'red' : 'white'}
                          className="px-4 py-2.5 text-left"
                        >
                          <span className="block text-2xl md:text-3xl leading-none tabular-nums">{s.time}</span>
                          <span className="block text-sm md:text-base leading-tight mt-1">{label(s.type)}{on ? ' ✓' : ''}</span>
                        </Sticker>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Fin du sentier */}
          <div className="shrink-0 w-[80vw] md:w-[40vw] px-4 md:px-10">
            <p className="font-display uppercase text-white text-4xl md:text-6xl leading-[0.9] [text-shadow:0_6px_30px_rgba(0,0,0,0.8)]">
              Et en dehors des cours ?
            </p>
            <p className="font-body text-gray-200 text-base md:text-lg mt-4 max-w-sm [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
              Avec l’Illimité, la jungle t’est ouverte <span className="text-white font-semibold">7j/7 de 6h à 22h</span>, avec ton badge.
            </p>
          </div>
        </div>

        {/* Ton rendez-vous, toujours visible une fois choisi */}
        <div className={`absolute left-4 right-4 bottom-6 md:left-auto md:right-12 md:bottom-10 transition-all duration-500 ${slot ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`} aria-live="polite">
          <button type="button" onClick={() => goTo('essai')} className="group text-left">
            <Sticker rot={-2} tone="red" className="px-5 py-3">
              <span className="block font-body normal-case tracking-normal text-xs opacity-80">{name ? `${name}, ton rendez-vous :` : 'Ton rendez-vous :'}</span>
              <span className="block text-xl md:text-2xl">{slot}</span>
              <span className="block text-xs mt-1 group-hover:underline">Réserver ma séance d’essai →</span>
            </Sticker>
          </button>
        </div>
      </div>
    </section>
  );
});

export default WeekChapter;
