'use client';
import { forwardRef } from 'react';
import Reveal from './Reveal';
import { useVisitor } from './visitor';

// Encouragements qui fusent autour du dernier — x / y : desktop ; xm / ym : mobile
const CHEERS: { text: string; x: string; y: string; xm: string; ym: string; w: [number, number]; rot: number; red?: boolean }[] = [
  { text: 'Allez !', x: '10%', y: '22%', xm: '6%', ym: '18%', w: [0.38, 0.68], rot: -6 },
  { text: 'Lâche rien !', x: '66%', y: '18%', xm: '44%', ym: '13%', w: [0.4, 0.68], rot: 4, red: true },
  { text: 'T’y es presque !', x: '58%', y: '58%', xm: '30%', ym: '58%', w: [0.43, 0.68], rot: -3 },
  { text: 'Encore 3 !', x: '16%', y: '62%', xm: '8%', ym: '46%', w: [0.46, 0.68], rot: 5 },
  { text: 'Allez allez allez !', x: '34%', y: '12%', xm: '18%', ym: '30%', w: [0.49, 0.68], rot: -2, red: true },
  { text: 'Respire, t’es bien !', x: '72%', y: '40%', xm: '34%', ym: '70%', w: [0.52, 0.68], rot: 3 },
];

const LastChapter = forwardRef<HTMLElement>(function LastChapter(_, ref) {
  const { name } = useVisitor();
  const you = name ? name.toUpperCase() : null;
  return (
    <section ref={ref} id="le-dernier" data-ch="last" className="relative z-10 h-[460svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden pointer-events-none">
        {/* 1. 19:24 */}
        <Reveal w={[0.0, 0.2]} className="absolute left-4 right-4 bottom-10 md:left-12 md:right-auto md:bottom-14 md:max-w-2xl">
          <div className="absolute -inset-x-16 -inset-y-14 bg-[radial-gradient(closest-side,rgba(8,8,8,0.88),rgba(8,8,8,0.5)_60%,transparent)] -z-10" />
          <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-1">19:24</p>
          <p className="font-display uppercase text-white text-5xl md:text-7xl leading-[0.9] mb-3">Tout le monde a fini.</p>
          <p className="font-body text-gray-300 text-base md:text-lg">Sauf une personne. Le chrono tourne encore pour elle.</p>
        </Reveal>

        {/* 2. Personne ne range son matos */}
        <Reveal w={[0.2, 0.38]} className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[200%] bg-[radial-gradient(closest-side,rgba(8,8,8,0.9),rgba(8,8,8,0.55)_55%,transparent)] -z-10" />
            <p className="font-display uppercase text-white text-5xl md:text-[7vw] leading-[0.88]">
              Alors personne<br />ne range son <span className="text-primary">matos.</span>
            </p>
          </div>
        </Reveal>

        {/* 3. Les encouragements */}
        {CHEERS.map((c) => (
          <Reveal
            key={c.text}
            w={c.w}
            className="absolute left-[var(--xm)] top-[var(--ym)] md:left-[var(--x)] md:top-[var(--y)]"
            style={{ '--x': c.x, '--y': c.y, '--xm': c.xm, '--ym': c.ym } as React.CSSProperties}
          >
            <span
              className={`inline-block px-4 py-2 md:px-6 md:py-3 font-display uppercase tracking-wide text-2xl md:text-4xl whitespace-nowrap shadow-[6px_6px_0_rgba(0,0,0,0.6)] ${c.red ? 'bg-primary text-white' : 'bg-white text-bg'}`}
              style={{ transform: `rotate(${c.rot}deg) skewX(-6deg)` }}
            >
              {c.text}
            </span>
          </Reveal>
        ))}

        {/* 4. Un jour, ce sera toi */}
        <Reveal w={[0.68, 0.86]} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[200%] bg-[radial-gradient(closest-side,rgba(8,8,8,0.9),rgba(8,8,8,0.55)_55%,transparent)] -z-10" />
            <p className="font-display uppercase text-white text-5xl md:text-[7vw] leading-[0.88] mb-5">Un jour, ce sera toi.</p>
            {you ? (
              <p className="inline-block bg-primary text-white font-display uppercase text-3xl md:text-5xl px-6 py-3 -rotate-2 shadow-[6px_6px_0_rgba(0,0,0,0.6)]">
                Allez {you} !
              </p>
            ) : (
              <p className="font-brush text-primary text-3xl md:text-5xl -rotate-2">Et toute la tribu sera là.</p>
            )}
          </div>
        </Reveal>

        {/* 5. La phrase de la box */}
        <Reveal w={[0.86, 1.2]} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="relative max-w-5xl">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[180%] bg-[radial-gradient(closest-side,rgba(8,8,8,0.92),rgba(8,8,8,0.6)_55%,transparent)] -z-10" />
            <p className="font-brush text-primary text-2xl md:text-4xl -rotate-2 mb-3">Ici,</p>
            <p className="font-display uppercase text-white text-4xl md:text-[5.5vw] leading-[0.92]">
              Celui qui finit en dernier reçoit le plus <span className="text-primary">d’encouragements.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
});

export default LastChapter;
