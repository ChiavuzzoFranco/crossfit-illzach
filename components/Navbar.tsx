'use client';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import clsx from 'clsx';
import TransitionLink from './TransitionLink'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Le Concept', href: '/concept' },
    { name: 'Planning', href: '/planning' },
    { name: 'L\'Espace', href: '/wods' },
    { name: 'Contact', href: '/contact' },
  ];

  // 1. Initialisation (On place le menu hors de l'écran au chargement)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // On le place à -100% (en haut, caché) immédiatement
      gsap.set(menuRef.current, { yPercent: -100 });
    });
    return () => ctx.revert();
  }, []);

  // 2. Animation Ouverture / Fermeture
  useEffect(() => {
    if (isOpen) {
      // OUVERTURE
      const tl = gsap.timeline();
      
      // Le panneau descend
      tl.to(menuRef.current, {
        yPercent: 0,
        duration: 0.8,
        ease: "power4.inOut",
      })
      // Les liens apparaissent après
      .fromTo(".mobile-link", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );

      // Bloquer le scroll du site
      document.body.style.overflow = 'hidden';

    } else {
      // FERMETURE
      gsap.to(menuRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });

      // Réactiver le scroll
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Fermer le menu automatiquement si on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* === NAVBAR FIXE (Toujours visible) === */}
      {/* mix-blend-difference permet au texte d'être visible sur fond blanc ou noir */}
      <nav className="fixed top-0 left-0 w-full p-6 z-[10000] flex justify-between items-center mix-blend-difference text-white">
        
        {/* LOGO */}
        <TransitionLink href="/" className="font-display text-2xl tracking-widest uppercase hover:scale-105 transition-transform interactive">
          Illzach
        </TransitionLink>
        
        {/* MENU DESKTOP (Caché sur mobile) */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => (
            <TransitionLink 
              key={link.href} 
              href={link.href}
              className={clsx(
                "font-body text-xs uppercase font-bold tracking-widest hover:text-primary transition-colors interactive relative group",
                pathname === link.href && "text-primary"
              )}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </TransitionLink>
          ))}
        </div>

        {/* BOUTON HAMBURGER (Visible uniquement sur mobile) */}
        {/* Z-Index très élevé pour rester cliquable même quand le menu est ouvert */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden border border-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors interactive relative z-[10001]"
        >
          {isOpen ? "Fermer" : "Menu"}
        </button>
      </nav>

      {/* === OVERLAY MOBILE (Le panneau qui descend) === */}
      <div 
        ref={menuRef}
        className="fixed inset-0 w-screen h-screen bg-[#0a0a0a] z-[9995] flex flex-col items-center justify-center"
        style={{ willChange: 'transform' }} // Optimisation performance
      >
        <div className="flex flex-col gap-8 text-center">
          {links.map((link) => (
            <TransitionLink 
              key={link.href}
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className="mobile-link font-display text-4xl text-white hover:text-primary transition-colors interactive"
            >
              {link.name}
            </TransitionLink>
          ))}
        </div>

        <div className="absolute bottom-10 mobile-link opacity-0">
          <p className="font-body text-xs text-gray-500 uppercase tracking-widest">CrossFit Illzach © 2026</p>
        </div>
      </div>
    </>
  );
}