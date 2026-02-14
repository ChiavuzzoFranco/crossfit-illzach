'use client';
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "../components/TransitionLink";

export default function Home() {
  const containerRef = useRef(null);
  const gorillaRef = useRef(null);
  const bgTextRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Parallaxe Gorille
    gsap.to(gorillaRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Parallaxe Texte de fond
    gsap.to(bgTextRef.current, {
      xPercent: -10,
      opacity: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "60% top",
        scrub: 1
      }
    });

    // Apparition des textes "Reveal"
    const reveals = document.querySelectorAll(".reveal-on-scroll");
    reveals.forEach((text) => {
      gsap.fromTo(text,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
          }
        }
      );
    });

    // Lignes séparatrices
    gsap.utils.toArray('.separator').forEach((line: any) => {
      gsap.fromTo(line, { scaleX: 0, transformOrigin: "left" }, {
        scaleX: 1,
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: { trigger: line, start: "top 90%" }
      });
    });

  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-bg relative overflow-hidden text-white">

      {/* === 1. HERO SECTION === */}
      <section className="h-screen w-full relative flex flex-col items-center justify-center border-b border-white/10">

        {/* Texte Arrière-plan */}
        <div ref={bgTextRef} className="absolute inset-0 flex flex-col items-center justify-center z-0 select-none opacity-20">
          <h1 className="text-[18vw] leading-[0.8] font-display text-gray-700 text-center whitespace-nowrap">
            ILLZACH
          </h1>
        </div>

        {/* Gorille */}
        <div ref={gorillaRef} className="relative z-10 w-[80vw] md:w-[500px] pointer-events-none">
           <Image
             src="/logo.png"
             alt="Crossfit Illzach Logo"
             width={600}
             height={600}
             priority
             className="w-full h-auto object-contain drop-shadow-2xl"
           />
        </div>

        {/* Slogan Hero */}
        <div className="absolute bottom-24 z-20 text-center px-4">
           <h2 className="font-display text-3xl md:text-6xl mb-4 text-white leading-tight">
             PLUS QU&apos;UNE SALLE.<br/><span className="text-primary">UNE COMMUNAUTÉ.</span>
           </h2>
           <p className="font-body text-gray-400 max-w-lg mx-auto text-sm md:text-base">
             Votre niveau sportif importe peu. Ce qui compte, c&apos;est vous. Rejoignez une communauté bienveillante où chacun progresse à son rythme.
           </p>
        </div>
      </section>

      {/* === 2. NOTRE PHILOSOPHIE (CARE) === */}
      <section className="py-32 px-6 md:px-12 relative z-10 bg-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20">

          {/* Colonne gauche — Titre */}
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6">/// Notre Philosophie</h2>
            <h3 className="reveal-on-scroll font-display text-5xl md:text-7xl leading-[0.9] mb-6">
              VOTRE SANTÉ<br/>
              <span className="text-primary">AVANT TOUT.</span>
            </h3>
            <p className="reveal-on-scroll font-body text-gray-500 text-base leading-relaxed max-w-sm">
              Chez nous, le CrossFit n&apos;est pas une compétition contre les autres. C&apos;est un moyen de se sentir mieux dans sa vie, encadré par des coachs qui se soucient vraiment de votre réussite.
            </p>
            <div className="mt-10 reveal-on-scroll">
              <TransitionLink href="/concept" className="inline-block border border-white/20 px-8 py-4 font-display text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Découvrir la box →
              </TransitionLink>
            </div>
          </div>

          {/* Colonne droite — Les 3 Piliers */}
          <div className="md:col-span-7 flex flex-col gap-0">

            {/* 1. Sécurité & Adaptation */}
            <div className="reveal-on-scroll group py-10 border-t border-white/10">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-body text-xs text-primary/60">01</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">SÉCURITÉ & ADAPTATION</h4>
              </div>
              <p className="font-body text-gray-500 text-sm leading-relaxed md:pl-10">
                Nos coachs veillent sur chaque mouvement. Une douleur ? Une reprise difficile ? Nous adaptons <strong className="text-gray-300">chaque exercice</strong> pour protéger votre corps tout en vous faisant progresser.
              </p>
            </div>

            {/* 2. Zéro Jugement */}
            <div className="reveal-on-scroll group py-10 border-t border-white/10">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-body text-xs text-primary/60">02</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">ZÉRO JUGEMENT</h4>
              </div>
              <p className="font-body text-gray-500 text-sm leading-relaxed md:pl-10">
                Que vous soyez un athlète confirmé ou que vous n&apos;ayez pas fait de sport depuis 10 ans, <strong className="text-gray-300">vous avez votre place ici</strong>. Personne ne vous regarde de haut.
              </p>
            </div>

            {/* 3. L'Humain au Centre */}
            <div className="reveal-on-scroll group py-10 border-t border-white/10 border-b">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-body text-xs text-primary/60">03</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">L&apos;HUMAIN AU CENTRE</h4>
              </div>
              <p className="font-body text-gray-500 text-sm leading-relaxed md:pl-10">
                Nous connaissons chacun de nos adhérents par leur prénom. Vos objectifs deviennent les nôtres, qu&apos;il s&apos;agisse de perdre du poids, de se muscler ou simplement de <strong className="text-gray-300">se vider la tête</strong>.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* === 3. L'ESPRIT DE LA BOX (COMMUNAUTÉ) === */}
      <section className="py-32 px-6 md:px-12 bg-[#080808] border-y border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6">/// L&apos;Esprit de la Box</h2>
          <h3 className="reveal-on-scroll font-display text-4xl md:text-7xl leading-[0.9] mb-12">
            ON VIENT POUR LE SPORT.<br/>
            <span className="text-primary">ON RESTE POUR LES AMIS.</span>
          </h3>

          {/* Citation */}
          <blockquote className="reveal-on-scroll border-l-2 border-primary pl-6 md:pl-8 text-left max-w-2xl mx-auto mb-12">
            <p className="font-body text-lg md:text-xl text-gray-300 italic leading-relaxed">
              &ldquo;Ici, celui qui termine son entraînement en dernier est celui qui reçoit le plus d&apos;encouragements.&rdquo;
            </p>
          </blockquote>

          <p className="reveal-on-scroll font-body text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
            À CrossFit Illzach, l&apos;entraide est notre moteur. L&apos;entraînement est intense, mais les sourires à la fin sont garantis. Et après l&apos;effort ? Place au réconfort dans notre espace détente. On partage un café, on discute, on rit. <strong className="text-gray-300">C&apos;est ça, la vraie force de notre communauté.</strong>
          </p>
        </div>
      </section>

      {/* === 4. NOS SERVICES === */}
      <section className="py-32 px-6 md:px-12 bg-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6 text-center">/// Nos Services</h2>
          <h3 className="reveal-on-scroll font-display text-4xl md:text-7xl leading-[0.9] mb-20 text-center">
            UN ACCOMPAGNEMENT<br/><span className="text-primary">COMPLET POUR TOUS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Carte WOD */}
            <div className="reveal-on-scroll group border border-white/10 p-8 md:p-10 hover:border-primary/50 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-in-out"></div>
              <span className="font-body text-xs text-primary/60 block mb-4">01</span>
              <h4 className="font-display text-2xl mb-4 text-white group-hover:text-primary transition-colors">LE WOD</h4>
              <p className="font-body text-gray-500 text-sm leading-relaxed">
                Des séances d&apos;une heure en petit groupe, encadrées de A à Z par un coach. On s&apos;échauffe ensemble, on travaille la technique, et on se dépense dans la bonne humeur.
              </p>
            </div>

            {/* Carte Gym & Haltéro */}
            <div className="reveal-on-scroll group border border-white/10 p-8 md:p-10 hover:border-primary/50 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-in-out"></div>
              <span className="font-body text-xs text-primary/60 block mb-4">02</span>
              <h4 className="font-display text-2xl mb-4 text-white group-hover:text-primary transition-colors">GYM & HALTÉROPHILIE</h4>
              <p className="font-body text-gray-500 text-sm leading-relaxed">
                Des créneaux spécifiques pour apprendre à maîtriser votre corps et les charges, en douceur et avec pédagogie. Idéal pour gagner en confiance technique.
              </p>
            </div>

            {/* Carte Coaching */}
            <div className="reveal-on-scroll group border border-white/10 p-8 md:p-10 hover:border-primary/50 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-in-out"></div>
              <span className="font-body text-xs text-primary/60 block mb-4">03</span>
              <h4 className="font-display text-2xl mb-4 text-white group-hover:text-primary transition-colors">COACHING PERSONNALISÉ</h4>
              <p className="font-body text-gray-500 text-sm leading-relaxed">
                Besoin d&apos;un suivi sur-mesure pour un objectif précis ? Nos coachs sont là pour vous créer un programme adapté à 100% à vos besoins.
              </p>
            </div>

          </div>

          <div className="reveal-on-scroll text-center mt-12">
            <TransitionLink href="/activites" className="inline-block border border-white/20 px-8 py-4 font-display text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Voir toutes les activités →
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* === 5. L'ÉQUIPE === */}
      <section className="py-32 px-6 md:px-12 bg-[#080808] border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6">/// L&apos;Équipe</h2>
          <h3 className="reveal-on-scroll font-display text-4xl md:text-7xl leading-[0.9] mb-10">
            UNE ÉQUIPE PASSIONNÉE<br/><span className="text-primary">À VOS CÔTÉS</span>
          </h3>
          <p className="reveal-on-scroll font-body text-gray-500 text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Nous ne sommes pas là juste pour compter les répétitions. Nous sommes là pour vous écouter, vous motiver quand c&apos;est dur, et célébrer vos victoires avec vous. Notre porte est toujours ouverte pour discuter de vos progrès ou de vos petits bobos.
          </p>
          <div className="reveal-on-scroll">
            <TransitionLink href="/concept" className="inline-block border border-white/20 px-8 py-4 font-display text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Rencontrer l&apos;équipe →
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* === 6. CTA FINAL === */}
      <section className="py-32 px-6 md:px-12 bg-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="reveal-on-scroll font-display text-4xl md:text-6xl mb-6">
            PRÊT À REJOINDRE<br/><span className="text-primary">LA FAMILLE ?</span>
          </h3>
          <p className="reveal-on-scroll font-body text-gray-400 mb-6 max-w-xl mx-auto">
            Ne restez pas seul(e) face à vos objectifs. Venez nous rencontrer, visiter la salle et boire un café avec nous.
          </p>

          <div className="reveal-on-scroll flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
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
