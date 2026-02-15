'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let gsap: any;

    (async () => {
      const mod = await import('gsap');
      gsap = mod.default;

      const moveCursor = (e: MouseEvent) => {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
      };

      window.addEventListener('mousemove', moveCursor);

      const targets = document.querySelectorAll('a, button, .interactive');

      const handleEnter = () => {
        gsap.to(cursorRef.current, { scale: 0, duration: 0.2 });
        gsap.to(followerRef.current, { scale: 3, backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "rgba(255, 255, 255, 0)", duration: 0.3 });
      };

      const handleLeave = () => {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
        gsap.to(followerRef.current, { scale: 1, backgroundColor: "transparent", borderColor: "rgba(255, 255, 255, 0.5)", duration: 0.3 });
      };

      targets.forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });

      // Cleanup stored for later
      (window as any).__cursorCleanup = () => {
        window.removeEventListener('mousemove', moveCursor);
        targets.forEach(el => {
          el.removeEventListener('mouseenter', handleEnter);
          el.removeEventListener('mouseleave', handleLeave);
        });
      };
    })();

    return () => {
      if ((window as any).__cursorCleanup) {
        (window as any).__cursorCleanup();
        delete (window as any).__cursorCleanup;
      }
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999999] -translate-x-1/2 -translate-y-1/2 hidden md:block" />
      <div ref={followerRef} className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9999998] -translate-x-1/2 -translate-y-1/2 hidden md:block" style={{ willChange: 'transform' }} />
    </>
  );
}
