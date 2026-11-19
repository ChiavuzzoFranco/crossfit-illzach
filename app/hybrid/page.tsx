'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import TransitionLink from '@/components/TransitionLink';
import JungleLeaves from '@/components/jungle/JungleLeaves';
import { Splash, Sticker, TORN } from '@/components/jungle/ui';
import { hybridStore, STATION_COUNT, RUN_PART, raceKm } from '@/components/hybrid/store';
import { SCHEDULE, DAYS } from '@/lib/schedule';

const HybridScene = dynamic(() => import('@/components/hybrid/HybridScene'), { ssr: false });

// --- DONNÉES -----------------------------------------------------------------
const STATIONS = [
  { id: '01', name: 'SKI ERG', dist: '1000 M', desc: "Le départ. Les bras chauffent, le souffle s'accélère. Premier test : gérer son allure dès le début." },
  { id: '02', name: 'SLED PUSH', dist: '50 M', desc: "Poussez. Fort. Le traîneau lesté ne pardonne rien : c'est là que la force brute fait la différence." },
  { id: '03', name: 'SLED PULL', dist: '50 M', desc: 'Le même traîneau, tiré main après main. Le dos et les bras en feu, mais on ne lâche rien.' },
  { id: '04', name: 'BURPEE BROAD JUMP', dist: '80 M', desc: "L'épreuve que tout le monde redoute. 80 mètres de burpees sautés. Le mental prend le dessus." },
  { id: '05', name: 'ROWING', dist: '1000 M', desc: '1000 m de rameur. Le piège : partir trop vite. La clé : rester lucide malgré la fatigue.' },
  { id: '06', name: 'FARMERS CARRY', dist: '200 M', desc: '200 m avec deux kettlebells. Le grip lâche, le gainage tient.' },
  { id: '07', name: 'SANDBAG LUNGES', dist: '100 M', desc: 'Fentes avec un sac lesté sur les épaules. Les jambes tremblent, chaque pas compte.' },
  { id: '08', name: 'WALL BALLS', dist: '75 / 100 REPS', desc: "Le final. Squat, lancer, précision. Jusqu'à la dernière rep, jusqu'à la ligne." },
];

const ZONES = [
  { id: '01', name: 'STRENGTH', kicker: 'Force maximale', desc: 'Une fenêtre chronométrée pour soulever lourd sur les grands mouvements de force (press, squat, deadlift selon la saison). Le score : la charge totale validée.' },
  { id: '02', name: 'ENDURANCE', kicker: 'Moteur', desc: "Course et rameur en alternance, avec un objectif simple : aller le plus loin possible. Ceux qui gèrent leur allure gagnent, pas ceux qui explosent." },
  { id: '03', name: 'METCON X', kicker: 'Le final', desc: 'Un WOD fonctionnel intense sous time cap, où force et cardio se rencontrent. Tout ce qui reste dans le réservoir.' },
];

const COMPARE = [
  { label: 'Format', hyrox: 'Course continue', athx: '6 zones, 3 tests notés' },
  { label: 'Structure', hyrox: '8 × 1 km run + 1 station', athx: 'Strength · Endurance · MetCon X' },
  { label: 'Durée', hyrox: '≈ 1h à 1h30', athx: '≈ 2h30 sur place' },
  { label: 'Score', hyrox: 'Un seul chrono', athx: 'Points par zone' },
  { label: 'Niveaux', hyrox: 'Open · Pro', athx: 'Lite · ATHX · Pro' },
  { label: 'Formats', hyrox: 'Solo · Doubles · Relay', athx: 'Individuel · Pairs' },
  { label: "L'athlète", hyrox: 'Moteur, mental, régularité', athx: 'Complet : force et cardio' },
];

