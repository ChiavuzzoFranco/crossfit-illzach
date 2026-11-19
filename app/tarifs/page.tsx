'use client';
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pour la redirection
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { Splash, Sticker, tilt } from "../../components/jungle/ui";

const JungleBackdrop = dynamic(() => import("../../components/jungle/JungleBackdrop"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

// --- COMPOSANT DE DÉCODAGE (SCRAMBLE) ---
const ScrambleText = ({
  text,
  delay = 0,
  className = "",
  trigger = true
}: {
  text: string, delay?: number, className?: string, trigger?: boolean
}) => {
  const [display, setDisplay] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    const timeoutStart = setTimeout(() => {
        setIsAnimating(true);
    }, delay * 1000);
    return () => clearTimeout(timeoutStart);
  }, [delay, trigger]);

  useEffect(() => {
    if (!isAnimating) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 40);
    return () => clearInterval(interval);
  }, [isAnimating, text]);

  return <span className={className}>{display}</span>;
};

// --- COMPOSANT PRIX ANIMÉ (Compteur fluide) ---
const AnimatedPrice = ({ value, delay = 0, className = "" }: { value: number, delay?: number, className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const currentValue = useRef(0);
  const hasMounted = useRef(false);

  useEffect(() => {
    const d = hasMounted.current ? 0 : delay;
    const from = hasMounted.current ? currentValue.current : 0;
    hasMounted.current = true;

    const obj = { val: from };
    gsap.to(obj, {
      val: value,
      duration: 0.8,
      delay: d,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val).toString();
      },
      onComplete: () => { currentValue.current = value; }
    });
  }, [value]);

  return <span ref={ref} className={className}>0</span>;
};

