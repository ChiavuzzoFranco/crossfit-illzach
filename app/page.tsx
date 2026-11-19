'use client';
import { useEffect } from "react";
import dynamic from "next/dynamic";
import TransitionLink from "../components/TransitionLink";
import JungleLeaves from "../components/jungle/JungleLeaves";
import { Splash, Sticker, TORN, tilt } from "../components/jungle/ui";

const JungleBackdrop = dynamic(() => import("../components/jungle/JungleBackdrop"), { ssr: false });

const PILLARS = [
  {
    n: 1,
    title: "SÉCURITÉ & ADAPTATION",
    body: <>Mal au genou ? Reprise après une grossesse ? Première fois en salle ? On adapte tout. <strong className="text-white">Chaque exercice a une version pour vous.</strong> Zéro ego, zéro pression.</>,
  },
  {
    n: 2,
    title: "ZÉRO JUGEMENT",
    body: <>Le seul regard que vous croiserez ici, c&apos;est celui de quelqu&apos;un qui vous encourage. On a des adhérents de 18 à 65 ans, des sportifs du dimanche et des compétiteurs. <strong className="text-white">Tout le monde cohabite, tout le monde progresse.</strong></>,
  },
  {
    n: 3,
    title: "L'HUMAIN AU CENTRE",
    body: <>On connaît votre prénom, vos objectifs, et même votre café préféré. Ici, vous n&apos;êtes pas un numéro d&apos;adhérent. <strong className="text-white">Quand vous passez la porte, on sait si vous avez passé une bonne journée.</strong></>,
  },
];

const SERVICES = [
  { n: 1, title: "LE WOD", color: "text-blood", body: "Une heure ensemble, encadrée de A à Z. On s'échauffe, on apprend, on se dépasse — et on finit toujours avec le sourire (même après les burpees)." },
  { n: 2, title: "GYM & HALTÉROPHILIE", color: "text-ember", body: "Envie de maîtriser les mouvements gymniques ou de soulever votre première barre ? Ces créneaux sont faits pour ça. Technique d'abord, charge ensuite. Toujours avec un coach à côté." },
  { n: 3, title: "COACHING PERSONNALISÉ", color: "text-primary", body: "Un objectif précis ? Un retour de blessure ? Un défi sportif ? On construit ensemble un programme qui vous ressemble, avec un suivi régulier et humain." },
];

// Voile radial derrière un texte posé sur la jungle
const Veil = ({ className = "" }: { className?: string }) => (
  <div className={`absolute -inset-10 bg-[radial-gradient(closest-side,rgba(8,8,8,0.88),rgba(8,8,8,0.45)_60%,transparent)] -z-10 ${className}`} />
);

