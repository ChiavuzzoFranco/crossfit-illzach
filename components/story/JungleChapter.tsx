'use client';
import { forwardRef, useEffect, useRef } from 'react';
import Reveal from './Reveal';

// Les « bonjours » de la tribu — x / y : desktop ; xm / ym : mobile
const GREETINGS: { text: string; x: string; y: string; xm: string; ym: string; w: [number, number]; coach?: boolean }[] = [
  { text: 'Salut !', x: '12%', y: '30%', xm: '8%', ym: '22%', w: [0.74, 1.02] },
  { text: 'Bienvenue !', x: '70%', y: '22%', xm: '50%', ym: '15%', w: [0.77, 1.02] },
  { text: 'Hey, c’est ta première fois ?', x: '60%', y: '64%', xm: '12%', ym: '66%', w: [0.8, 1.02] },
  { text: 'Moi c’est Nat, bienvenue !', x: '8%', y: '60%', xm: '6%', ym: '50%', w: [0.83, 1.02], coach: true },
  { text: 'Ça va ?', x: '42%', y: '14%', xm: '62%', ym: '29%', w: [0.86, 1.02] },
  { text: 'Viens, on t’attendait.', x: '30%', y: '78%', xm: '20%', ym: '79%', w: [0.89, 1.02] },
  { text: 'Installe-toi !', x: '78%', y: '44%', xm: '46%', ym: '42%', w: [0.92, 1.02] },
];

const JungleChapter = forwardRef<HTMLElement>(function JungleChapter(_, ref) {
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      if (timeRef.current) timeRef.current.textContent = `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} id="jungle" data-ch="jungle" className="relative z-10 h-[360svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden pointer-events-none">
        {/* 1. Le mur de feuillage */}
        <Reveal w={[-1, 0.18]} className="absolute inset-x-0 bottom-0 px-4 md:px-12 pb-12 md:pb-16">
          <div className="absolute inset-0 -top-40 bg-gradient-to-t from-bg via-bg/80 to-transparent -z-10" />
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gray-400 mb-3">
            CrossFit Illzach · Il est <span ref={timeRef}>18h12</span>
          </p>
          <h1 className="font-display uppercase text-white text-[17vw] md:text-[10vw] leading-[0.85]">
            Première fois<span className="text-primary"> ?</span>
          </h1>
          <p className="font-body text-gray-300 text-base md:text-lg mt-5 max-w-md leading-relaxed">
            Tu hésites un peu. C’est normal : tout le monde a hésité. Avance, on écarte les feuilles pour toi.
          </p>
          <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gray-400">
            <span className="block w-10 h-px bg-primary" /> Scrolle pour entrer
          </div>
        </Reveal>

        {/* 2. Avance */}
        <Reveal w={[0.2, 0.44]} className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <p className="font-display uppercase text-white text-[22vw] md:text-[13vw] leading-none [text-shadow:0_6px_40px_rgba(0,0,0,0.8)]">
            Avance<span className="text-primary">.</span>
          </p>
        </Reveal>

        {/* 3. La tribu */}
        <Reveal w={[0.5, 0.74]} className="absolute inset-x-0 bottom-0 px-4 md:px-12 pb-12 md:pb-16 text-center">
          <div className="absolute inset-x-0 bottom-0 h-[160%] bg-gradient-to-t from-bg via-bg/80 to-transparent -z-10" />
          <p className="font-brush text-primary text-4xl md:text-6xl -rotate-3 mb-1">Bienvenue dans</p>
          <p className="font-display uppercase text-white text-[20vw] md:text-[11vw] leading-[0.85] [text-shadow:0_6px_40px_rgba(0,0,0,0.8)]">
            La tribu.
          </p>
        </Reveal>

        {/* 4. Les bonjours */}
        {GREETINGS.map((g) => (
          <Reveal
            key={g.text}
            w={g.w}
            className="absolute left-[var(--xm)] top-[var(--ym)] md:left-[var(--x)] md:top-[var(--y)]"
            style={{ '--x': g.x, '--y': g.y, '--xm': g.xm, '--ym': g.ym } as React.CSSProperties}
          >
            <span
              className={`inline-block px-4 py-2 md:px-5 md:py-2.5 font-display uppercase tracking-wide text-lg md:text-2xl whitespace-nowrap -skew-x-6 shadow-[6px_6px_0_rgba(0,0,0,0.6)] ${
                g.coach ? 'bg-primary text-white' : 'bg-white text-bg'
              }`}
            >
              {g.text}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
});

export default JungleChapter;
