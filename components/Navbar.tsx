'use client';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { goTo } from './story/visitor';

// Index des chapitres de la story
const CHAPTERS = [
  { name: 'La jungle', id: 'jungle' },
  { name: 'La tribu', id: 'la-tribu' },
  { name: 'La séance', id: 'la-seance' },
  { name: 'Pour tous', id: 'pour-tous' },
  { name: 'Formats', id: 'formats' },
  { name: 'Planning', id: 'planning' },
  { name: 'Tarifs', id: 'tarifs' },
  { name: 'Séance d’essai', id: 'essai' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    gsap.set(menuRef.current, { yPercent: -100 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.timeline()
        .to(menuRef.current, { yPercent: 0, duration: 0.8, ease: 'power4.inOut' })
        .fromTo('.menu-link', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power2.out' }, '-=0.4');
      window.__lenis?.stop();
    } else {
      gsap.to(menuRef.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' });
      window.__lenis?.start();
    }
  }, [isOpen]);

  // Va au chapitre (sur l'accueil) ou revient à l'accueil sur le bon chapitre
  const go = (id: string) => {
    setIsOpen(false);
    if (pathname === '/') window.setTimeout(() => goTo(id), 350);
    else router.push(`/#${id}`);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-4 md:p-6 z-[10000] flex justify-between items-center text-white">
        <button type="button" onClick={() => go('jungle')} className="font-display text-2xl tracking-widest uppercase mix-blend-difference hover:scale-105 transition-transform">
          Illzach
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => go('essai')}
            className="bg-primary text-white px-3 md:px-4 py-2 text-[11px] md:text-xs font-display uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Séance d’essai
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className="border border-white px-3 md:px-4 py-2 text-[11px] md:text-xs uppercase tracking-widest bg-black/30 backdrop-blur-sm hover:bg-white hover:text-black transition-colors relative z-[10001]"
          >
            {isOpen ? 'Fermer' : 'Menu'}
          </button>
        </div>
      </nav>

      <div ref={menuRef} className="fixed inset-0 w-screen h-[100svh] bg-bg z-[9995] flex flex-col justify-center px-6 md:px-16" style={{ willChange: 'transform' }}>
        <ol className="grid md:grid-cols-2 gap-x-16 gap-y-2 md:gap-y-4 max-w-5xl">
          {CHAPTERS.map((c, i) => (
            <li key={c.id} className="menu-link">
              <button type="button" onClick={() => go(c.id)} className="group flex items-baseline gap-4 text-left">
                <span className="font-body text-xs text-gray-500 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className={`font-display uppercase text-4xl md:text-6xl transition-colors group-hover:text-primary ${c.id === 'essai' ? 'text-primary' : 'text-white'}`}>
                  {c.name}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="menu-link absolute bottom-8 left-6 md:left-16 right-6 flex flex-col md:flex-row md:justify-between gap-2 font-body text-xs text-gray-500 uppercase tracking-widest">
          <span>4 Rue de Lisbonne, 68110 Illzach · 06 45 63 43 98</span>
          <a href="https://www.instagram.com/crossfitillzach/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Instagram ↗</a>
        </div>
      </div>
    </>
  );
}
