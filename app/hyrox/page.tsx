'use client';
import { useEffect, useRef } from 'react';
import { Play, TrendingUp, Timer, Dumbbell, Users, User } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HyroxPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  const stations = [
    { id: '01', name: 'SKI ERG', dist: '1000m', desc: 'Tout commence par les bras. Gestion de l\'acide lactique immédiate.', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop' },
    { id: '02', name: 'SLED PUSH', dist: '50m', desc: 'Poussée de traîneau lourd. La force pure rencontre le cardio.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop' },
    { id: '03', name: 'SLED PULL', dist: '50m', desc: 'Tirage de traîneau. Dos, biceps et fessiers en feu.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop' },
    { id: '04', name: 'BURPEES BROAD JUMP', dist: '80m', desc: 'L\'épreuve mentale par excellence. Sauter, ramper, répéter.', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop' },
    { id: '05', name: 'ROWING', dist: '1000m', desc: 'Le rameur. Rester lucide, garder le rythme malgré la fatigue.', image: 'https://images.unsplash.com/photo-1540497077202-7c8a33801524?q=80&w=1000&auto=format&fit=crop' },
    { id: '06', name: 'FARMERS CARRY', dist: '200m', desc: 'Marche du fermier avec Kettlebells. Grip et gainage à l\'épreuve.', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop' },
    { id: '07', name: 'SANDBAG LUNGES', dist: '100m', desc: 'Fentes avec sac de sable. Les jambes tremblent, le mental tient.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop' },
    { id: '08', name: 'WALL BALLS', dist: '75 / 100 reps', desc: 'Le final. Squat, lancer, précision. Jusqu\'à la dernière rep.', image: 'https://images.unsplash.com/photo-1532029837066-805e45167275?q=80&w=1000&auto=format&fit=crop' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // --- HERO ---
      const tl = gsap.timeline();
      tl.from(".hero-title-char", { y: 150, opacity: 0, rotate: 5, stagger: 0.1, duration: 1.2, ease: "power4.out" })
        .from(".hero-fade", { y: 20, opacity: 0, stagger: 0.2, duration: 0.8 }, "-=0.8");

      // --- LINE ---
      gsap.fromTo(".red-line-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline-container", start: "top center", end: "bottom center", scrub: true } });

      // --- STATIONS ---
      const stationsRefs = gsap.utils.toArray('.station-row');
      stationsRefs.forEach((station: any) => {
        gsap.from(station, { y: 100, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: station, start: "top 85%" } });
      });

      // --- PARALLAX ---
      const images = gsap.utils.toArray('.parallax-img');
      images.forEach((img: any) => {
        gsap.to(img, { y: "20%", ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // --- TRAINING REVEAL ---
      const texts = gsap.utils.toArray('.reveal-text');
      texts.forEach((text: any) => {
        gsap.fromTo(text, 
          { y: "100%", skewY: 7 }, 
          { y: "0%", skewY: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: text.parentElement, start: "top 80%" } }
        );
      });

      gsap.from(".training-item", {
        x: -50, opacity: 0, stagger: 0.1, duration: 0.8,
        scrollTrigger: { trigger: ".training-list", start: "top 80%" }
      });

      // --- NEW: CTA SCROLL ANIMATION (Split & Converge) ---
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cta-section", // On déclenche sur la section
          start: "top 80%",        // Quand le haut de la section est à 80% de l'écran
          end: "center center",    // Jusqu'à ce qu'elle soit au centre
          scrub: 1,                // Mouvement fluide lié au scroll
        }
      });

      ctaTl
        .from(".cta-text-1", { x: -150, opacity: 0, filter: "blur(10px)" }, 0) // Vient de gauche
        .from(".cta-text-2", { x: 150, opacity: 0, filter: "blur(10px)" }, 0); // Vient de droite (en même temps)

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="min-h-screen bg-bg text-white selection:bg-primary selection:text-white overflow-hidden">
      
      {/* SECTION HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=2070&auto=format&fit=crop" alt="Hyrox Hero" className="w-full h-full object-cover opacity-30 parallax-img scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"></div>
        <div className="relative z-10 text-center px-6">
          <div className="hero-fade inline-block border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1 mb-6 rounded-full">
            <span className="font-display text-primary tracking-widest text-sm uppercase">Official Affiliate Gym</span>
          </div>
          <div className="overflow-hidden mb-[-2vw]">
            <h1 className="font-display text-[15vw] md:text-[12vw] leading-[0.8] text-white uppercase mix-blend-overlay flex justify-center gap-[1vw]">
              {['H','Y','R','O','X'].map((char, i) => (<span key={i} className="hero-title-char inline-block">{char}</span>))}
            </h1>
          </div>
          <h2 className="hero-fade font-display text-4xl md:text-6xl text-transparent stroke-text text-white/20">WORLD SERIES OF FITNESS</h2>
          <div className="hero-fade mt-12 flex flex-col md:flex-row gap-8 justify-center items-center font-body text-gray-400 max-w-2xl mx-auto">
            <div className="flex items-center gap-3"><TrendingUp className="text-primary" /><span>8km de Course</span></div>
            <div className="hidden md:block w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-3"><Dumbbell className="text-primary" /><span>8 WODs Fonctionnels</span></div>
            <div className="hidden md:block w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-3"><Timer className="text-primary" /><span>1 Seul Chrono</span></div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hero-fade">
          <span className="text-[10px] uppercase tracking-widest">The Race</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* SECTION CIRCUIT */}
      <section className="py-24 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
                <h3 className="font-display text-5xl md:text-7xl mb-6">LE CIRCUIT</h3>
                <div className="flex justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 rounded uppercase font-display tracking-widest text-sm"><User size={16} className="text-primary" /><span>Solo</span></div>
                  <div className="flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 rounded uppercase font-display tracking-widest text-sm"><Users size={16} className="text-primary" /><span>Duo / Double</span></div>
                </div>
                <p className="text-gray-400 max-w-xl mx-auto font-body">8 tours. 1km run. 1 workout.</p>
            </div>
            <div className="relative mt-32 timeline-container">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2"></div>
                <div className="red-line-fill absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#FF3300] -translate-x-1/2 origin-top shadow-[0_0_10px_#FF3300]"></div>
                <div className="space-y-16 pb-24">
                    {stations.map((station, index) => (
                        <div key={station.id} className="relative">
                            <div className="station-row flex justify-center items-center mb-16 relative z-10">
                                <div className="bg-[#050505] border border-primary text-primary px-6 py-2 font-display text-xl italic tracking-widest shadow-[0_0_15px_rgba(255,51,0,0.3)]">1000M RUN</div>
                            </div>
                            <div className={`station-row relative flex flex-col md:flex-row items-center gap-8 md:gap-24 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="w-full md:w-1/2 aspect-video bg-[#111] border border-white/10 relative group overflow-hidden">
                                    <div className="absolute inset-0 overflow-hidden"><img src={station.image} alt={station.name} className="parallax-img w-full h-[120%] object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" style={{ transform: 'translateY(-10%)' }} /></div>
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-white/10 font-display text-[120px] leading-none z-20 pointer-events-none select-none">{station.id}</div>
                                </div>
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-[#050505] border-2 border-white rounded-full z-20 group-hover:border-primary transition-colors"></div>
                                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <h4 className="font-display text-4xl uppercase text-white mb-2">{station.name}</h4>
                                    <div className={`inline-block bg-white/5 px-3 py-1 mb-4 text-sm tracking-widest uppercase text-primary border border-primary/20`}>{station.dist}</div>
                                    <p className="text-gray-400 font-body leading-relaxed max-w-sm ml-0 md:ml-[inherit]">{station.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="station-row flex justify-center pt-16"><div className="text-5xl md:text-7xl font-display text-transparent stroke-text text-white/30 tracking-widest">FINISH LINE</div></div>
                </div>
            </div>
        </div>
      </section>

      {/* SECTION TRAINING */}
      <section className="py-24 bg-[#0A0A0A] border-y border-white/5 relative z-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="font-display text-5xl md:text-7xl mb-8 leading-none">
              <div className="overflow-hidden"><div className="reveal-text">PRÉPARER</div></div>
              <div className="overflow-hidden"><div className="reveal-text text-primary">L'IMPOSSIBLE.</div></div>
            </h3>
            <div className="overflow-hidden mb-8"><p className="reveal-text text-gray-400 font-body text-lg">Hyrox ne demande pas d'être le meilleur coureur ou le plus fort haltérophile. Hyrox demande d'être complet.</p></div>
            <ul className="space-y-4 mb-10 training-list">
              {['Endurance Fondamentale', 'Résistance Lactique', 'Force Fonctionnelle', 'Stratégie de Course'].map((item) => (
                <li key={item} className="training-item flex items-center gap-3 font-display tracking-wide group cursor-default">
                  <div className="w-1.5 h-1.5 bg-primary group-hover:scale-150 transition-transform"></div>
                  <span className="group-hover:text-white transition-colors text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
            <button className="group px-8 py-4 bg-white text-black font-display uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 relative overflow-hidden">
              <span className="relative z-10">Voir le Planning</span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#050505] p-8 border border-white/10 flex flex-col items-center justify-center text-center hover:border-primary transition-colors duration-500 group reveal-text delay-100">
                <span className="font-display text-5xl text-white mb-2 group-hover:text-primary transition-colors">50%</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Running</span>
             </div>
             <div className="bg-[#050505] p-8 border border-white/10 flex flex-col items-center justify-center text-center hover:border-primary transition-colors duration-500 group reveal-text delay-200">
                <span className="font-display text-5xl text-white mb-2 group-hover:text-primary transition-colors">50%</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Functional</span>
             </div>
             <div className="col-span-2 bg-primary p-8 flex items-center justify-between group cursor-pointer hover:bg-white transition-colors duration-300 reveal-text delay-300">
                <div><span className="block font-display text-3xl text-black">SIMULATIONS</span><span className="text-black/70 text-sm">Organisées chaque trimestre</span></div>
                <Play className="text-black transform group-hover:translate-x-2 transition-transform" fill="currentColor" />
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: CTA (AVEC EFFET SCROLL) --- */}
      <section className="cta-section h-[80vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-[#050505]">
        
        {/* FOND : Grille Tactique */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
               backgroundSize: '100px 100px' 
             }}>
        </div>

        {/* EFFET RADAR */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s]"></div>
        
        {/* Centre Fixe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary/30 rounded-full z-0 flex items-center justify-center">
             <div className="w-[280px] h-[1px] bg-primary/20 absolute"></div>
             <div className="h-[280px] w-[1px] bg-primary/20 absolute"></div>
        </div>

        {/* CONTENU AVEC CLASSES D'ANIMATION */}
        <h2 className="relative z-10 font-display text-[12vw] leading-[0.85] text-white mb-8 mix-blend-screen">
          {/* Ligne 1 : Vient de la gauche */}
          <span className="cta-text-1 inline-block">YOUR RACE.</span><br/>
          {/* Ligne 2 : Vient de la droite (avec outline rouge) */}
          <span className="cta-text-2 inline-block text-transparent" style={{ WebkitTextStroke: '2px #FF3300' }}>
            YOUR PACE.
          </span>
        </h2>
        
        <button className="group relative z-10 mt-4 px-14 py-6 bg-transparent border border-primary text-primary font-display text-xl uppercase tracking-widest overflow-hidden transition-all duration-300 hover:text-white hover:border-transparent">
          <span className="relative z-10">Rejoindre la Team</span>
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
        </button>

      </section>

    </main>
  );
}