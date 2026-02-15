'use client';
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Lock, Dumbbell } from "lucide-react";
import TransitionLink from "../../components/TransitionLink";
import AccessBadge3D from "@/components/AccessBadge3D";

// --- DONNÉES DU PLANNING (facile à modifier) ---
const SCHEDULE: Record<string, { time: string; type: string }[]> = {
  LUNDI: [
    { time: "11:00", type: "WOD" },
    { time: "12:15", type: "HIIT" },
    { time: "17:00", type: "HYROX" },
    { time: "18:15", type: "WEIGHTLIFTING" },
    { time: "19:30", type: "WOD" },
  ],
  MARDI: [
    { time: "11:00", type: "HYROX" },
    { time: "12:15", type: "WOD" },
    { time: "17:00", type: "WOD" },
    { time: "18:15", type: "GYM" },
    { time: "19:30", type: "FBB" },
  ],
  MERCREDI: [
    { time: "11:00", type: "GYM" },
    { time: "12:15", type: "WOD" },
    { time: "17:00", type: "WOD" },
    { time: "18:15", type: "HYROX" },
    { time: "19:30", type: "WOD TEAM" },
  ],
  JEUDI: [
    { time: "11:00", type: "WOD" },
    { time: "12:15", type: "HYROX" },
    { time: "17:00", type: "HYROX" },
    { time: "18:15", type: "WOD" },
    { time: "19:30", type: "WEIGHTLIFTING" },
  ],
  VENDREDI: [
    { time: "11:00", type: "HIIT" },
    { time: "12:15", type: "WOD" },
    { time: "17:00", type: "WOD" },
    { time: "18:15", type: "WOD" },
    { time: "19:30", type: "HYROX" },
  ],
  SAMEDI: [
    { time: "09:00", type: "WOD TEAM" },
    { time: "10:00", type: "WOD TEAM" },
    { time: "11:00", type: "HYROX TEAM" },
  ],
};

const DAYS = Object.keys(SCHEDULE);

