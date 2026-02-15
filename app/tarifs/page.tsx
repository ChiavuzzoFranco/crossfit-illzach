'use client';
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pour la redirection
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
      features: ["2 Cours / Semaine", "Accès à tous les cours", "Hyrox Inclus", "Badge Accès 6h-22h"],
      cta: "CHOISIR", 
      popular: false
    },
    {
      id: 1, 
      name: "3 SEANCES", 
      tagline: "PAR SEMAINE",
      priceMonthly: 85, 
      priceAnnual: 75,
      features: ["3 Cours / Semaine", "Accès à tous les cours", "Hyrox Inclus", "Badge Accès 6h-22h"],
      cta: "CHOISIR", 
      popular: false
    },
    {
      id: 2, 
      name: "ILLIMITE", 
      tagline: "ALL ACCESS",
      priceMonthly: 109, 
      priceAnnual: 89,
      features: ["WODs Illimités", "Hyrox Illimité", "Open Gym 7j/7", "Badge Inclus", "Suivi Nutrition"],
      cta: "DEVENIR MEMBRE", 
      popular: true
    },
    {
      id: 3, 
      name: "FORCES", 
      tagline: "POLICE / POMPIER / MILITAIRE",
      priceMonthly: 50, 
      priceAnnual: 50, // Prix fixe
      features: ["Accès Illimité", "Hyrox Inclus", "Badge 6h-22h", "Engagement 1 an", "Justificatif Req."],
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
    setTimeout(() => setIsLoaded(true), 100);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050505] text-white pt-32 pb-20 relative overflow-hidden selection:bg-primary selection:text-white">
      
      {/* --- FOND AMBIANCE (Spotlight) --- */}
      <div className="fixed inset-0 pointer-events-none transition-colors duration-1000 ease-out z-0"
        style={{ background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, ${hoveredCard === 2 ? 'rgba(255, 51, 0, 0.12)' : 'rgba(255, 255, 255, 0.04)'}, transparent 50%)` }} />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 text-center">
         <div className="overflow-hidden mb-8">
           <h1 className="hero-title font-display text-[11vw] md:text-[9vw] leading-[0.8] uppercase text-white">
             REJOINDRE
           </h1>
         </div>
         
         {/* Toggle Annuel / Mensuel */}
         <div className="switch-anim flex justify-center items-center gap-8 mt-4">
            <span onClick={() => setIsAnnual(false)} className={`text-sm uppercase tracking-widest cursor-pointer transition-colors font-display ${!isAnnual ? 'text-white' : 'text-gray-600'}`}>
              Sans Engagement
            </span>
            <button onClick={() => setIsAnnual(!isAnnual)} className="w-16 h-8 border border-white/20 rounded-full relative p-1 cursor-pointer hover:border-white/50 transition-colors">
              <div className={`h-full rounded-full bg-primary transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAnnual ? 'w-[50%] ml-auto' : 'w-[50%]'}`}></div>
            </button>
            <span onClick={() => setIsAnnual(true)} className={`text-sm uppercase tracking-widest cursor-pointer transition-colors font-display ${isAnnual ? 'text-primary' : 'text-gray-600'}`}>
              12 Mois <span className="text-[10px] ml-1 opacity-60">(-20€)</span>
            </span>
         </div>
      </div>

      {/* --- GRILLE DES PRIX --- */}
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10" onMouseLeave={() => setHoveredCard(null)}>
        {PLANS.map((plan, index) => {
          // Délai unique pour l'effet de décodage
          const cardDelay = 0.5 + (index * 0.1);

          return (
            <div key={plan.id} onMouseEnter={() => setHoveredCard(plan.id)}
              className={`pricing-wrapper relative group transition-all duration-500 ${hoveredCard !== null && hoveredCard !== plan.id ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}
            >
              {/* Carte */}
              <div className={`h-full relative p-8 border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-white/30 transition-all duration-500 flex flex-col`}>
                  
                  {/* HEADER CARD */}
                  <div className="mb-10 min-h-[90px]">
                     {plan.popular && <div className="inline-block text-primary text-[10px] uppercase tracking-widest mb-3 border border-primary/30 px-3 py-1 rounded-full">Best Seller</div>}
                     {plan.special && <div className="inline-block text-gray-400 text-[10px] uppercase tracking-widest mb-3 border border-white/20 px-3 py-1 rounded-full">Service Public</div>}
                     
                     <h3 className="font-display text-3xl mb-1 text-white tracking-wide">
                       <ScrambleText text={plan.name} delay={cardDelay} trigger={isLoaded} />
                     </h3>
                     <p className="text-gray-400 text-[10px] font-sans tracking-widest uppercase">
                       {plan.tagline}
                     </p>
                  </div>

                  {/* PRIX (Scramble Effect Réactif) */}
                  <div className="mb-10 relative">
                     <div className="flex items-start -ml-2 text-white">
                        <span className="text-2xl font-display mt-2 opacity-50">€</span>
                        <span className={`text-7xl lg:text-8xl leading-[0.8] font-display tracking-tighter ${plan.popular ? 'text-primary' : ''}`}>
                          <AnimatedPrice value={plan.special ? 50 : (isAnnual ? plan.priceAnnual : plan.priceMonthly)} delay={cardDelay + 0.2} />
                        </span>
                     </div>
                     <p className="text-gray-400 text-xs mt-3 pl-2 font-sans uppercase tracking-widest">
                        {plan.special ? '/ AN' : (isAnnual ? '/ MOIS' : '/ MOIS (LIBRE)')}
                     </p>
                  </div>

                  {/* FEATURES (Apparition GSAP) */}
                  <ul className="flex-1 space-y-4 mb-10 border-t border-white/5 pt-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="feature-item flex items-start gap-3 text-gray-400 group-hover:text-white transition-colors">
                        <Check size={14} className={`mt-0.5 ${plan.popular ? 'text-primary' : 'text-gray-600'}`} />
                        <span className="text-xs font-sans uppercase tracking-wide leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA BUTTON (Avec Redirection) */}
                  <button 
                    onClick={() => handleSelectPlan(plan.name)} // <-- REDIRECTION ACTIVÉE
                    className={`
                     w-full py-5 border
                     font-display uppercase tracking-widest text-xs 
                     transition-all duration-300 group/btn
                     ${plan.popular 
                        ? 'bg-primary text-white border-primary hover:bg-white hover:text-black hover:border-white' 
                        : 'border-white/20 text-white hover:bg-white hover:text-black hover:border-white'
                     }
                  `}>
                    <ScrambleText text={plan.cta} delay={cardDelay + 0.4} trigger={isLoaded} />
                  </button>

              </div>
            </div>
          )
        })}
      </div>

      {/* --- FOOTER --- */}
      <div className="max-w-7xl mx-auto px-6 mt-20 text-center border-t border-white/5 pt-12 pb-20">
        <p className="text-gray-400 text-xs font-sans uppercase tracking-widest">
          CAUTION BADGE : 20€ &nbsp;|&nbsp; ACCÈS IMMÉDIAT
        </p>
      </div>
    </main>
  );
}