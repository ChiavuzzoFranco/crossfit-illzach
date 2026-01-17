'use client';
import { useEffect } from "react";
import gsap from "gsap";

export default function PlanningPage() {
  
  useEffect(() => {
    // Animation d'entrée des lignes
    gsap.fromTo(".planning-row", 
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  const days = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];

  return (
    <main className="min-h-screen bg-bg text-white pt-32 pb-20 px-4 md:px-12">
      
      <h1 className="font-display text-[12vw] leading-none text-white mb-12 reveal-text text-primary">PLANNING</h1>

      {/* LE TABLEAU (GRILLE) */}
      <div className="border-t border-white/20">
        
        {days.map((day) => (
          <div key={day} className="planning-row grid grid-cols-1 md:grid-cols-4 border-b border-white/20 py-8 hover:bg-white/5 transition-colors group">
            
            {/* Colonne Jour */}
            <div className="col-span-1 mb-4 md:mb-0">
              <span className="font-display text-4xl text-gray-500 group-hover:text-primary transition-colors">{day}</span>
            </div>
            
            {/* Colonne Matin */}
            <div className="col-span-1 flex flex-col gap-2 font-body text-sm text-gray-300">
              <div className="flex items-center gap-3"><span className="text-primary font-bold">07:00</span> WOD</div>
              <div className="flex items-center gap-3"><span className="text-primary font-bold">09:30</span> WOD</div>
              <div className="flex items-center gap-3"><span className="text-primary font-bold">12:15</span> WOD</div>
            </div>

            {/* Colonne Soir */}
            <div className="col-span-1 flex flex-col gap-2 font-body text-sm text-gray-300 mt-4 md:mt-0">
              <div className="flex items-center gap-3"><span className="text-primary font-bold">17:00</span> OPEN GYM</div>
              <div className="flex items-center gap-3"><span className="text-primary font-bold">18:00</span> WOD</div>
            </div>

            {/* Bouton Réserver */}
            <div className="col-span-1 flex items-center justify-end mt-4 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="border border-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-primary hover:border-primary hover:text-black transition-all">
                Réserver
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* SECTION CONTACT */}
      <div className="mt-24 pt-12 border-t border-white/20">
         <h2 className="font-display text-4xl mb-4">CONTACT</h2>
         <p className="font-body text-gray-400">info@crossfitillzach.com</p>
      </div>

    </main>
  );
}