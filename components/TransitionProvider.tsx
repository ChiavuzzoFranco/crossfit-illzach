'use client';
import React, { useState, useContext, createContext, useRef, useLayoutEffect } from 'react';
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

  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);

  // 0. INITIALISATION
  useLayoutEffect(() => {
    const columns = [col1Ref.current, col2Ref.current, col3Ref.current];
    gsap.set(columns, { yPercent: 100 });
  }, []);

  // 1. ANIMATION D'ENTRÉE
  useLayoutEffect(() => {
    const columns = [col1Ref.current, col2Ref.current, col3Ref.current];
    gsap.set(columns, { yPercent: 0 });
    gsap.to(columns, {
      yPercent: -100,
      duration: 0.8,
      stagger: 0.1,
      ease: "power4.inOut",
      delay: 0.1,
      onComplete: () => {
        gsap.set(columns, { yPercent: 100 });
        setIsTransitioning(false);
      }
    });
  }, [pathname]);

  // 2. ANIMATION DE SORTIE
  const animatePageOut = (href: string) => {
    if (isTransitioning) return;
    if (href === pathname) return;

    setIsTransitioning(true);
    const columns = [col1Ref.current, col2Ref.current, col3Ref.current];

    gsap.fromTo(columns,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.inOut",
        onComplete: () => { router.push(href); }
      }
    );
  };

  return (
    <TransitionContext.Provider value={{ animatePageOut }}>
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
