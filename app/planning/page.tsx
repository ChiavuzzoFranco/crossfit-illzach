'use client';
import { useEffect, useRef } from "react";
import { Lock, Dumbbell } from "lucide-react";
import TransitionLink from "../../components/TransitionLink";
import dynamic from "next/dynamic";
import JungleLeaves from "../../components/jungle/JungleLeaves";
import { Splash, Sticker, tilt } from "../../components/jungle/ui";
import { SCHEDULE, DAYS } from "@/lib/schedule";

const AccessBadge3D = dynamic(() => import("@/components/AccessBadge3D"), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] md:h-[600px]" />,
});
const JungleBackdrop = dynamic(() => import("../../components/jungle/JungleBackdrop"), { ssr: false });

const isHybrid = (t: string) => /HYROX|ATHX/.test(t);
const cap = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

// Liane : sépare les jours sans trait dur
function Vine() {
  return (
    <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="w-full h-5 text-blood/80" aria-hidden>
      <path d="M0,12 C40,2 80,22 120,10 S200,2 240,14 S320,24 360,8 S400,8 400,10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Un créneau = une étiquette-sticker
function Slot({ day, time, type, i }: { day: string; time: string; type: string; i: number }) {
  const creneau = `${day} ${time} - ${type}`;
  return (
    <TransitionLink href={`/contact?creneau=${encodeURIComponent(creneau)}`} className="group inline-block transition-transform hover:-translate-y-1">
      <Sticker rot={tilt(i, 4)} tone={isHybrid(type) ? 'red' : 'white'} className="px-3.5 py-2 text-left">
        <span className="block text-xl md:text-2xl leading-none tabular-nums">{time}</span>
        <span className="block text-xs md:text-sm leading-tight mt-1">{type}</span>
        <span className="block text-[10px] mt-1 opacity-0 group-hover:opacity-80 transition-opacity">Réserver →</span>
      </Sticker>
    </TransitionLink>
  );
}

export default function PlanningPage() {
  const badgeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      gsap.fromTo(".planning-row",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.5 }
      );

      if (badgeSectionRef.current) {
        gsap.fromTo(badgeSectionRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1 }
        );
      }
    })();
  }, []);

  return (
    <main className="relative min-h-screen text-white pt-32 pb-20 px-4 md:px-12 overflow-x-clip">
      {/* Jungle en haut de page, fondue vers le bas */}
      <JungleBackdrop variant="frame" className="absolute inset-x-0 top-0 h-[90svh]" />
      <div className="absolute inset-x-0 top-[55svh] h-[35svh] bg-gradient-to-b from-transparent to-bg pointer-events-none" />

      <div className="relative mb-12">
        <p className="font-brush text-primary text-3xl md:text-5xl -rotate-3">La tribu se retrouve</p>
        <h1 className="font-display text-[18vw] md:text-[12vw] leading-none text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.8)]">PLANNING</h1>
      </div>

      {/* LE TABLEAU : un jour = une ligne de la jungle */}
      <div className="relative isolate">
        <JungleLeaves set="right" opacity={0.7} />
        {DAYS.map((day, di) => {
          const slots = SCHEDULE[day];
          const morning = slots.filter(s => parseInt(s.time) < 13);
          const evening = slots.filter(s => parseInt(s.time) >= 13);

          return (
            <div key={day} className="planning-row py-6 md:py-8">
              {di === 0 && <Vine />}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1.4fr] gap-4 md:gap-8 items-start py-4 md:py-6">
                {/* Jour */}
                <div className="relative">
                  <Splash variant={di} className="absolute -left-6 -top-6 w-28 h-28 md:w-36 md:h-36 text-blood/45 -z-10" />
                  <span className="font-brush text-primary text-5xl md:text-6xl -rotate-3 inline-block">{cap(day)}</span>
                </div>

                {/* Mobile : tous les créneaux à la suite */}
                <div className="md:hidden flex flex-wrap gap-3">
                  {slots.map((slot, i) => <Slot key={slot.time} day={day} time={slot.time} type={slot.type} i={di * 7 + i} />)}
                </div>

                {/* Desktop : matin / soir */}
                <div className="hidden md:block">
                  <p className="font-body text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">Matin & midi</p>
                  <div className="flex flex-wrap gap-3">
                    {morning.map((slot, i) => <Slot key={slot.time} day={day} time={slot.time} type={slot.type} i={di * 7 + i} />)}
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="font-body text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">Après-midi & soir</p>
                  <div className="flex flex-wrap gap-3">
                    {evening.map((slot, i) => <Slot key={slot.time} day={day} time={slot.time} type={slot.type} i={di * 7 + i + 3} />)}
                  </div>
                </div>
              </div>
              <Vine />
            </div>
          );
        })}
      </div>

      {/* SECTION ACCÈS LIBRE */}
      <div ref={badgeSectionRef} className="relative isolate mt-24 pt-12">
        <JungleLeaves set="left" opacity={0.85} />
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">

          {/* Badge 3D, posé sur une éclaboussure */}
          <div className="relative w-full md:w-1/2 shrink-0">
            <Splash variant={2} className="absolute inset-[8%] w-[84%] h-[84%] text-blood/60 -z-10" />
            <AccessBadge3D />
          </div>

          {/* Texte */}
          <div className="relative w-full md:w-1/2">
            <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-1">En dehors des cours</p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-6">ACCÈS <span className="text-primary">LIBRE</span></h2>
            <p className="font-body text-gray-300 text-lg leading-relaxed mb-8">
              Pas de cours à votre horaire ? Avec votre badge, accédez à la Box{" "}
              <span className="text-white font-bold">7j/7 de 6h à 22h</span>.
              Entraînez-vous en autonomie, suivez votre propre programme ou rattrapez un WOD manqué.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Sticker rot={-2} tone="black" className="px-4 py-2 text-sm inline-flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Accès sécurisé
              </Sticker>
              <Sticker rot={2} tone="black" className="px-4 py-2 text-sm inline-flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" /> Équipement complet
              </Sticker>
            </div>

            <TransitionLink href="/tarifs" className="inline-block">
              <Sticker rot={-2} tone="red" className="px-7 py-3.5 text-lg">Voir les abonnements →</Sticker>
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* CTA CONTACT */}
      <div className="relative mt-24 pt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-brush text-primary text-2xl -rotate-2 mb-1">On répond à tout</p>
          <h2 className="font-display text-4xl md:text-5xl mb-2">UNE QUESTION ?</h2>
          <p className="font-body text-gray-300">Premier cours d&apos;essai, horaires, niveau requis... on répond à tout.</p>
        </div>
        <TransitionLink href="/contact" className="inline-block shrink-0">
          <Sticker rot={2} tone="white" className="px-8 py-4 text-xl">Nous contacter →</Sticker>
        </TransitionLink>
      </div>

    </main>
  );
}
