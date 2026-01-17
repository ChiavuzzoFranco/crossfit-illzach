'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null); // Le point rouge
  const followerRef = useRef<HTMLDivElement>(null); // Le cercle blanc

  useEffect(() => {
    // 1. Désactivé sur mobile/tablette
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Pour l'optimisation, on utilise xSet et ySet (plus rapide que .to)
    const moveCursor = (e: MouseEvent) => {
      // Le point rouge suit exactement la souris
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0, // Instantané
      });

      // Le cercle blanc suit avec un délai (effet de fluide)
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15, // Le "lag" qui donne l'effet smooth
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // 2. Gestion du survol (Hover)
    const targets = document.querySelectorAll('a, button, .interactive');
    
    const handleEnter = () => {
      // Le point rouge disparaît (optionnel, ou il reste petit)
      gsap.to(cursorRef.current, { scale: 0, duration: 0.2 });
      
      // Le cercle blanc grandit un peu et devient un peu plus transparent
      gsap.to(followerRef.current, { 
        scale: 3, // Agrandissement
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Fond léger
        borderColor: "rgba(255, 255, 255, 0)", // Bordure disparait
        duration: 0.3
      });
    };
    
    const handleLeave = () => {
      // Retour à la normale
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
      
      gsap.to(followerRef.current, { 
        scale: 1, 
        backgroundColor: "transparent",
        borderColor: "rgba(255, 255, 255, 0.5)",
        duration: 0.3 
      });
    };

    targets.forEach(el => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      targets.forEach(el => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <>
      {/* 1. LE POINT ROUGE CENTRAL (Le viseur) */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />

      {/* 2. LE CERCLE BLANC (Le suiveur) */}
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9999998] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}