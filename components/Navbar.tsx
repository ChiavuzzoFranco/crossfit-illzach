'use client';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import TransitionLink from './TransitionLink';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const links = [
   { name: 'ACCUEIL', href: '/' },
  // { name: 'LA BOX', href: '/concept' },
  // { name: 'ACTIVITÉS', href: '/activites' },
  { name: 'PLANNING', href: '/planning' },
  // { name: 'HYROX', href: '/hyrox' },  // Désactivé temporairement
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
      <nav className="fixed top-0 left-0 w-full p-6 z-[10000] flex justify-between items-center mix-blend-difference text-white">
        <TransitionLink href="/" className="font-display text-2xl tracking-widest uppercase hover:scale-105 transition-transform interactive">
          Illzach
        </TransitionLink>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border border-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors interactive relative z-[10001]"
        >
          {isOpen ? "Fermer" : "Menu"}
        </button>
      </nav>

      <div
        ref={menuRef}
        className="fixed inset-0 w-screen h-screen bg-[#0a0a0a] z-[9995] flex flex-col items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        <div className="flex flex-col gap-8 text-center">
          {links.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="mobile-link font-display text-4xl md:text-6xl text-white hover:text-primary transition-colors interactive"
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
