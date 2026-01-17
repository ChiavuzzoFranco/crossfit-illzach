'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [counter, setCounter] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Animation du compteur (0 à 100)
    // On utilise un objet proxy pour animer la valeur numérique
    const progress = { value: 0 };
    
    tl.to(progress, {
      value: 100,
      duration: 2, // Durée du chargement (2 secondes)
      ease: "power2.inOut",
      onUpdate: () => {
        // On met à jour l'affichage en arrondissant
        setCounter(Math.round(progress.value));
      }
    });

    // 2. Disparition du Preloader (Rideau qui monte)
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
      delay: 0.2 // Petite pause à 100% avant de partir
    });
    
    // 3. Nettoyage (display: none pour ne plus gêner)
    tl.set(containerRef.current, { display: "none" });

  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 bg-bg z-[10000] flex flex-col items-center justify-center text-primary overflow-hidden"
    >
      {/* Le Compteur Géant */}
      <div className="relative overflow-hidden">
        <div className="font-display text-[25vw] leading-none tracking-tighter tabular-nums">
          {counter}%
        </div>
      </div>
      
      {/* Petite phrase stylée */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end">
        <div className="h-[2px] w-24 bg-white mb-2 animate-pulse"></div>
        <span className="font-body text-xs uppercase tracking-widest text-white">
          Loading Experience
        </span>
      </div>
    </div>
  );
}