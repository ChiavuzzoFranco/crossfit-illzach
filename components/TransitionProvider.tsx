'use client';
import React, { useState, useEffect, useContext, createContext, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useRouter, usePathname } from 'next/navigation';

const TransitionContext = createContext({
  animatePageOut: (href: string) => {},
});

export const useTransition = () => useContext(TransitionContext);

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // On utilise des Refs pour cibler directement les éléments (plus fiable que les classes)
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);

  // 0. INITIALISATION (Avant que l'utilisateur ne voie quoi que ce soit)
  useLayoutEffect(() => {
    // On place IMMÉDIATEMENT les colonnes en bas de l'écran (hors champ)
    const columns = [col1Ref.current, col2Ref.current, col3Ref.current];
    gsap.set(columns, { yPercent: 100 }); 
  }, []);

  // 1. ANIMATION D'ENTRÉE (Nouvelle page chargée -> On lève le rideau)
  useLayoutEffect(() => {
    const columns = [col1Ref.current, col2Ref.current, col3Ref.current];
    
    // On s'assure qu'elles sont en position "Couverture" (0%) avant de les lever
    gsap.set(columns, { yPercent: 0 });

    // On lève vers le haut (-100%)
    gsap.to(columns, {
      yPercent: -100,
      duration: 0.8,
      stagger: 0.1,
      ease: "power4.inOut",
      delay: 0.1,
      onComplete: () => {
        // Reset discret en bas pour la prochaine fois
        gsap.set(columns, { yPercent: 100 });
        setIsTransitioning(false);
      }
    });
  }, [pathname]);

  // 2. ANIMATION DE SORTIE (Clic -> On baisse le rideau)
  const animatePageOut = (href: string) => {
    if (isTransitioning) return;
    if (href === pathname) return;
    
    setIsTransitioning(true);
    const columns = [col1Ref.current, col2Ref.current, col3Ref.current];

    // On fait monter du bas (100%) vers le centre (0%)
    gsap.fromTo(columns, 
      { yPercent: 100 }, // Force le départ en bas
      {
        yPercent: 0,     // Arrivée au centre
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.inOut",
        onComplete: () => {
          router.push(href); // Changement de page
        }
      }
    );
  };

  return (
    <TransitionContext.Provider value={{ animatePageOut }}>
      
      {/* CONTAINER DES COLONNES 
         J'ai mis 'bg-red-500' pour le DEBUG. 
         Si vous voyez du rouge, c'est que ça marche !
      */}
      <div className="fixed inset-0 z-[99999] flex pointer-events-none h-screen w-screen top-0 left-0">
        
        <div ref={col1Ref} className="w-1/3 h-full bg-red-600 border-r border-white/10 relative">
           <div className="absolute bottom-10 left-10 text-white font-display text-4xl hidden md:block">01</div>
        </div>
        
        <div ref={col2Ref} className="w-1/3 h-full bg-red-600 border-r border-white/10 relative">
           <div className="absolute bottom-10 left-10 text-white font-display text-4xl hidden md:block">02</div>
        </div>
        
        <div ref={col3Ref} className="w-1/3 h-full bg-red-600 relative">
           <div className="absolute bottom-10 left-10 text-white font-display text-4xl hidden md:block">03</div>
        </div>

      </div>

      {children}
    </TransitionContext.Provider>
  );
}