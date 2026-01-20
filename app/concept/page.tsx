'use client';
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Lock, Zap, MapPin, Trophy, Dumbbell } from "lucide-react";
import AccessBadge3D from "../../components/AccessBadge3D"; 

gsap.registerPlugin(ScrollTrigger);

// --- DONNÉES COACHS ---
const COACHES = [
  {
    id: 1,
    name: "ALEX",
    role: "HEAD COACH",
    specialty: "PROGRAMMATION & PERFORMANCE",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", 
    stats: { force: 95, cardio: 88, tech: 92 }
  },
  {
    id: 2,
    name: "SARAH",
    role: "COACH GYM",
    specialty: "GYMNASTIQUE & MOBILITÉ",
    image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=800&auto=format&fit=crop", 
    stats: { force: 80, cardio: 90, tech: 98 }
  },
  {
    id: 3,
    name: "THOMAS",
    role: "COACH HALTERO",
    specialty: "HALTEROPHILIE & FORCE",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop", 
    stats: { force: 99, cardio: 75, tech: 90 }
  },
  {
    id: 4,
    name: "JULIE",
    role: "COACH HYROX",
    specialty: "ENDURANCE & MENTAL",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop", 
    stats: { force: 85, cardio: 99, tech: 85 }
  }
];

export default function ConceptPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. HERO REVEAL
      const tl = gsap.timeline();
      tl.from(".hero-title-char", { 
        y: 120, opacity: 0, rotate: 5, stagger: 0.05, duration: 1, ease: "power4.out" 
      })
      .from(".hero-subtitle", { 
        opacity: 0, y: 20, duration: 0.8 
      }, "-=0.5");

      // 2. COACHES REVEAL
      gsap.from(".coach-card", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".coaches-grid",
          start: "top 80%"
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white overflow-hidden">
      
      {/* --- SECTION 1: HERO (LA BOX) --- */}
      <section className="relative h-[80vh] flex flex-col justify-center px-6 md:px-12 border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto w-full">
           <div className="overflow-hidden mb-4">
             {/* TITRE : LA BOX (Terme officiel CrossFit) */}
             <h1 className="font-display text-[15vw] leading-[0.8] uppercase flex flex-wrap gap-4">
               {["L", "A", "\u00A0", "B", "O", "X"].map((char, i) => (
                 <span key={i} className="hero-title-char inline-block text-white">
                   {char}
                 </span>
               ))}
             </h1>
           </div>
           
           <div className="hero-subtitle flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/20 pt-8 mt-8">
             <p className="max-w-md text-gray-400 font-body text-lg leading-relaxed">
               Un espace industriel brut de 800m².
               <br/>
               Ici, on ne vient pas pour se montrer, on vient pour s'entraîner.
               <span className="text-primary font-medium block mt-2">Haute intensité. Communauté. Résultats.</span>
             </p>
             <div className="flex items-center gap-2 mt-6 md:mt-0 text-primary font-display tracking-widest uppercase">
               <MapPin size={18} />
               <span>4 Rue de Lisbonne, Illzach</span>
             </div>
           </div>
        </div>
      </section>


      {/* --- SECTION 2: OPEN GYM (BADGE 3D) --- */}
      <section className="access-section py-32 px-6 md:px-12 relative overflow-hidden">
        {/* Fond lumineux rouge subtil */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-32">
          
          {/* GAUCHE : LE BADGE 3D */}
          <div className="w-full md:w-1/2 flex justify-center h-[500px] md:h-[600px]">
             <AccessBadge3D />
          </div>

          {/* DROITE : TEXTE */}
          <div className="w-full md:w-1/2">
             <div className="flex items-center gap-3 mb-6">
               <Clock className="text-primary" />
               <span className="font-display tracking-widest text-sm uppercase text-gray-400">Accès Badge</span>
             </div>
             
             <h2 className="font-display text-5xl md:text-7xl mb-8 leading-none">
               OPEN<br/>
               <span className="text-primary">GYM</span>
             </h2>
             
             <p className="font-body text-gray-400 text-lg leading-relaxed mb-8">
               Votre entraînement ne doit pas dépendre de nos horaires de cours.
               <br/><br/>
               Grâce au système de badge, accédez à la Box <strong>7j/7 de 6h à 22h</strong>.
               Perfectionnez votre technique, suivez votre propre programmation ou rattrapez un WOD.
               L'équipement est à votre disposition.
             </p>

             <ul className="grid grid-cols-2 gap-4 mb-10">
               <li className="flex items-center gap-3 border border-white/10 p-4 rounded bg-white/5">
                 <Lock size={20} className="text-primary" />
                 <span className="text-sm font-display uppercase">Accès Sécurisé</span>
               </li>
               <li className="flex items-center gap-3 border border-white/10 p-4 rounded bg-white/5">
                 <Dumbbell size={20} className="text-primary" />
                 <span className="text-sm font-display uppercase">Zone Libre</span>
               </li>
             </ul>

             <button className="px-8 py-4 border border-white text-white font-display uppercase tracking-widest hover:bg-white hover:text-black transition-all">
               Voir les abonnements
             </button>
          </div>
        </div>
      </section>


      {/* --- SECTION 3: LE STAFF (COACHS) --- */}
      <section className="py-32 px-6 md:px-12 bg-[#080808] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="font-display text-5xl md:text-7xl mb-4">LE STAFF</h2>
            <p className="text-gray-400 font-body text-lg">Certifiés. Techniques. Dévoués.</p>
          </div>

          {/* GRID COACHS */}
          <div className="coaches-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COACHES.map((coach) => (
              <div key={coach.id} className="coach-card group relative h-[500px] bg-[#050505] border border-white/10 overflow-hidden cursor-pointer">
                
                {/* IMAGE */}
                <div className="absolute inset-0 transition-all duration-500 ease-out group-hover:scale-105">
                   <img 
                     src={coach.image} 
                     alt={coach.name} 
                     className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                   />
                </div>

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500"></div>

                {/* INFOS */}
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-end justify-between border-b border-white/20 pb-4 mb-4">
                    <div>
                      <h3 className="font-display text-4xl text-white italic uppercase">{coach.name}</h3>
                      <p className="font-display text-primary text-xs tracking-widest">{coach.role}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <Trophy size={20} className="text-white" />
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                     <p className="text-gray-300 text-xs uppercase tracking-wide mb-4 font-bold">{coach.specialty}</p>
                     
                     <div className="space-y-3 text-[10px] font-mono text-gray-400">
                       <div className="flex items-center gap-2">
                         <span className="w-12">FORCE</span>
                         <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${coach.stats.force}%` }}></div>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-12">CARDIO</span>
                         <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${coach.stats.cardio}%` }}></div>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-12">TECH</span>
                         <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${coach.stats.tech}%` }}></div>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Cadre Rouge */}
                <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}