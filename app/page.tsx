'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import JungleChapter from '@/components/story/JungleChapter';
import NameChapter from '@/components/story/NameChapter';
import PeopleChapter, { PEOPLE } from '@/components/story/PeopleChapter';
import SessionChapter, { STEPS } from '@/components/story/SessionChapter';
import LastChapter from '@/components/story/LastChapter';
import ScalingChapter from '@/components/story/ScalingChapter';
import FormatsChapter from '@/components/story/FormatsChapter';
import WeekChapter from '@/components/story/WeekChapter';
import PlansChapter from '@/components/story/PlansChapter';
import TrialChapter from '@/components/story/TrialChapter';
import { story, clamp, windowed } from '@/components/story/store';

const JungleScene = dynamic(() => import('@/components/story/JungleScene'), { ssr: false });

const progressOf = (el: HTMLElement | null) => {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const total = r.height - window.innerHeight;
  return total <= 0 ? 0 : clamp(-r.top / total);
};

export default function StoryPage() {
  const jungleRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLElement>(null);
  const peopleRef = useRef<HTMLElement>(null);
  const sessionRef = useRef<HTMLElement>(null);
  const lastRef = useRef<HTMLElement>(null);
  const scalingRef = useRef<HTMLElement>(null);
  const formatsRef = useRef<HTMLElement>(null);
  const weekRef = useRef<HTMLElement>(null);
  const plansRef = useRef<HTMLElement>(null);
  const trialRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onMouse = (e: PointerEvent) => {
      story.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      story.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMouse, { passive: true });

    // Éléments à faire apparaître, groupés par chapitre
    const chapters = [
      { el: jungleRef, key: 'jungle' as const },
      { el: nameRef, key: 'name' as const },
      { el: peopleRef, key: 'people' as const },
      { el: sessionRef, key: 'session' as const },
      { el: lastRef, key: 'last' as const },
      { el: scalingRef, key: 'scaling' as const },
      { el: formatsRef, key: 'formats' as const },
      { el: weekRef, key: 'week' as const },
      { el: plansRef, key: 'plans' as const },
      { el: trialRef, key: 'trial' as const },
    ].map((c) => ({
      ...c,
      items: Array.from(c.el.current?.querySelectorAll<HTMLElement>('[data-w]') ?? []).map((node) => {
        const [a, b] = (node.dataset.w ?? '0,1').split(',').map(Number);
        return { node, a, b, last: -1 };
      }),
    }));

    // Horloge de la séance et frise des étapes
    const clocks = Array.from(document.querySelectorAll<HTMLElement>('[data-clock]')).map((node) => {
      const [start, dur] = (node.dataset.clock ?? '0,60').split(',').map(Number);
      return { node, start, dur, last: '' };
    });
    const stepBars = Array.from(document.querySelectorAll<HTMLElement>('[data-step-bar]'));
    // Le sentier de la semaine : défilement horizontal piloté par le scroll vertical
    const htrack = document.querySelector<HTMLElement>('[data-htrack]');
    let lastTrack = -1;

    let raf = 0;
    let lastY = window.scrollY;
    let lastActive = true;
    const loop = () => {
      const y = window.scrollY;
      story.velocity += (clamp((y - lastY) / 60, -1, 1) - story.velocity) * 0.12;
      lastY = y;

      for (const c of chapters) {
        const p = progressOf(c.el.current);
        story[c.key] = p;
        for (const it of c.items) {
          const o = windowed(p, it.a, it.b, Math.min(0.06, (it.b - it.a) / 3));
          if (Math.abs(o - it.last) < 0.002) continue;
          it.last = o;
          it.node.style.opacity = o.toFixed(3);
          it.node.style.transform = `translate3d(0, ${((1 - o) * 24).toFixed(1)}px, 0)`;
          it.node.style.filter = o < 0.999 ? `blur(${((1 - o) * 8).toFixed(1)}px)` : '';
        }
      }
      PEOPLE.forEach((pp, k) => { story.highlight[k] = windowed(story.people, pp.w[0], pp.w[1], 0.04); });
      story.cheer = windowed(story.last, 0.36, 0.74, 0.06);

      // 18:30 → 19:24 au fil de la séance, puis 19:24 → 19:30 pendant « le dernier »
      for (const c of clocks) {
        const minutes = c.start + story.session * c.dur * 0.9 + story.last * c.dur * 0.1;
        const txt = `${Math.floor(minutes / 60)}:${String(Math.floor(minutes % 60)).padStart(2, '0')}`;
        if (txt !== c.last) { c.last = txt; c.node.textContent = txt; }
      }
      if (htrack) {
        const dist = Math.max(htrack.scrollWidth - window.innerWidth, 0);
        const x = -story.week * dist;
        if (Math.abs(x - lastTrack) > 0.5) { lastTrack = x; htrack.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`; }
      }
      stepBars.forEach((bar, i) => {
        const [a, b] = STEPS[i].w;
        bar.style.transform = `scaleX(${clamp((story.session - a) / (b - a)).toFixed(3)})`;
      });

      // La 3D s'arrête une fois la story dépassée
      const end = trialRef.current?.getBoundingClientRect();
      const isActive = !end || end.bottom > window.innerHeight * 0.1;
      if (isActive !== lastActive) { lastActive = isActive; setActive(isActive); }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMouse); };
  }, []);

  // Apparition des sections interactives (planning, tarifs, essai)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => io.observe(el));
    // Arrivée directe sur un chapitre (/#planning, /#tarifs, /#essai…)
    // (plusieurs essais : après une navigation interne, Next peut remettre la page en haut)
    const id = decodeURIComponent(window.location.hash.slice(1));
    const timers = id
      ? [300, 900, 1700].map((delay) => window.setTimeout(() => {
          const el = document.getElementById(id);
          if (!el || Math.abs(el.getBoundingClientRect().top) < 40) return;
          if (window.__lenis) window.__lenis.scrollTo(el, { immediate: true }); else el.scrollIntoView();
        }, delay))
      : [];
    return () => { io.disconnect(); timers.forEach((t) => window.clearTimeout(t)); };
  }, []);

  return (
    <main className="relative bg-bg text-white selection:bg-primary selection:text-white">
      {/* Préchargeur */}
      <div className="story-preloader fixed inset-0 z-[9990] bg-bg flex flex-col items-center justify-center pointer-events-none" aria-hidden>
        <Image src="/logo.png" alt="" width={240} height={210} className="w-44 md:w-56 h-auto mb-8" priority />
        <span className="story-preloader-bar block h-[2px] w-40 bg-primary origin-left" />
      </div>

      {/* Scène 3D persistante */}
      <div className="fixed inset-0 z-0 transition-opacity duration-700" style={{ opacity: active ? 1 : 0 }} aria-hidden>
        <JungleScene active={active} />
      </div>

      <JungleChapter ref={jungleRef} />
      <NameChapter ref={nameRef} />
      <PeopleChapter ref={peopleRef} />
      <SessionChapter ref={sessionRef} />
      <LastChapter ref={lastRef} />
      <ScalingChapter ref={scalingRef} />
      <FormatsChapter ref={formatsRef} />
      <WeekChapter ref={weekRef} />
      <PlansChapter ref={plansRef} />
      <TrialChapter ref={trialRef} />

    </main>
  );
}