export default function Home() {
  // --- Apparitions au scroll + compteurs ---
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .pillar-item, .quote-block, .cta-buttons, .service-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealElements.forEach((el) => observer.observe(el));

    const counterElements = document.querySelectorAll<HTMLElement>('.counter-num');
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseInt(el.dataset.count || "0");
            let current = 0;
            const step = () => {
              current += target / 30;
              if (current >= target) {
                el.textContent = String(target).padStart(2, "0");
              } else {
                el.textContent = String(Math.round(current)).padStart(2, "0");
                requestAnimationFrame(step);
              }
            };
            requestAnimationFrame(step);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterElements.forEach((el) => counterObserver.observe(el));

    return () => { observer.disconnect(); counterObserver.disconnect(); };
  }, []);

  return (
    <main className="min-h-screen bg-bg relative overflow-x-clip text-white">

      {/* === 1. HERO : on entre dans la jungle === */}
      <section className="relative h-[230svh]">
        <JungleBackdrop variant="hero" gorilla splats className="sticky top-0 h-[100svh] w-full" />
        {/* fondu vers la suite de la page (pas de coupure nette) */}
        <div className="absolute inset-x-0 bottom-0 h-[35svh] bg-gradient-to-b from-transparent to-bg pointer-events-none z-[1]" />

        {/* Premier écran */}
        <div className="absolute inset-x-0 top-0 h-[100svh] flex flex-col justify-end px-4 md:px-12 pb-14 md:pb-16 pointer-events-none">
          <div className="relative">
            <Veil className="-inset-x-16 -inset-y-20" />
            <p className="font-brush text-primary text-3xl md:text-5xl -rotate-3 mb-1">Bienvenue chez</p>
            <h1 className="font-display uppercase text-white text-[17vw] md:text-[11vw] leading-[0.82]">
              CrossFit <span className="text-primary">Illzach</span>
            </h1>
            <p className="mt-6 flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.3em] text-gray-300">
              <span className="block w-10 h-px bg-primary" /> Scrolle pour entrer dans la jungle
            </p>
          </div>
        </div>

        {/* Dernier écran : le gorille est révélé */}
        <div className="absolute inset-x-0 bottom-0 h-[100svh] flex items-end justify-center px-4 pb-16 md:pb-20 text-center">
          <div className="relative max-w-3xl">
            <Veil />
            <h2 className="font-display text-4xl md:text-7xl mb-5 text-white leading-[0.92]">
              <span className="inline-block">PLUS QU&apos;UNE SALLE.</span><br />
              <span className="inline-block text-primary">UNE COMMUNAUTÉ.</span>
            </h2>
            <p className="font-body text-gray-200 max-w-lg mx-auto text-sm md:text-base">
              Ici, on s&apos;appelle par nos prénoms. On s&apos;encourage, on transpire, on rigole. Que vous n&apos;ayez jamais touché une barre ou que vous vous entraîniez depuis 10 ans — poussez la porte, le reste on s&apos;en occupe.
            </p>
          </div>
        </div>
      </section>

      {/* === 2. NOTRE PHILOSOPHIE (CARE) === */}
      <section className="py-32 px-6 md:px-12 relative z-10 isolate">
        <JungleLeaves set="right" opacity={0.85} />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20">
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <p className="reveal-on-scroll font-brush text-primary text-3xl md:text-4xl -rotate-2 mb-3">Notre philosophie</p>
            <h3 className="reveal-on-scroll font-display text-5xl md:text-7xl leading-[0.9] mb-6">
              VOTRE SANTÉ<br />
              <span className="text-primary">AVANT TOUT.</span>
            </h3>
            <p className="reveal-on-scroll font-body text-gray-300 text-base leading-relaxed max-w-sm">
              On ne va pas vous mentir : oui, c&apos;est intense. Mais chaque mouvement est adapté à votre niveau et à votre corps. Nos coachs sont là pour ça — pas pour vous pousser dans vos retranchements, mais pour vous accompagner vers la meilleure version de vous-même.
            </p>
            <div className="mt-10 reveal-on-scroll">
              <TransitionLink href="/contact" className="inline-block">
                <Sticker rot={-2} tone="white" className="px-6 py-3 text-sm md:text-base">Nous rencontrer →</Sticker>
              </TransitionLink>
            </div>
          </div>

          {/* Les 3 piliers, chacun sur son éclaboussure */}
          <div className="md:col-span-7 flex flex-col gap-14">
            {PILLARS.map((p, i) => (
              <div key={p.n} className="pillar-item relative flex gap-6 md:gap-8 items-start">
                <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <Splash variant={i} className={`absolute inset-0 w-full h-full ${['text-blood', 'text-ember', 'text-primary'][i]}`} style={{ transform: `rotate(${tilt(i, 20)}deg)` }} />
                  <span className="counter-num relative font-display text-3xl md:text-4xl text-white" data-count={p.n}>00</span>
                </div>
                <div>
                  <h4 className="font-display text-3xl md:text-4xl text-white mb-3">{p.title}</h4>
                  <p className="font-body text-gray-300 text-sm md:text-base leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === 3. L'ESPRIT DE LA BOX (COMMUNAUTÉ) === */}
      <section className="py-32 px-6 md:px-12 relative isolate">
        <JungleLeaves set="corners" opacity={0.9} />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="reveal-on-scroll font-brush text-primary text-3xl md:text-4xl -rotate-2 mb-3">L&apos;esprit de la box</p>
          <h3 className="reveal-on-scroll font-display text-4xl md:text-7xl leading-[0.9] mb-14">
            ON VIENT POUR LE SPORT.<br />
            <span className="text-primary">ON RESTE POUR LES AMIS.</span>
          </h3>

          {/* La phrase de la box, sur papier déchiré */}
          <blockquote className="quote-block relative max-w-2xl mx-auto mb-14 -rotate-1">
            <div className="bg-[#f3eee6] text-bg px-8 md:px-12 py-10 shadow-[12px_14px_0_rgba(0,0,0,0.6)]" style={{ clipPath: TORN }}>
              <p className="font-brush text-2xl md:text-3xl leading-snug">
                &ldquo;Ici, celui qui termine son entraînement en dernier est celui qui reçoit le plus d&apos;encouragements.&rdquo;
              </p>
            </div>
            <Splash variant={5} className="absolute -right-8 -top-8 w-24 h-24 text-primary -z-10" />
          </blockquote>

          <p className="reveal-on-scroll font-body text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
            Le WOD se termine. Les barres se posent. Et là, c&apos;est le meilleur moment : on se tape dans les mains, on se charrie, on se félicite. Puis direction l&apos;espace détente pour un café (ou une protéine, chacun son truc). <strong className="text-white">C&apos;est dans ces moments-là que les amitiés se créent. Et c&apos;est pour ça qu&apos;on revient.</strong>
          </p>
        </div>
      </section>

      {/* === 4. NOS SERVICES === */}
      <section className="py-32 px-6 md:px-12 relative isolate">
        <JungleLeaves set="left" opacity={0.8} />
        <div className="relative max-w-7xl mx-auto">
          <p className="reveal-on-scroll font-brush text-primary text-3xl md:text-4xl -rotate-2 mb-3 text-center">Nos services</p>
          <h3 className="reveal-on-scroll font-display text-4xl md:text-7xl leading-[0.9] mb-20 text-center">
            UN ACCOMPAGNEMENT<br /><span className="text-primary">COMPLET POUR TOUS</span>
          </h3>

          <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {SERVICES.map((s, i) => (
              <div key={s.n} className={`service-card relative isolate px-8 md:px-10 pt-14 pb-12 text-center ${i === 1 ? 'md:mt-12' : ''}`}>
                <Splash variant={i + 2} className={`absolute -inset-x-4 -inset-y-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] ${s.color} -z-10 drop-shadow-[8px_10px_0_rgba(0,0,0,0.55)]`} style={{ transform: `rotate(${tilt(i + 3, 6)}deg)` }} />
                <Sticker rot={tilt(i, 6)} tone="black" className="px-3 py-1 text-sm mb-5">
                  <span className="counter-num" data-count={s.n}>00</span>
                </Sticker>
                <h4 className="font-display text-3xl mb-4 text-white">{s.title}</h4>
                <p className="font-body text-white/90 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="reveal-on-scroll text-center mt-16">
            <TransitionLink href="/planning" className="inline-block">
              <Sticker rot={-2} tone="white" className="px-6 py-3 text-sm md:text-base">Voir le planning →</Sticker>
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* === 5. L'ÉQUIPE === */}
      <section className="py-32 px-6 md:px-12 relative isolate">
        <JungleLeaves set="right" opacity={0.75} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="reveal-on-scroll font-brush text-primary text-3xl md:text-4xl -rotate-2 mb-3">L&apos;équipe</p>
          <h3 className="reveal-on-scroll font-display text-4xl md:text-7xl leading-[0.9] mb-10">
            UNE ÉQUIPE PASSIONNÉE<br /><span className="text-primary">À VOS CÔTÉS</span>
          </h3>
          <p className="reveal-on-scroll font-body text-gray-300 text-base leading-relaxed max-w-2xl mx-auto mb-10">
            On ne compte pas les répétitions depuis un bureau. On est sur le plateau, avec vous, à chaque séance. On corrige, on motive, on plaisante — et quand vous battez un record, c&apos;est nous qui crions le plus fort. Notre porte est toujours ouverte : pour parler de votre programme, d&apos;un petit bobo, ou juste pour dire bonjour.
          </p>
          <div className="reveal-on-scroll">
            <TransitionLink href="/contact" className="inline-block">
              <Sticker rot={2} tone="white" className="px-6 py-3 text-sm md:text-base">Rencontrer l&apos;équipe →</Sticker>
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* === 6. CTA FINAL === */}
      <section className="py-32 px-6 md:px-12 relative isolate">
        <Splash variant={1} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmin] h-[70vmin] text-blood/35 -z-10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="reveal-on-scroll font-brush text-primary text-3xl md:text-4xl -rotate-2 mb-3">La tribu t&apos;attend</p>
          <h3 className="reveal-on-scroll font-display text-4xl md:text-7xl leading-[0.9] mb-6">
            PRÊT À REJOINDRE<br /><span className="text-primary">LA COMMUNAUTÉ ?</span>
          </h3>
          <p className="reveal-on-scroll font-body text-gray-200 mb-10 max-w-xl mx-auto">
            Passez nous voir, sans engagement. On vous fait visiter, on vous offre un café, et si le courant passe — votre première séance est offerte.
          </p>

          <div className="cta-buttons flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8">
            <TransitionLink href="/planning" className="inline-block">
              <Sticker rot={-2} tone="red" className="px-8 py-4 text-lg md:text-xl">Réserver ma séance d&apos;essai</Sticker>
            </TransitionLink>
            <TransitionLink href="/contact" className="inline-block">
              <Sticker rot={2} tone="white" className="px-8 py-4 text-lg md:text-xl">Nous contacter</Sticker>
            </TransitionLink>
          </div>
        </div>
      </section>

    </main>
  );
}
