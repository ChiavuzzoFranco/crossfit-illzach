'use client';
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import TransitionLink from "../components/TransitionLink";

export default function Home() {
  const containerRef = useRef(null);
  const gorillaRef = useRef(null);
  const bgTextRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallaxe Gorille (Gardons le gorille, c'est l'emblème, mais rendons le sympa)
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
      
      {/* === 1. HERO SECTION : INSPIRANT & ACCESSIBLE === */}
      <section className="h-screen w-full relative flex flex-col items-center justify-center border-b border-white/10">
        
        {/* Texte Arrière-plan (Esthétique) */}
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

        {/* Nouveau Slogan : Sport Santé */}
        <div className="absolute bottom-24 z-20 text-center px-4">
           <h2 className="font-display text-4xl md:text-6xl mb-4 text-white">
             LE SPORT. <span className="text-primary">ENFIN POUR VOUS.</span>
           </h2>
           <p className="font-body text-gray-400 max-w-lg mx-auto text-sm md:text-base">
             Bouger mieux. Vivre plus longtemps. Rejoignez une communauté bienveillante, quel que soit votre niveau.
           </p>
        </div>
      </section>

      {/* === 2. LA PHILOSOPHIE : SPORT SANTÉ & INCLUSION === */}
      <section className="py-32 px-6 md:px-12 relative z-10 bg-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20">

          {/* Colonne gauche — Titre */}
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <h2 className="reveal-on-scroll font-body text-xs uppercase tracking-[0.3em] text-primary mb-6">/// Notre Vision</h2>
            <h3 className="reveal-on-scroll font-display text-5xl md:text-7xl leading-[0.9] mb-6">
              VENEZ COMME<br/>
              <span className="text-primary">VOUS ÊTES.</span>
            </h3>
            <p className="reveal-on-scroll font-body text-gray-500 text-base leading-relaxed max-w-sm">
              Oubliez les clichés du militaire qui hurle. Ici, la star, c'est votre santé. Nous utilisons le CrossFit pour vous rendre plus fort pour la vie de tous les jours.
            </p>
            <div className="mt-10 reveal-on-scroll">
              <TransitionLink href="/concept" className="inline-block border border-white/20 px-8 py-4 font-display text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Découvrir notre méthode →
              </TransitionLink>
            </div>
          </div>

          {/* Colonne droite — Les 3 Piliers */}
          <div className="md:col-span-7 flex flex-col gap-0">

            {/* 1. Coaching */}
            <div className="reveal-on-scroll group py-10 border-t border-white/10">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-body text-xs text-primary/60">01</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">COACHING SEMI-PRIVÉ</h4>
              </div>
              <p className="font-body text-gray-500 text-sm leading-relaxed md:pl-10">
                Nos cours sont limités à 12 personnes. Pourquoi ? Pour que le coach puisse passer du temps avec <strong className="text-gray-300">chacun de vous</strong>. On corrige votre posture, on adapte la charge. C'est la qualité du coaching privé, avec l'énergie du groupe.
              </p>
            </div>

            {/* 2. Adaptabilité */}
            <div className="reveal-on-scroll group py-10 border-t border-white/10">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-body text-xs text-primary/60">02</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">100% ADAPTABLE</h4>
              </div>
              <p className="font-body text-gray-500 text-sm leading-relaxed md:pl-10">
                Vous ne savez pas faire de traction ? Pas de problème. Vous avez mal au dos ? On a une solution.
                Dans le même cours, un athlète peut soulever 100kg et sa grand-mère soulever un tube en PVC. <strong className="text-gray-300">L'effort est le même, la charge est adaptée.</strong>
              </p>
            </div>

            {/* 3. Communauté */}
            <div className="reveal-on-scroll group py-10 border-t border-white/10 border-b">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-body text-xs text-primary/60">03</span>
                <h4 className="font-display text-2xl md:text-3xl text-white group-hover:text-primary transition-colors duration-300">ZERO JUGEMENT</h4>
              </div>
              <p className="font-body text-gray-500 text-sm leading-relaxed md:pl-10">
                Le dernier à finir est celui qu'on applaudit le plus fort. Personne ne se regarde dans le miroir ici. On transpire ensemble, on rigole ensemble, on progresse ensemble.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* === 3. IMAGE & CTA === */}
      <section className="w-full relative py-32 bg-[#080808] border-t border-white/10">
        <div className="px-6 md:px-12 text-center">
            <h3 className="reveal-on-scroll font-display text-4xl md:text-6xl mb-8">
              LE PLUS DUR,<br/>C'EST DE PASSER LA PORTE.
            </h3>
            <p className="reveal-on-scroll font-body text-gray-400 mb-12 max-w-xl mx-auto">
              Nous savons que commencer est intimidant. Venez juste nous rencontrer, boire un café, et voir comment ça se passe. La première séance est offerte.
            </p>
            <TransitionLink href="/contact" className="reveal-on-scroll inline-block bg-primary text-white font-display text-xl px-12 py-5 uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
              Réserver ma séance d'essai
            </TransitionLink>
        </div>
      </section>

    </main>
  );
}