const LEVELS = {
  hyrox: [
    { name: 'OPEN', tag: 'Débutant → confirmé', desc: 'Charges standards : la catégorie de la grande majorité des participants, idéale pour une première course.' },
    { name: 'PRO', tag: 'Avancé', desc: 'Même parcours, charges nettement plus lourdes sur les sleds et les wall balls.' },
    { name: 'DOUBLES · RELAY', tag: 'À plusieurs', desc: "À 2 ou à 4, on partage les stations. La meilleure porte d'entrée pour découvrir le format." },
    { name: 'ADAPTIVE', tag: 'Inclusif', desc: 'Des catégories dédiées aux athlètes en situation de handicap, avec standards adaptés.' },
  ],
  athx: [
    { name: 'LITE', tag: 'Première compétition', desc: 'Charges et volumes réduits, mouvements simplifiés. Pensé pour découvrir le format sans pression.' },
    { name: 'ATHX', tag: 'Intermédiaire', desc: "L'étape suivante : plus de charge, plus de volume, mêmes zones." },
    { name: 'PRO', tag: 'Avancé', desc: 'Le niveau le plus exigeant, charges lourdes et standards stricts.' },
  ],
};

const INTRO = [
  {
    name: 'HYROX',
    tagline: 'La course fitness mondiale',
    desc: "8 fois de suite : 1 km de course, puis un atelier (SkiErg, traîneau, rameur, wall balls…). Tout s'enchaîne sans pause, avec un seul chrono du départ à l'arrivée.",
    stats: [['8 KM', 'de course'], ['8', 'ateliers'], ['1', 'chrono']],
    accent: false,
  },
  {
    name: 'ATHX',
    tagline: "Le test de l'athlète complet",
    desc: 'Une compétition découpée en zones : force maximale, endurance, puis un MetCon final, avec des temps de récupération entre chaque. Chaque zone est notée, le classement se fait aux points.',
    stats: [['3', 'zones notées'], ['≈ 2H30', 'sur place'], ['PTS', 'au classement']],
    accent: true,
  },
] as const;

// --- UTILS -------------------------------------------------------------------
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sectionProgress = (el: HTMLElement | null) => {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const total = r.height - window.innerHeight;
  return total <= 0 ? 0 : clamp(-r.top / total);
};

function Scramble({ text, className = '' }: { text: string; className?: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let it = 0;
    const id = setInterval(() => {
      setOut(text.split('').map((c, i) => (c === ' ' || i < it ? c : chars[Math.floor(Math.random() * chars.length)])).join(''));
      if (it >= text.length) clearInterval(id);
      it += 1 / 2;
    }, 28);
    return () => clearInterval(id);
  }, [text]);
  return <span className={className}>{out}</span>;
}