export default function TarifsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Hook de navigation
  
  // États
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- DONNÉES TARIFS ---
  const PLANS = [
    {
      id: 0, 
      name: "2 SEANCES", 
      tagline: "PAR SEMAINE",
      priceMonthly: 75, 
      priceAnnual: 65,
      features: ["2 Cours / Semaine", "Accès à tous les cours", "Hyrox Inclus"],
      cta: "CHOISIR", 
      popular: false
    },
    {
      id: 1,
      name: "3 SEANCES",
      tagline: "PAR SEMAINE",
      priceMonthly: 95,
      priceAnnual: 75,
      features: ["3 Cours / Semaine", "Accès à tous les cours", "Hyrox Inclus"],
      cta: "CHOISIR", 
      popular: false
    },
    {
      id: 2,
      name: "ILLIMITE",
      tagline: "ALL ACCESS",
      priceMonthly: 110,
      priceAnnual: 89,
      features: ["WODs Illimités", "Hyrox Illimité", "Open Gym 7j/7", "Badge Free Access Inclus"],
      cta: "DEVENIR MEMBRE", 
      popular: true
    },
    {
      id: 3,
      name: "HÉROS",
      tagline: "FORCES DE L'ORDRE / PERSONNEL SOIGNANT",
      priceMonthly: 75,
      priceAnnual: 65,
      features: ["Accès Illimité", "Hyrox Inclus", "Badge Free Access Inclus", "Justificatif Req."],
      cta: "REJOINDRE", 
      popular: false, 
      special: true
    }
  ];

  // --- FONCTION DE REDIRECTION ---
  const handleSelectPlan = (planName: string) => {
    // Redirige vers /contact en ajoutant le paramètre ?plan=NOM_DU_PLAN
    router.push(`/contact?plan=${encodeURIComponent(planName)}`);
  };

  // --- SETUP INITIAL ---
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // --- ANIMATIONS GSAP ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Apparition Titre
      gsap.fromTo(".hero-title", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
      );

      // 2. Apparition Switch
      gsap.fromTo(".switch-anim",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );

      // 3. Apparition des Cartes
      gsap.fromTo(".pricing-wrapper", 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power3.out", 
          delay: 0.3 
        }
      );

      // 4. Apparition des Features (Cascade)
      gsap.fromTo(".feature-item", 
        { x: -10, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.05, 
          ease: "power2.out",
          delay: 0.8 
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Couleur de l'éclaboussure de chaque formule (couleurs du logo)
  const SPLASH = ['text-blood', 'text-ember', 'text-primary', 'text-white'];

  return (
    <main ref={containerRef} className="relative min-h-screen text-white pt-32 pb-20 overflow-x-clip selection:bg-primary selection:text-white">
      {/* Jungle en haut de page, fondue vers le bas */}
      <JungleBackdrop variant="frame" className="absolute inset-x-0 top-0 h-[90svh]" />
      <div className="absolute inset-x-0 top-[55svh] h-[35svh] bg-gradient-to-b from-transparent to-bg pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 mb-20 relative z-10 text-center">
         <p className="font-brush text-primary text-3xl md:text-5xl -rotate-2">Choisis ta place dans la tribu</p>
         <div className="overflow-hidden mb-8">
           <h1 className="hero-title font-display text-[15vw] md:text-[9vw] leading-[0.85] uppercase text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.8)]">
             REJOINDRE
           </h1>
         </div>

         {/* Engagement : deux stickers */}
         <div className="switch-anim flex justify-center items-center gap-5 mt-4">
            <button type="button" onClick={() => setIsAnnual(false)} aria-pressed={!isAnnual}>
              <Sticker rot={-2} tone={!isAnnual ? 'red' : 'black'} className="px-4 py-2 text-sm md:text-base">Sans engagement</Sticker>
            </button>
            <button type="button" onClick={() => setIsAnnual(true)} aria-pressed={isAnnual}>
              <Sticker rot={2} tone={isAnnual ? 'red' : 'black'} className="px-4 py-2 text-sm md:text-base">12 mois <span className="opacity-70">(-20€)</span></Sticker>
            </button>
         </div>
      </div>

      {/* --- LES FORMULES, en éclaboussures --- */}
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-20 relative z-10" onMouseLeave={() => setHoveredCard(null)}>
        {PLANS.map((plan, index) => {
          const cardDelay = 0.5 + (index * 0.1);
          const light = index === 3;
          return (
            <div key={plan.id} onMouseEnter={() => setHoveredCard(plan.id)}
              className={`pricing-wrapper relative isolate group transition-all duration-500 ${index % 2 ? 'xl:mt-16' : ''} ${hoveredCard !== null && hoveredCard !== plan.id ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}
            >
              <Splash variant={index + 2} className={`absolute -inset-x-5 -top-8 -bottom-6 w-[calc(100%+2.5rem)] h-[calc(100%+3.5rem)] ${SPLASH[index]} opacity-95 -z-10 drop-shadow-[8px_10px_0_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.03]`} style={{ transform: `rotate(${tilt(index, 8)}deg)` }} />

              <div className="relative px-6 pt-14 pb-10 flex flex-col items-center text-center h-full">
                  {plan.popular && <Sticker rot={-6} tone="white" className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs whitespace-nowrap">Best Seller</Sticker>}
                  {plan.special && <Sticker rot={5} tone="black" className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs whitespace-nowrap">Héros du quotidien</Sticker>}

                  <h3 className={`font-display text-4xl mt-2 tracking-wide ${light ? 'text-primary' : 'text-white'}`}>
                    <ScrambleText text={plan.name} delay={cardDelay} trigger={isLoaded} />
                  </h3>
                  <p className="mt-2">
                    <Sticker rot={tilt(index + 9, 2)} tone="black" className="px-2.5 py-1 text-[11px] tracking-[0.15em]">{plan.tagline}</Sticker>
                  </p>

                  <div className={`flex items-start mt-5 ${light ? 'text-bg' : 'text-white'}`}>
                     <span className="text-8xl lg:text-9xl leading-[0.8] font-display tracking-tighter">
                       <AnimatedPrice value={isAnnual ? plan.priceAnnual : plan.priceMonthly} delay={cardDelay + 0.2} />
                     </span>
                     <span className="text-3xl font-display ml-1">€</span>
                  </div>
                  <p className={`text-xs mt-3 font-body uppercase tracking-widest ${light ? 'text-bg/70' : 'text-white/80'}`}>
                     {isAnnual ? '/ MOIS' : '/ MOIS (LIBRE)'}
                  </p>

                  <ul className="flex flex-wrap justify-center gap-2 my-7">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="feature-item">
                        <Sticker rot={tilt(index * 5 + i, 3)} tone={light ? 'black' : 'white'} className="px-2.5 py-1 text-[11px] md:text-xs">{feature}</Sticker>
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => handleSelectPlan(plan.name)} className="group/btn mt-auto">
                    <Sticker rot={-2} tone={plan.popular || light ? (light ? 'red' : 'white') : 'black'} className="px-6 py-3 text-sm md:text-base group-hover/btn:scale-105 transition-transform">
                      <ScrambleText text={plan.cta} delay={cardDelay + 0.4} trigger={isLoaded} /> →
                    </Sticker>
                  </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* --- FOOTER --- */}
      <div className="max-w-7xl mx-auto px-6 mt-24 text-center pb-10 relative z-10">
        <Sticker rot={-1} tone="black" className="px-4 py-2 text-xs md:text-sm tracking-widest">CAUTION BADGE : 20€ &nbsp;|&nbsp; ACCÈS IMMÉDIAT</Sticker>
      </div>
    </main>
  );
}