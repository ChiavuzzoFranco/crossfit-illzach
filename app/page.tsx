'use client';
import Image from "next/image";
import { useEffect, useRef } from "react";
import TransitionLink from "../components/TransitionLink";

export default function Home() {
  const containerRef = useRef(null);
  const gorillaRef = useRef(null);
  const bgTextRef = useRef(null);

  useEffect(() => {
    let ctx: any;
    (async () => {
      const { default: gsapCore } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsapCore.registerPlugin(ScrollTrigger);
      const gsap = gsapCore;

    const gsapCtx = gsap.context(() => {

      // ——— HERO ENTRANCE TIMELINE ———
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Logo gorille : scale up + fade
      heroTl.fromTo(gorillaRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2 }
      );

      // Texte de fond ILLZACH : glisse depuis la gauche
      heroTl.fromTo(bgTextRef.current,
        { xPercent: -20, opacity: 0 },
        { xPercent: 0, opacity: 0.2, duration: 1.4, ease: "power2.out" },
        "-=0.8"
      );

      // Slogan hero : mots un par un
      heroTl.fromTo(".hero-title",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
        "-=0.6"
      );

      // Sous-texte hero
      heroTl.fromTo(".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.3"
      );

      // ——— PARALLAXE GORILLE AU SCROLL ———
      gsap.to(gorillaRef.current, {
        yPercent: 30,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // ——— PARALLAXE TEXTE DE FOND ———
      gsap.to(bgTextRef.current, {
        xPercent: -15,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "50% top",
          scrub: 1
        }
      });

      // ——— REVEAL ON SCROLL (fade up + léger scale) ———
      gsap.utils.toArray<HTMLElement>(".reveal-on-scroll").forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            }
          }
        );
      });

      // ——— BORDURES DES PILIERS : draw de gauche à droite ———
      gsap.utils.toArray<HTMLElement>(".pillar-item").forEach((item) => {
        gsap.fromTo(item,
          { borderColor: "rgba(255,255,255,0)", x: -30, opacity: 0 },
          {
            borderColor: "rgba(255,255,255,0.1)",
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            }
          }
        );
      });

      // ——— NUMÉROS 01/02/03 : compteur animé ———
      gsap.utils.toArray<HTMLElement>(".counter-num").forEach((num) => {
        const target = parseInt(num.dataset.count || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: num,
            start: "top 85%",
          },
          onUpdate: () => {
            num.textContent = String(Math.round(obj.val)).padStart(2, "0");
          }
        });
      });

      // ——— CARTES SERVICES : stagger avec slide up ———
      ScrollTrigger.create({
        trigger: ".services-grid",
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(".service-card",
            { y: 80, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
            }
          );
        },
        once: true,
      });

      // ——— GRANDS TITRES : parallaxe légère ———
      gsap.utils.toArray<HTMLElement>(".parallax-title").forEach((title) => {
        gsap.to(title, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: title,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      });

      // ——— BLOCKQUOTE : slide depuis la gauche ———
      gsap.fromTo(".quote-block",
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".quote-block",
            start: "top 80%",
          }
        }
      );

      // ——— CTA FINAL : scale up ———
      gsap.fromTo(".cta-buttons",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".cta-buttons",
            start: "top 85%",
          }
        }
      );

    }, containerRef);
    ctx = gsapCtx;
    })();

    return () => { if (ctx) ctx.revert(); };
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-bg relative overflow-hidden text-white">

      {/* === 1. HERO SECTION === */}
      <section className="h-screen w-full relative flex flex-col items-center justify-center border-b border-white/10">

        {/* Texte Arrière-plan */}
        <div ref={bgTextRef} className="absolute inset-0 flex flex-col items-center justify-center z-0 select-none opacity-20">
          <span aria-hidden="true" className="text-[18vw] leading-[0.8] font-display text-gray-700 text-center whitespace-nowrap block">
            ILLZACH
          </span>
        </div>

        {/* Gorille */}
        <div ref={gorillaRef} className="relative z-10 w-[80vw] md:w-[500px] pointer-events-none">
           <Image
             src="/logo.png"
             alt="Crossfit Illzach Logo"
             width={500}
             height={500}
             priority
             sizes="(max-width: 768px) 80vw, 500px"
             className="w-full h-auto object-contain drop-shadow-2xl"
           />
        </div>

        {/* Slogan Hero */}
        <div className="absolute bottom-24 z-20 text-center px-4">
           <h2 className="font-display text-3xl md:text-6xl mb-4 text-white leading-tight overflow-hidden">
             <span className="hero-title inline-block">PLUS QU&apos;UNE SALLE.</span><br/>
             <span className="hero-title inline-block text-primary">UNE COMMUNAUTÉ.</span>
           </h2>
           <p className="hero-subtitle font-body text-gray-400 max-w-lg mx-auto text-sm md:text-base">
             Ici, on s&apos;appelle par nos prénoms. On s&apos;encourage, on transpire, on rigole. Que vous n&apos;ayez jamais touché une barre ou que vous vous entraîniez depuis 10 ans — poussez la porte, le reste on s&apos;en occupe.
           </p>
        </div>
      </section>

      {/* === 2. NOTRE PHILOSOPHIE (CARE) === */}
      <section className="py-32 px-6 md:px-12 relative z-10 bg-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20">

          {/* Colonne gauche — Titre */}
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6">/// Notre Philosophie</h2>
            <h3 className="reveal-on-scroll parallax-title font-display text-5xl md:text-7xl leading-[0.9] mb-6">
              VOTRE SANTÉ<br/>
              <span className="text-primary">AVANT TOUT.</span>
            </h3>
            <p className="reveal-on-scroll font-body text-gray-400 text-base leading-relaxed max-w-sm">
              On ne va pas vous mentir : oui, c&apos;est intense. Mais chaque mouvement est adapté à votre niveau et à votre corps. Nos coachs sont là pour ça — pas pour vous pousser dans vos retranchements, mais pour vous accompagner vers la meilleure version de vous-même.
            </p>
            <div className="mt-10 reveal-on-scroll">
              <TransitionLink href="/contact" className="inline-block border border-white/20 px-8 py-4 font-display text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Nous rencontrer →
              </TransitionLink>
            </div>
          </div>

          {/* Colonne droite — Les 3 Piliers */}
          <div className="md:col-span-7 flex flex-col gap-0">

            {/* 1. Sécurité & Adaptation */}
            <div className="pillar-item group py-10 border-t border-white/10">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="counter-num font-body text-xs text-primary" data-count="1">00</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">SÉCURITÉ & ADAPTATION</h4>
              </div>
              <p className="font-body text-gray-400 text-sm leading-relaxed md:pl-10">
                Mal au genou ? Reprise après une grossesse ? Première fois en salle ? On adapte tout. <strong className="text-gray-300">Chaque exercice a une version pour vous.</strong> Zéro ego, zéro pression.
              </p>
            </div>

            {/* 2. Zéro Jugement */}
            <div className="pillar-item group py-10 border-t border-white/10">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="counter-num font-body text-xs text-primary" data-count="2">00</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">ZÉRO JUGEMENT</h4>
              </div>
              <p className="font-body text-gray-400 text-sm leading-relaxed md:pl-10">
                Le seul regard que vous croiserez ici, c&apos;est celui de quelqu&apos;un qui vous encourage. On a des adhérents de 18 à 65 ans, des sportifs du dimanche et des compétiteurs. <strong className="text-gray-300">Tout le monde cohabite, tout le monde progresse.</strong>
              </p>
            </div>

            {/* 3. L'Humain au Centre */}
            <div className="pillar-item group py-10 border-t border-white/10 border-b">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="counter-num font-body text-xs text-primary" data-count="3">00</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">L&apos;HUMAIN AU CENTRE</h4>
              </div>
              <p className="font-body text-gray-400 text-sm leading-relaxed md:pl-10">
                On connaît votre prénom, vos objectifs, et même votre café préféré. Ici, vous n&apos;êtes pas un numéro d&apos;adhérent. <strong className="text-gray-300">Quand vous passez la porte, on sait si vous avez passé une bonne journée.</strong>
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* === 3. L'ESPRIT DE LA BOX (COMMUNAUTÉ) === */}
      <section className="py-32 px-6 md:px-12 bg-[#080808] border-y border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6">/// L&apos;Esprit de la Box</h2>
          <h3 className="reveal-on-scroll parallax-title font-display text-4xl md:text-7xl leading-[0.9] mb-12">
            ON VIENT POUR LE SPORT.<br/>
            <span className="text-primary">ON RESTE POUR LES AMIS.</span>
          </h3>

          {/* Citation */}
          <blockquote className="quote-block border-l-2 border-primary pl-6 md:pl-8 text-left max-w-2xl mx-auto mb-12">
            <p className="font-body text-lg md:text-xl text-gray-300 italic leading-relaxed">
              &ldquo;Ici, celui qui termine son entraînement en dernier est celui qui reçoit le plus d&apos;encouragements.&rdquo;
            </p>
          </blockquote>

          <p className="reveal-on-scroll font-body text-gray-400 text-base leading-relaxed max-w-2xl mx-auto">
            Le WOD se termine. Les barres se posent. Et là, c&apos;est le meilleur moment : on se tape dans les mains, on se charrie, on se félicite. Puis direction l&apos;espace détente pour un café (ou une protéine, chacun son truc). <strong className="text-gray-300">C&apos;est dans ces moments-là que les amitiés se créent. Et c&apos;est pour ça qu&apos;on revient.</strong>
          </p>
        </div>
      </section>

      {/* === 4. NOS SERVICES === */}
      <section className="py-32 px-6 md:px-12 bg-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6 text-center">/// Nos Services</h2>
          <h3 className="reveal-on-scroll parallax-title font-display text-4xl md:text-7xl leading-[0.9] mb-20 text-center">
            UN ACCOMPAGNEMENT<br/><span className="text-primary">COMPLET POUR TOUS</span>
          </h3>

          <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Carte WOD */}
            <div className="service-card group border border-white/10 p-8 md:p-10 hover:border-primary/50 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-in-out"></div>
              <span className="counter-num font-body text-xs text-primary block mb-4" data-count="1">00</span>
              <h4 className="font-display text-2xl mb-4 text-white group-hover:text-primary transition-colors">LE WOD</h4>
              <p className="font-body text-gray-400 text-sm leading-relaxed">
                Une heure ensemble, encadrée de A à Z. On s&apos;échauffe, on apprend, on se dépasse — et on finit toujours avec le sourire (même après les burpees).
              </p>
            </div>

            {/* Carte Gym & Haltéro */}
            <div className="service-card group border border-white/10 p-8 md:p-10 hover:border-primary/50 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-in-out"></div>
              <span className="counter-num font-body text-xs text-primary block mb-4" data-count="2">00</span>
              <h4 className="font-display text-2xl mb-4 text-white group-hover:text-primary transition-colors">GYM & HALTÉROPHILIE</h4>
              <p className="font-body text-gray-400 text-sm leading-relaxed">
                Envie de maîtriser les mouvements gymniques ou de soulever votre première barre ? Ces créneaux sont faits pour ça. Technique d&apos;abord, charge ensuite. Toujours avec un coach à côté.
              </p>
            </div>

            {/* Carte Coaching */}
            <div className="service-card group border border-white/10 p-8 md:p-10 hover:border-primary/50 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-in-out"></div>
              <span className="counter-num font-body text-xs text-primary block mb-4" data-count="3">00</span>
              <h4 className="font-display text-2xl mb-4 text-white group-hover:text-primary transition-colors">COACHING PERSONNALISÉ</h4>
              <p className="font-body text-gray-400 text-sm leading-relaxed">
                Un objectif précis ? Un retour de blessure ? Un défi sportif ? On construit ensemble un programme qui vous ressemble, avec un suivi régulier et humain.
              </p>
            </div>

          </div>

          <div className="reveal-on-scroll text-center mt-12">
            <TransitionLink href="/planning" className="inline-block border border-white/20 px-8 py-4 font-display text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Voir le planning →
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* === 5. L'ÉQUIPE === */}
      <section className="py-32 px-6 md:px-12 bg-[#080808] border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6">/// L&apos;Équipe</h2>
          <h3 className="reveal-on-scroll parallax-title font-display text-4xl md:text-7xl leading-[0.9] mb-10">
            UNE ÉQUIPE PASSIONNÉE<br/><span className="text-primary">À VOS CÔTÉS</span>
          </h3>
          <p className="reveal-on-scroll font-body text-gray-400 text-base leading-relaxed max-w-2xl mx-auto mb-8">
            On ne compte pas les répétitions depuis un bureau. On est sur le plateau, avec vous, à chaque séance. On corrige, on motive, on plaisante — et quand vous battez un record, c&apos;est nous qui crions le plus fort. Notre porte est toujours ouverte : pour parler de votre programme, d&apos;un petit bobo, ou juste pour dire bonjour.
          </p>
          <div className="reveal-on-scroll">
            <TransitionLink href="/contact" className="inline-block border border-white/20 px-8 py-4 font-display text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Rencontrer l&apos;équipe →
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* === 6. CTA FINAL === */}
      <section className="py-32 px-6 md:px-12 bg-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="reveal-on-scroll parallax-title font-display text-4xl md:text-6xl mb-6">
            PRÊT À REJOINDRE<br/><span className="text-primary">LA COMMUNAUTÉ ?</span>
          </h3>
          <p className="reveal-on-scroll font-body text-gray-400 mb-6 max-w-xl mx-auto">
            Passez nous voir, sans engagement. On vous fait visiter, on vous offre un café, et si le courant passe — votre première séance est offerte.
          </p>

          <div className="cta-buttons flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <TransitionLink href="/planning" className="inline-block bg-primary text-white font-display text-xl px-12 py-5 uppercase tracking-wider hover:bg-white hover:text-black transition-colors text-center">
              Réserver ma séance d&apos;essai
            </TransitionLink>
            <TransitionLink href="/contact" className="inline-block border border-white/20 text-white font-display text-xl px-12 py-5 uppercase tracking-wider hover:bg-white hover:text-black transition-all text-center">
              Nous contacter
            </TransitionLink>
          </div>
        </div>
      </section>

    </main>
  );
}
