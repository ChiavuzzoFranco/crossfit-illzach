'use client';
import { forwardRef, useState } from 'react';
import { PLANS, BADGE_DEPOSIT } from '@/lib/plans';
import { goTo, setVisitor, useVisitor } from './visitor';
import { Splash, Sticker, tilt } from './ui';

// Couleur de l'éclaboussure de chaque place
const SPLASH: Record<string, string> = { '2x': 'text-blood', '3x': 'text-ember', illimite: 'text-primary', heros: 'text-white' };

const PlansChapter = forwardRef<HTMLElement>(function PlansChapter(_, ref) {
  const { plan, name } = useVisitor();
  const [annual, setAnnual] = useState(true);

  return (
    <section ref={ref} id="tarifs" data-ch="plans" className="relative z-10 min-h-[100svh] px-4 md:px-12 py-28 md:py-36 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        {/* Titre */}
        <div className="reveal-on-scroll text-center mb-14 md:mb-20">
          <p className="font-brush text-primary text-3xl md:text-5xl -rotate-2 mb-2">{name ? `${name}, et toi ?` : 'Et toi ?'}</p>
          <h2 className="font-display uppercase text-white text-5xl md:text-[7vw] leading-[0.86] [text-shadow:0_6px_30px_rgba(0,0,0,0.85)]">
            Choisis ta place<br />dans la <span className="text-primary">tribu.</span>
          </h2>
          {/* Engagement : deux stickers */}
          <div role="radiogroup" aria-label="Engagement" className="mt-8 flex justify-center gap-4">
            {[
              { v: true, l: 'Sur 12 mois' },
              { v: false, l: 'Sans engagement' },
            ].map((o, i) => (
              <button key={o.l} type="button" role="radio" aria-checked={annual === o.v} onClick={() => setAnnual(o.v)}>
                <Sticker rot={i ? 2 : -2} tone={annual === o.v ? 'red' : 'black'} className="px-4 py-2 text-sm md:text-base">
                  {o.l}
                </Sticker>
              </button>
            ))}
          </div>
        </div>

        {/* Les places : éclaboussures posées dans la jungle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-16">
          {PLANS.map((p, i) => {
            const chosen = plan === p.name;
            const light = p.id === 'heros';
            return (
              <article
                key={p.id}
                className={`reveal-on-scroll relative isolate px-6 pt-14 pb-10 text-center ${i % 2 ? 'xl:mt-16' : ''}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <Splash variant={i + 2} className={`absolute -inset-x-5 -top-8 -bottom-6 w-[calc(100%+2.5rem)] h-[calc(100%+3.5rem)] ${SPLASH[p.id]} opacity-95 -z-10 drop-shadow-[8px_10px_0_rgba(0,0,0,0.55)]`} style={{ transform: `rotate(${tilt(i, 8)}deg)` }} />

                {p.popular && <Sticker rot={-6} tone="white" className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs whitespace-nowrap">Le préféré de la tribu</Sticker>}
                {p.special && <Sticker rot={5} tone="black" className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] whitespace-nowrap">{p.special}</Sticker>}

                <p className={`font-brush text-3xl md:text-4xl -rotate-2 mt-4 ${light ? 'text-primary' : 'text-white'}`}>{p.role}</p>
                <p className="mt-2">
                  <Sticker rot={tilt(i + 9, 2)} tone="black" className="px-2.5 py-1 text-[11px] md:text-xs tracking-[0.15em]">{p.name} · {p.tagline}</Sticker>
                </p>

                <p className={`font-display leading-none mt-4 ${light ? 'text-bg' : 'text-white'}`}>
                  <span key={`${p.id}-${annual}`} className="hx-in inline-block text-8xl md:text-9xl">{annual ? p.priceAnnual : p.priceMonthly}</span>
                  <span className="text-3xl align-top ml-1">€</span>
                </p>
                <p className={`font-body text-xs uppercase tracking-[0.2em] mb-5 ${light ? 'text-bg/70' : 'text-white/75'}`}>par mois</p>

                <p className={`font-body text-sm max-w-[16rem] mx-auto mb-5 ${light ? 'text-bg' : 'text-white'}`}>{p.roleLine}</p>

                <ul className="flex flex-wrap justify-center gap-2 mb-7">
                  {p.features.map((f, k) => (
                    <li key={f}>
                      <Sticker rot={tilt(i * 5 + k, 3)} tone={light ? 'black' : 'white'} className="px-2.5 py-1 text-[11px] md:text-xs">{f}</Sticker>
                    </li>
                  ))}
                </ul>

                <button type="button" onClick={() => { setVisitor({ plan: p.name }); goTo('essai'); }} className="group">
                  <Sticker rot={-2} tone={light ? 'red' : 'black'} className="px-5 py-3 text-sm md:text-base group-hover:scale-105 transition-transform">
                    {chosen ? 'C’est ma place ✓' : 'Je prends ma place →'}
                  </Sticker>
                </button>
              </article>
            );
          })}
        </div>

        <p className="reveal-on-scroll font-body text-[11px] uppercase tracking-[0.25em] text-gray-400 mt-16 text-center [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
          {annual ? 'Engagement 12 mois' : 'Sans engagement'} · Caution badge : {BADGE_DEPOSIT} € · Hyrox inclus · On commence toujours par un essai
        </p>
      </div>
    </section>
  );
});

export default PlansChapter;
