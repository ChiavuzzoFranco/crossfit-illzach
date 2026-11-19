'use client';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import TransitionLink from './TransitionLink';
import JungleLeaves from './jungle/JungleLeaves';
import { Sticker, Splash } from './jungle/ui';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const links = [
   { name: 'ACCUEIL', href: '/' },
  // { name: 'LA BOX', href: '/concept' },
  // { name: 'ACTIVITÉS', href: '/activites' },
  { name: 'PLANNING', href: '/planning' },
  { name: 'HYROX / ATHX', href: '/hybrid' },
  { name: 'TARIFS', href: '/tarifs' },
  { name: 'CONTACT', href: '/contact' },
  ];

  // Init: place menu off-screen
  useLayoutEffect(() => {
    gsap.set(menuRef.current, { yPercent: -100 });
  }, []);

  // Animation open/close
  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.to(menuRef.current, { yPercent: 0, duration: 0.8, ease: "power4.inOut" })
        .fromTo(".mobile-link",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
          "-=0.4"
        );
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(menuRef.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-4 md:p-6 z-[10000] flex justify-between items-center text-white">
        <TransitionLink href="/" className="font-display text-2xl tracking-widest uppercase hover:scale-105 transition-transform interactive [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          Illzach
        </TransitionLink>
        <div className="flex items-center gap-3">
          <TransitionLink href="/contact" className="interactive hidden sm:inline-block">
            <Sticker rot={-3} tone="red" className="px-3 py-1.5 text-xs md:text-sm">Séance d’essai</Sticker>
          </TransitionLink>
          <button onClick={() => setIsOpen(!isOpen)} className="interactive relative z-[10001]" aria-expanded={isOpen}>
            <Sticker rot={2} tone={isOpen ? 'red' : 'white'} className="px-3 py-1.5 text-xs md:text-sm">{isOpen ? 'Fermer' : 'Menu'}</Sticker>
          </button>
        </div>
      </nav>

      <div
        ref={menuRef}
        className="fixed inset-0 w-screen h-screen bg-[#0a0a0a] z-[9995] flex flex-col items-center justify-center overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        <JungleLeaves set="corners" />
        <Splash variant={3} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] text-blood/40" />
        <p className="mobile-link relative font-brush text-primary text-2xl md:text-3xl -rotate-3 mb-6 opacity-0">Où on va ?</p>
        <div className="relative flex flex-col gap-5 md:gap-6 text-center">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <TransitionLink
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`mobile-link font-display uppercase text-4xl md:text-6xl transition-colors interactive ${active ? 'text-primary' : 'text-white hover:text-primary'}`}
              >
                {link.name}
              </TransitionLink>
            );
          })}
        </div>

        <div className="absolute bottom-10 mobile-link opacity-0">
          <p className="font-body text-xs text-gray-500 uppercase tracking-widest">CrossFit Illzach © 2026</p>
        </div>
      </div>
    </>
  );
}