// --- PAGE --------------------------------------------------------------------
export default function HybridPage() {
  const heroRef = useRef<HTMLElement>(null);
  const raceRef = useRef<HTMLElement>(null);
  const athxRef = useRef<HTMLElement>(null);
  const heroText = useRef<HTMLDivElement>(null);
  const kmRef = useRef<HTMLSpanElement>(null);
  const chronoRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const zoneBarRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<{ kind: 'run' | 'station'; i: number }>({ kind: 'run', i: 0 });
  const [zone, setZone] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal-on-scroll');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.2 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    let lastStep = '';
    let lastZone = -1;
    let lastActive = true;

    const onMouse = (e: PointerEvent) => {
      hybridStore.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      hybridStore.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMouse, { passive: true });

    const loop = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const dy = y - lastY;
      lastY = y;
      hybridStore.velocity += (clamp(dy / 60, -1, 1) - hybridStore.velocity) * 0.12;

      // Descente de la caméra sur la piste pendant le dernier écran avant la course
      const raceTop = raceRef.current ? raceRef.current.getBoundingClientRect().top : vh;
      hybridStore.hero = clamp(1 - raceTop / vh);
      hybridStore.race = sectionProgress(raceRef.current);
      hybridStore.athx = sectionProgress(athxRef.current);

      // Hero : le titre s'efface en montant
      if (heroText.current) {
        const h = clamp(y / vh);
        heroText.current.style.opacity = String(1 - clamp(h * 1.6));
        heroText.current.style.transform = `translate3d(0, ${-h * 120}px, 0)`;
      }

      // HUD course
      const u = hybridStore.race;
      if (kmRef.current) kmRef.current.textContent = raceKm(u).toFixed(2);
      if (chronoRef.current) {
        const secs = Math.floor(u * 78 * 60);
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        chronoRef.current.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${u})`;
      if (zoneBarRef.current) zoneBarRef.current.style.transform = `scaleY(${hybridStore.athx})`;

      // Étape courante : course à pied ou station
      const i = Math.min(STATION_COUNT - 1, Math.floor(u * STATION_COUNT));
      const local = u * STATION_COUNT - i;
      const atStation = u >= 1 || local >= RUN_PART;
      const key = `${atStation ? 'station' : 'run'}-${i}`;
      if (key !== lastStep) {
        lastStep = key;
        setStep({ kind: atStation ? 'station' : 'run', i });
      }

      const a = hybridStore.athx;
      const z = Math.min(2, Math.floor(clamp((a - 0.04) / 0.96) * 3));
      if (z !== lastZone) { lastZone = z; setZone(z); }

      // La 3D s'arrête quand on a dépassé la section ATHX
      const athxRect = athxRef.current?.getBoundingClientRect();
      // la 3D s'efface dès la fin des monolithes (fondu, pas de coupure)
      const isActive = !athxRect || athxRect.bottom > vh * 0.55;
      if (isActive !== lastActive) { lastActive = isActive; setActive(isActive); }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMouse); };
  }, []);

  const hybridSlots = DAYS.flatMap((day) =>
    SCHEDULE[day].filter((s) => /HYROX|ATHX/i.test(s.type)).map((s) => ({ day, ...s })),
  );

  const st = STATIONS[step.i];

  return (
    <main className="relative bg-bg text-white selection:bg-primary selection:text-white">
      {/* --- SCÈNE 3D FIXE --- */}
      <div
        className="fixed inset-0 z-0 transition-opacity duration-700"
        style={{ opacity: active ? 1 : 0 }}
        aria-hidden
      >
        <HybridScene active={active} />
      </div>

      {/* --- HERO --- */}
      <section ref={heroRef} className="relative z-10 h-[100svh] pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-bg via-bg/70 to-transparent md:from-bg/60 md:via-bg/20" />
        <div ref={heroText} className="absolute inset-x-0 bottom-0 px-4 md:px-12 pb-10 md:pb-14 will-change-transform">
          <p className="font-brush text-primary text-2xl md:text-4xl -rotate-2 mb-2 md:mb-3">
            Entraînement hybride · CrossFit Illzach
          </p>
          <h1 className="font-display uppercase leading-[0.82] text-[22vw] md:text-[15vw]">
            <span className="block text-white">Hyrox</span>
            <span className="flex items-center gap-[0.12em]">
              <span className="font-body font-light text-primary text-[0.32em] leading-none">×</span>
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #FF2E00' }}>Athx</span>
            </span>
          </h1>
          <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <p className="font-body text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
              Deux formats de compétition, une même exigence : être complet. Accessibles à tous les niveaux, on vous prépare aux deux, sur place, avec un programme structuré.
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gray-400">
              <span className="block w-10 h-px bg-primary" /> Scrollez pour découvrir
            </div>
          </div>
        </div>
      </section>

      {/* --- INTRO : C'EST QUOI ? --- */}
      <section className="relative z-10 min-h-[100svh] flex items-center px-4 md:px-12 py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/90 to-bg/40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto w-full">
          <p className="reveal-on-scroll font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-4">Deux formats, une box</p>
          <h2 className="reveal-on-scroll font-display uppercase text-5xl md:text-7xl leading-[0.9] mb-12 md:mb-16">
            C&apos;est quoi <span className="text-primary">?</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-16">
            {INTRO.map((f, fi) => (
              <article key={f.name} className="reveal-on-scroll relative isolate p-8 md:p-12 flex flex-col">
                <Splash variant={fi + 3} className={`absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] ${f.accent ? 'text-primary/85' : 'text-blood/85'} -z-10 drop-shadow-[8px_10px_0_rgba(0,0,0,0.55)]`} style={{ transform: `rotate(${fi ? 3 : -3}deg)` }} />
                <div className="flex items-baseline justify-between gap-4 mb-5">
                  <h3 className="font-display text-4xl md:text-5xl text-white">{f.name}</h3>
                  <Sticker rot={fi ? 3 : -3} tone="black" className="px-2.5 py-1 text-[11px] text-right">{f.tagline}</Sticker>
                </div>
                <p className="font-body text-white leading-relaxed mb-8 flex-1">{f.desc}</p>
                <div className="grid grid-cols-3 border-t border-white/30 pt-5">
                  {f.stats.map(([v, l]) => (
                    <div key={l}>
                      <p className="font-display text-2xl md:text-3xl leading-none mb-1">{v}</p>
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/75">{l}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="reveal-on-scroll mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="font-body text-sm text-gray-400 max-w-xl">
              <span className="text-white">Accessible à tous :</span> chaque format a ses catégories, de la découverte au niveau Pro.
            </p>
            <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gray-400">
              <span className="block w-10 h-px bg-primary" /> On fait la course ensemble
            </p>
          </div>
        </div>
      </section>

      {/* --- LA COURSE (HYROX) --- */}
      <section ref={raceRef} className="relative z-10 h-[900svh]">
        <div className="sticky top-0 h-[100svh] pointer-events-none">
          {/* HUD haut */}
          <div className="absolute top-24 md:top-28 inset-x-0 px-4 md:px-12 flex justify-between items-start font-display">
            <div>
              <p className="font-brush text-primary text-lg md:text-xl -rotate-2 mb-1">Hyrox · distance</p>
              <p className="text-4xl md:text-6xl tabular-nums leading-none">
                <span ref={kmRef}>0.00</span><span className="text-primary text-xl md:text-2xl ml-1">KM</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-brush text-primary text-lg md:text-xl -rotate-2 mb-1">Chrono</p>
              <p className="text-4xl md:text-6xl tabular-nums leading-none"><span ref={chronoRef}>00:00:00</span></p>
            </div>
          </div>

          {/* Fiche étape */}
          <div className="absolute bottom-8 md:bottom-12 left-4 right-4 md:left-12 md:right-auto md:w-[440px]">
            <div key={`${step.kind}-${step.i}`} className="hx-in bg-[#f3eee6] text-bg p-6 md:p-8 -rotate-1 drop-shadow-[10px_12px_0_rgba(0,0,0,0.6)]" style={{ clipPath: TORN }}>
              {step.kind === 'run' ? (
                <>
                  <p className="font-brush text-primary text-xl -rotate-1 mb-2">Run {String(step.i + 1).padStart(2, '0')} / 08</p>
                  <h2 className="font-display text-4xl md:text-5xl leading-none mb-3"><Scramble text="1000 M RUN" /></h2>
                  <p className="font-body text-sm text-bg/75 leading-relaxed">
                    Entre chaque station, un kilomètre de course. Prochaine station : <span className="font-semibold text-bg">{st.name}</span>.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-brush text-primary text-xl -rotate-1">Station {st.id} / 08</p>
                    <Sticker rot={3} tone="red" className="px-3 py-1 text-xs">{st.dist}</Sticker>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl leading-none mb-3"><Scramble text={st.name} /></h2>
                  <p className="font-body text-sm text-bg/75 leading-relaxed">{st.desc}</p>
                </>
              )}
            </div>
          </div>

          {/* Progression */}
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10">
            <div ref={barRef} className="h-full bg-primary origin-left shadow-[0_0_12px_#FF2E00]" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="hidden md:flex absolute bottom-12 right-12 gap-2">
            {STATIONS.map((s, i) => (
              <span key={s.id} className={`w-8 h-[3px] transition-colors duration-500 ${i < step.i || (i === step.i && step.kind === 'station') ? 'bg-primary' : 'bg-white/15'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* --- TRANSITION --- */}
      <section className="relative z-10 min-h-[80svh] flex items-center px-4 md:px-12 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/75 to-transparent" />
        <div className="relative max-w-3xl">
          <p className="reveal-on-scroll font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-4">Finish line · 8,00 km</p>
          <h2 className="reveal-on-scroll font-display uppercase text-[14vw] md:text-[8vw] leading-[0.95] mb-6">
            <span className="block text-white/90">Next level :</span>
            <span className="block text-transparent" style={{ WebkitTextStroke: '1.5px #FF2E00' }}>ATHX.</span>
          </h2>
          <p className="reveal-on-scroll font-body text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
            Après la course, un autre défi : <span className="text-white">3 zones, 3 scores.</span> Force maximale, endurance, puis un MetCon final. Le classement se fait aux points.
          </p>
        </div>
      </section>

      {/* --- ATHX --- */}
      <section ref={athxRef} className="relative z-10 h-[360svh]">
        <div className="sticky top-0 h-[100svh] pointer-events-none">
          <div className="absolute top-24 md:top-28 left-4 md:left-12">
            <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-2">ATHX · 3 zones notées</p>
            <p className="font-display text-5xl md:text-7xl leading-none">ATHX</p>
          </div>

          <div className="absolute right-4 md:right-12 top-24 md:top-28 bottom-24 w-[2px] bg-white/10 hidden md:block">
            <div ref={zoneBarRef} className="w-full h-full bg-primary origin-top" style={{ transform: 'scaleY(0)' }} />
          </div>

          <div className="absolute bottom-8 md:bottom-12 left-4 right-4 md:left-auto md:right-24 md:w-[440px]">
            <div key={zone} className="hx-in bg-[#f3eee6] text-bg p-6 md:p-8 rotate-1 drop-shadow-[10px_12px_0_rgba(0,0,0,0.6)]" style={{ clipPath: TORN }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-brush text-primary text-xl -rotate-1">Zone {ZONES[zone].id} / 03</p>
                <Sticker rot={-3} tone="red" className="px-3 py-1 text-xs">{ZONES[zone].kicker}</Sticker>
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-none mb-3"><Scramble text={ZONES[zone].name} /></h2>
              <p className="font-body text-sm text-bg/75 leading-relaxed">{ZONES[zone].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPARATIF --- */}
      <section className="relative z-10 isolate px-4 md:px-12 py-24 md:py-32">
        <div className="absolute inset-x-0 -top-[40svh] h-[40svh] bg-gradient-to-b from-transparent to-bg pointer-events-none -z-10" />
        <JungleLeaves set="right" opacity={0.8} />
        <div className="max-w-6xl mx-auto">
          <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-4">Comparatif</p>
          <h2 className="font-display text-5xl md:text-8xl leading-[0.9] uppercase mb-14 md:mb-20">
            Deux courses.<br /><span className="text-primary">Une préparation.</span>
          </h2>

          <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1.4fr_1.4fr] border-t border-white/15">
            <div className="hidden md:block" />
            <div className="font-display text-2xl md:text-4xl py-5 md:py-6 pr-4">HYROX</div>
            <div className="font-display text-2xl md:text-4xl py-5 md:py-6 text-primary">ATHX</div>
            {COMPARE.map((row) => (
              <div key={row.label} className="contents group">
                <div className="col-span-2 md:col-span-1 pt-5 md:py-6 md:border-t border-white/10 font-body text-[10px] uppercase tracking-[0.3em] text-gray-500">{row.label}</div>
                <div className="py-3 md:py-6 pr-4 border-t-0 md:border-t border-white/10 font-body text-sm md:text-base text-gray-300">{row.hyrox}</div>
                <div className="py-3 md:py-6 md:border-t border-white/10 font-body text-sm md:text-base text-white">{row.athx}</div>
              </div>
            ))}
          </div>

          <p className="font-body text-xs text-gray-500 mt-8 max-w-2xl">
            Mouvements, charges et durées évoluent selon la saison et la catégorie. Les coachs vous donnent les standards à jour.
          </p>
        </div>
      </section>

      {/* --- NIVEAUX --- */}
      <section className="relative z-10 isolate px-4 md:px-12 pb-24 md:pb-32">
        <JungleLeaves set="left" opacity={0.75} />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 border-t border-white/15 pt-14 md:pt-20">
            <div>
              <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-4">Pour tous les niveaux</p>
              <h2 className="font-display text-5xl md:text-6xl uppercase leading-[0.9] mb-6">
                Pas besoin<br />d&apos;être <span className="text-primary">athlète.</span>
              </h2>
              <p className="font-body text-gray-400 leading-relaxed">
                Hyrox comme ATHX proposent plusieurs catégories : le format reste le même, seules les charges et le volume changent.
                En cours, chaque mouvement est adapté à votre niveau. Vous progressez à votre rythme, et quand vous êtes prêt, on choisit ensemble la bonne catégorie.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-10">
              {([['HYROX', LEVELS.hyrox, 'text-white'], ['ATHX', LEVELS.athx, 'text-primary']] as const).map(([title, list, color]) => (
                <div key={title}>
                  <p className={`font-display text-3xl mb-6 ${color}`}>{title}</p>
                  <ul className="space-y-6">
                    {list.map((lvl, i) => (
                      <li key={lvl.name} className="group flex gap-4">
                        <span className="font-display text-sm text-gray-600 pt-1 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        <div className="border-l border-white/10 group-hover:border-primary transition-colors pl-4">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                            <span className="font-display text-xl tracking-wide">{lvl.name}</span>
                            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-primary">{lvl.tag}</span>
                          </div>
                          <p className="font-body text-sm text-gray-400 leading-relaxed">{lvl.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PLANNING HYBRIDE --- */}
      <section className="relative z-10 isolate px-4 md:px-12 py-24 md:py-32">
        <JungleLeaves set="corners" opacity={0.8} />
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="font-brush text-primary text-2xl md:text-3xl -rotate-2 mb-4">Les créneaux</p>
              <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">S&apos;entraîner</h2>
            </div>
            <TransitionLink href="/planning" className="font-display uppercase tracking-widest text-sm text-white hover:text-primary transition-colors">
              Planning complet →
            </TransitionLink>
          </div>

          <div className="flex flex-wrap gap-5">
            {hybridSlots.map((s, i) => {
              const creneau = `${s.day} ${s.time} - ${s.type}`;
              return (
                <TransitionLink
                  key={creneau}
                  href={`/contact?creneau=${encodeURIComponent(creneau)}`}
                  className="group inline-block transition-transform hover:-translate-y-1"
                >
                  <Sticker rot={((i * 7) % 5) - 2} tone={/ATHX/.test(s.type) ? 'red' : 'white'} className="px-4 py-3 text-left">
                    <span className="block font-body text-[10px] tracking-[0.3em] opacity-70">{s.day}</span>
                    <span className="block text-2xl md:text-3xl leading-none tabular-nums mt-1">{s.time}</span>
                    <span className="block text-sm mt-1">{s.type} <span className="opacity-0 group-hover:opacity-80 transition-opacity">→</span></span>
                  </Sticker>
                </TransitionLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative z-10 isolate px-4 md:px-12 py-28 md:py-40 text-center">
        <Splash variant={1} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmin] h-[70vmin] text-blood/35 -z-10" />
        <h2 className="font-display uppercase text-[16vw] md:text-[11vw] leading-[0.82] mb-10">
          <span className="block">Your race.</span>
          <span className="block text-transparent" style={{ WebkitTextStroke: '2px #FF2E00' }}>Your pace.</span>
        </h2>
        <TransitionLink href="/contact" className="inline-block">
          <Sticker rot={-2} tone="red" className="px-10 py-5 text-lg md:text-2xl">Commencer la préparation →</Sticker>
        </TransitionLink>
      </section>
    </main>
  );
}