export default function PlanningPage() {
  const badgeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <main className="min-h-screen bg-bg text-white pt-32 pb-20 px-4 md:px-12">

      <h1 className="font-display text-[12vw] leading-none text-white mb-12 reveal-text text-primary">PLANNING</h1>

      {/* LE TABLEAU (GRILLE) */}
      <div className="border-t border-white/20">

        {DAYS.map((day) => {
          const slots = SCHEDULE[day];
          // Séparer matin / soir pour garder le layout 2 colonnes
          const morning = slots.filter(s => parseInt(s.time) < 13);
          const evening = slots.filter(s => parseInt(s.time) >= 13);

          return (
            <div key={day} className="planning-row border-b border-white/20 py-6 md:py-8">

              {/* --- MOBILE : liste unique empilée --- */}
              <div className="md:hidden">
                <span className="font-display text-2xl text-primary mb-3 block">{day}</span>
                <div className="flex flex-col gap-2">
                  {slots.map((slot) => {
                    const creneau = `${day} ${slot.time} - ${slot.type}`;
                    return (
                      <TransitionLink
                        key={slot.time}
                        href={`/contact?creneau=${encodeURIComponent(creneau)}`}
                        className="flex items-center justify-between bg-white/5 active:bg-white/15 rounded-lg px-4 py-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 font-body text-sm text-gray-300">
                          <span className="text-primary font-bold min-w-[3rem]">{slot.time}</span>
                          <span>{slot.type}</span>
                        </div>
                        <span className="text-[11px] uppercase tracking-widest text-primary shrink-0">
                          Réserver →
                        </span>
                      </TransitionLink>
                    );
                  })}
                </div>
              </div>

              {/* --- DESKTOP : grille 3 colonnes --- */}
              <div className="hidden md:grid md:grid-cols-3 group">
                {/* Colonne Jour */}
                <div className="col-span-1">
                  <span className="font-display text-4xl text-gray-500 group-hover:text-primary transition-colors">{day}</span>
                </div>

                {/* Colonne Matin */}
                <div className="col-span-1 flex flex-col gap-1 font-body text-sm text-gray-300">
                  {morning.map((slot) => {
                    const creneau = `${day} ${slot.time} - ${slot.type}`;
                    return (
                      <TransitionLink
                        key={slot.time}
                        href={`/contact?creneau=${encodeURIComponent(creneau)}`}
                        className="flex items-center gap-3 px-3 py-2 -mx-3 rounded cursor-pointer hover:bg-white/10 transition-all group/slot"
                      >
                        <span className="text-primary font-bold">{slot.time}</span>
                        <span>{slot.type}</span>
                        <span className="ml-auto text-[11px] uppercase tracking-widest text-primary opacity-0 group-hover/slot:opacity-100 transition-opacity">
                          Réserver →
                        </span>
                      </TransitionLink>
                    );
                  })}
                </div>

                {/* Colonne Soir */}
                <div className="col-span-1 flex flex-col gap-1 font-body text-sm text-gray-300">
                  {evening.map((slot) => {
                    const creneau = `${day} ${slot.time} - ${slot.type}`;
                    return (
                      <TransitionLink
                        key={slot.time}
                        href={`/contact?creneau=${encodeURIComponent(creneau)}`}
                        className="flex items-center gap-3 px-3 py-2 -mx-3 rounded cursor-pointer hover:bg-white/10 transition-all group/slot"
                      >
                        <span className="text-primary font-bold">{slot.time}</span>
                        <span>{slot.type}</span>
                        <span className="ml-auto text-[11px] uppercase tracking-widest text-primary opacity-0 group-hover/slot:opacity-100 transition-opacity">
                          Réserver →
                        </span>
                      </TransitionLink>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* SECTION ACCÈS LIBRE */}
      <div ref={badgeSectionRef} className="mt-24 pt-12 border-t border-white/20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">

          {/* Badge 3D */}
          <div className="w-full md:w-1/2 shrink-0">
            <AccessBadge3D />
          </div>

          {/* Texte */}
          <div className="w-full md:w-1/2">
            <p className="font-display text-lg text-gray-500 tracking-widest mb-1">EN DEHORS DES COURS</p>
            <h2 className="font-display text-5xl md:text-6xl text-primary mb-6">ACCÈS LIBRE</h2>
            <p className="font-body text-gray-400 text-lg leading-relaxed mb-8">
              Pas de cours à votre horaire ? Avec votre badge, accédez à la Box{" "}
              <span className="text-white font-bold">7j/7 de 6h à 22h</span>.
              Entraînez-vous en autonomie, suivez votre propre programme ou rattrapez un WOD manqué.
            </p>

            {/* Badges icônes */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                <Lock className="w-4 h-4 text-primary" />
                <span className="font-body text-sm text-gray-300">Accès Sécurisé</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                <Dumbbell className="w-4 h-4 text-primary" />
                <span className="font-body text-sm text-gray-300">Équipement Complet</span>
              </div>
            </div>

            {/* Bouton */}
            <TransitionLink
              href="/tarifs"
              className="inline-block bg-primary text-white font-display text-lg px-10 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              Voir les abonnements
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* CTA CONTACT */}
      <div className="mt-24 pt-12 border-t border-white/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
         <div>
           <h2 className="font-display text-4xl mb-2">UNE QUESTION ?</h2>
           <p className="font-body text-gray-500">Premier cours d&apos;essai, horaires, niveau requis... on répond à tout.</p>
         </div>
         <TransitionLink
           href="/contact"
           className="inline-block bg-primary text-white font-display text-xl px-12 py-5 uppercase tracking-wider hover:bg-white hover:text-black transition-colors text-center shrink-0"
         >
           Nous contacter
         </TransitionLink>
      </div>

    </main>
  );
}
