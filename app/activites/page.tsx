'use client';
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "../../components/TransitionLink"; 
import Image from "next/image";
import { ArrowUpRight, Clock, Target, Zap, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- COMPOSANT UTILITAIRE POUR L'ANIMATION AU SCROLL DANS LA MODALE ---
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <div 
      ref={ref}
      style={{ 
        transform: isInView ? "none" : "translateY(30px)",
        opacity: isInView ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`
      }}
    >
      {children}
    </div>
  );
}

// --- DONNÉES ---
const CLASSES = [
  {
    id: "wod",
    title: "W.O.D",
    subtitle: "Workout Of the Day",
    desc: "Le cœur de notre méthode.",
    longDescription: "Le WOD est l'essence même du CrossFit. C'est un combat contre vous-même, différent chaque jour. Nous mélangeons gymnastique, cardio et haltérophilie pour créer l'athlète ultime.",
    focus: "Polyvalence & Intensité",
    structure: "Briefing • Skill • WOD (15-20min) • Cool Down",
    tags: ["Intensité", "Complet"],
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200", 
    images: [
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800",
      "https://images.unsplash.com/photo-1517963879466-e1b54ebd5914?q=80&w=800"
    ]
  },
  {
    id: "haltero",
    title: "HALTÉROPHILIE",
    subtitle: "Technique & Posture",
    desc: "Apprenez à placer votre dos.",
    longDescription: "L'art de déplacer une charge du sol au-dessus de la tête. Ici, on ne cherche pas à soulever lourd tout de suite, on cherche la trajectoire parfaite. La puissance vient de la technique.",
    focus: "Explosivité & Trajectoire",
    structure: "Mobilité Spécifique • Technique Barre à vide • Complex • Charges lourdes",
    tags: ["Technique", "Puissance"],
    cover: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1522898467493-49726bf28798?q=80&w=800",
      "https://images.unsplash.com/photo-1517963879466-e1b54ebd5914?q=80&w=800",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800"
    ]
  },
  {
    id: "gym",
    title: "GYMNASTIQUE",
    subtitle: "Maîtrise du corps",
    desc: "Se suspendre, tenir en équilibre.",
    longDescription: "Avant de déplacer des objets, apprenez à déplacer votre corps. La Gymnastique CrossFit vous apprend à dominer la gravité : tractions, appuis tendus renversés (Handstand), muscle-ups.",
    focus: "Gainage & Agilité",
    structure: "Warm up Articulaire • Renforcement Strict • Skill Technique • Metcon Gym",
    tags: ["Agilité", "Gainage"],
    cover: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800"
    ]
  },
  {
    id: "fbb",
    title: "FBB",
    subtitle: "Renforcement",
    desc: "Protéger vos articulations.",
    longDescription: "Functional Body Building. C'est l'assurance vie de vos articulations. On travaille les muscles profonds, l'unilatéral et le contrôle pour corriger les déséquilibres et prévenir les blessures.",
    focus: "Hypertrophie & Santé",
    structure: "Tempo lent • Charges modérées • Isolation • Qualité de mouvement",
    tags: ["Santé", "Esthétique"],
    cover: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?q=80&w=800",
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800"
    ]
  },
  {
    id: "hiit",
    title: "HIIT",
    subtitle: "High Intensity Interval Training",
    desc: "Brûlez un max en un minimum de temps.",
    longDescription: "Des intervalles courts à haute intensité suivis de phases de récupération. Le HIIT est le format le plus efficace pour brûler des calories, améliorer votre capacité cardiovasculaire et booster votre métabolisme. Accessible à tous niveaux, chaque exercice est adaptable.",
    focus: "Cardio & Brûlage",
    structure: "Warm up • Circuits (30s effort / 15s repos) • 3-5 rounds • Stretching",
    tags: ["Cardio", "Brûlage"],
    cover: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1517963879466-e1b54ebd5914?q=80&w=800",
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800"
    ]
  },
  {
    id: "hyrox",
    title: "HYROX",
    subtitle: "Endurance",
    desc: "Course à pied et mouvements.",
    longDescription: "Le mélange parfait entre la course à pied et les mouvements fonctionnels (Rameur, SkiErg, Wall Balls). Pas de charges lourdes, pas de gymnastique complexe. Juste du souffle et du mental.",
    focus: "Cardio & Volume",
    structure: "Running • Ergos (Machines) • Mouvements simples • Longue durée (30-45min)",
    tags: ["Cardio", "Mental"],
    cover: "https://images.unsplash.com/photo-1552674605-46d538e1b1d1?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1530263503756-b371f6d393fd?q=80&w=800",
      "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=800",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
      "https://images.unsplash.com/photo-1552674605-46d538e1b1d1?q=80&w=800"
    ]
  },
  {
    id: "team",
    title: "TEAM WOD",
    subtitle: "L'esprit d'équipe",
    desc: "On s'entraîne par équipe.",
    longDescription: "Le samedi, on ne souffre pas seul. En équipe de 2 ou 3, vous partagez l'effort, la stratégie et la sueur. C'est le moment le plus convivial de la semaine, où la communauté prend tout son sens.",
    focus: "Fun & Cohésion",
    structure: "Équipes • Synchro • Stratégie • Dépassement collectif",
    tags: ["Cohésion", "Fun"],
    cover: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?q=80&w=800",
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800"
    ]
  }
];

export default function Concept() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null); 
  const [selectedClass, setSelectedClass] = useState<any>(null);
  
  // --- GESTION DU SCROLL LOCK (BODY) ---
  useEffect(() => {
    if (selectedClass) { 
      document.body.style.overflow = 'hidden'; 
    } else { 
      document.body.style.overflow = 'auto'; 
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedClass]);

  // --- ANIMATIONS PAGE PRINCIPALE ---
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Hero
      gsap.fromTo(".hero-reveal", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
      // Cards
      ScrollTrigger.batch(".step-card", {
        start: "top 85%", 
        onEnter: (elements) => gsap.fromTo(elements, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }),
        once: true 
      });
      // Liste
      ScrollTrigger.batch(".list-item", {
        start: "top 90%",
        onEnter: (elements) => gsap.fromTo(elements, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }),
        once: true
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // --- ANIMATIONS OUVERTURE MODALE ---
  useEffect(() => {
    if (selectedClass && modalRef.current) {
        // Reset scroll position
        const scrollContainer = modalRef.current.querySelector('.modal-scroll-container');
        if (scrollContainer) scrollContainer.scrollTop = 0;

        // Open Animation
        const tl = gsap.timeline();
        gsap.set(modalRef.current, { yPercent: 100, display: "block" });
        tl.to(modalRef.current, { yPercent: 0, duration: 0.6, ease: "expo.out" });
        
        // Header Reveal
        tl.fromTo(".modal-header-reveal", 
            { y: -20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6 }, "-=0.2"
        );
    }
  }, [selectedClass]);

  const closeModal = () => {
    if (modalRef.current) {
        gsap.to(modalRef.current, {
          yPercent: 100, duration: 0.5, ease: "power3.in",
          onComplete: () => { 
            gsap.set(modalRef.current, { display: "none" }); 
            setSelectedClass(null);
          }
        });
    }
  };

  // --- GESTION SOURIS DESKTOP ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;
    
    const target = e.currentTarget as HTMLElement;
    const imgContainer = target.querySelector('.hover-reveal-img') as HTMLElement;
    if(!imgContainer) return;
    
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    
    gsap.to(imgContainer, { x: x, y: y, xPercent: -50, yPercent: -50, duration: 0.5, ease: "power3.out" });
  };
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;
    const target = e.currentTarget as HTMLElement;
    const imgContainer = target.querySelector('.hover-reveal-img');
    gsap.to(".list-item", { opacity: 0.3, duration: 0.4 });
    gsap.to(target, { opacity: 1, duration: 0.4 });
    gsap.to(imgContainer, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
  };
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;
    const target = e.currentTarget as HTMLElement;
    const imgContainer = target.querySelector('.hover-reveal-img');
    gsap.to(".list-item", { opacity: 1, duration: 0.4 });
    gsap.to(imgContainer, { opacity: 0, scale: 0.5, duration: 0.3, ease: "power2.in" });
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050505] text-white pt-32 pb-20 relative">
      
      {/* --- PAGE PRINCIPALE --- */}
      <div className="px-6 md:px-12 mb-20 md:mb-32">
        <h1 className="font-display text-[12vw] leading-[0.8] mb-8 text-white uppercase">
          <span className="hero-reveal block">Notre</span>
          <span className="hero-reveal block text-primary">Méthode</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <p className="hero-reveal font-body text-xl text-gray-400 leading-relaxed">
              Le CrossFit chez nous n'est pas une compétition. C'est une méthodologie conçue pour vous rendre plus fort.
            </p>
            <div className="hero-reveal flex items-end md:justify-end">
                <span className="text-primary font-display text-lg uppercase tracking-widest border-b border-primary pb-1">Sport Santé</span>
            </div>
        </div>
      </div>

      {/* SEANCE TYPE */}
      <section className="timeline-section px-6 md:px-12 mb-32 md:mb-48">
         <div className="border-t border-white/20 pt-12">
            <h2 className="font-display text-2xl md:text-4xl mb-16 text-white uppercase">UNE SÉANCE TYPE (1H)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[{step:"01", title:"BRIEFING", txt:"Explication des objectifs."}, {step:"02", title:"SKILL", txt:"Apprentissage technique."}, {step:"03", title:"LE W.O.D", txt:"L'effort du jour."}].map((s, i) => (
                   <div key={i} className="step-card opacity-0 group relative p-8 border border-white/10 hover:border-primary transition-colors bg-[#0a0a0a]">
                      <span className="font-display text-6xl text-white/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors">{s.step}</span>
                      <h3 className="font-display text-2xl text-white group-hover:text-primary transition-colors mb-4">{s.title}</h3>
                      <p className="font-body text-gray-400 text-sm leading-relaxed">{s.txt}</p>
                   </div>
               ))}
            </div>
         </div>
      </section>

      {/* LISTE */}
      <section className="list-container px-6 md:px-12 mb-32 max-w-[1600px] mx-auto">
        <div className="mb-12">
            <h2 className="font-display text-sm text-gray-500 uppercase tracking-widest mb-2">Nos Programmes</h2>
            <p className="font-body text-2xl text-white">Quelle discipline est faite pour vous ?</p>
        </div>
        <div className="flex flex-col border-t border-white/10">
          {CLASSES.map((item, index) => (
            <div key={item.id} onClick={() => setSelectedClass(item)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}
              className="list-item opacity-0 group relative py-8 md:py-12 border-b border-white/10 cursor-pointer interactive flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-300 overflow-hidden"
            >
               <div className="hover-reveal-img absolute top-0 left-0 w-[450px] h-[300px] z-10 pointer-events-none opacity-0 scale-50 hidden md:block">
                  <div className="relative w-full h-full overflow-hidden shadow-2xl rounded-lg border border-white/10">
                     <Image src={item.cover} alt={item.title} fill className="object-cover" />
                  </div>
               </div>
               <div className="w-full h-[200px] relative mb-6 block md:hidden rounded-lg overflow-hidden border border-white/10">
                   <Image src={item.cover} alt={item.title} fill className="object-cover" />
               </div>
               <div className="relative z-20 w-full md:w-1/3 pointer-events-none">
                 <div className="flex items-center">
                    <span className="text-primary font-display text-sm md:text-xl mr-4">0{index + 1}</span>
                    <h2 className="font-display text-3xl md:text-6xl uppercase text-white transition-colors duration-300 group-hover:text-gray-300 md:group-hover:text-white">{item.title}</h2>
                 </div>
               </div>
               <div className="relative z-20 w-full md:w-1/3 text-left md:text-right pointer-events-none mt-4 md:mt-0 md:pl-0">
                  <p className="font-body text-gray-400 text-xs md:text-sm mb-3 md:mb-2">{item.subtitle}</p>
                  <div className="flex justify-start md:justify-end gap-2">
                    {item.tags.map((tag:string) => <span key={tag} className="border border-white/20 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-500 group-hover:text-white group-hover:border-white transition-colors">{tag}</span>)}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="px-6 md:px-12 text-center pb-32">
         <TransitionLink href="/contact" className="bg-primary text-white px-8 py-4 font-display uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
           Réserver ma séance d'essai
         </TransitionLink>
      </section>

      {/* --- MODALE ÉDITORIALE (FIX SCROLL) --- */}
      <div 
        ref={modalRef}
        className="fixed inset-0 z-[10050] h-[100dvh] w-screen bg-[#050505] hidden"
        // Stop la propagation du scroll ici pour éviter que ça remonte au body
        onWheel={(e) => e.stopPropagation()} 
      >
        {/* HEADER MODALE FIXE */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent z-50 pointer-events-none">
             <div className="modal-header-reveal opacity-0 pointer-events-auto">
                 <h2 className="font-display text-lg md:text-2xl uppercase text-white tracking-widest">{selectedClass?.title}</h2>
             </div>
             <button onClick={closeModal} className="pointer-events-auto group border border-white/20 bg-black/40 backdrop-blur-md rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer modal-header-reveal opacity-0">
                <X size={20} />
             </button>
        </div>

        {/* CONTENU SCROLLABLE (C'est ici que le scroll doit marcher) */}
        {/* AJOUT DE 'data-lenis-prevent' POUR STOPER LENIS SI PRÉSENT */}
        <div 
            className="modal-scroll-container h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar"
            data-lenis-prevent="true"
            style={{ overscrollBehavior: 'contain' }}
        >
            
            {selectedClass && (
                <>
                    {/* 1. HERO IMAGE (Parallax Effect simulé) */}
                    <div className="relative w-full h-[60vh] md:h-[75vh]">
                        <Image src={selectedClass.cover} alt="Cover" fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                            <FadeInSection>
                                <h1 className="font-display text-4xl md:text-7xl uppercase text-white mb-4 leading-none">{selectedClass.subtitle}</h1>
                                <div className="flex flex-wrap gap-4">
                                    {selectedClass.tags.map((tag:string) => (
                                        <span key={tag} className="bg-primary text-white px-3 py-1 text-xs uppercase tracking-widest font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </FadeInSection>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
                        
                        {/* 2. DESCRIPTION */}
                        <FadeInSection delay={0.2}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start mb-24">
                                <div>
                                    <h3 className="font-display text-xl md:text-2xl text-primary mb-6 flex items-center gap-3">
                                    <ArrowUpRight /> L'OBJECTIF
                                    </h3>
                                    <p className="font-body text-lg md:text-2xl text-gray-200 leading-relaxed">
                                        {selectedClass.longDescription}
                                    </p>
                                </div>
                                <div className="space-y-8 bg-white/[0.03] p-8 border border-white/10 rounded-lg backdrop-blur-sm">
                                    <div>
                                        <h4 className="font-display text-xs text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Target size={14}/> FOCUS
                                        </h4>
                                        <p className="text-white text-lg">{selectedClass.focus}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-display text-xs text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Clock size={14}/> DÉROULEMENT
                                        </h4>
                                        <p className="text-white text-lg">{selectedClass.structure}</p>
                                    </div>
                                </div>
                            </div>
                        </FadeInSection>

                        {/* 3. GALERIE ÉDITORIALE */}
                        <FadeInSection>
                            <h3 className="font-display text-3xl md:text-5xl mb-12 text-center">IMMERSION</h3>
                        </FadeInSection>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-20">
                            {/* Bloc 1 */}
                            <FadeInSection delay={0.1}>
                                <div className="relative h-[300px] md:h-[500px] w-full rounded-lg overflow-hidden border border-white/10 group mb-6">
                                    <Image src={selectedClass.images[0]} alt="Gallery 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="p-6 border-l border-primary/50 pl-6">
                                    <h4 className="font-display text-2xl mb-2 text-white flex items-center gap-2"><Zap size={20} className="text-primary"/> INTENSITÉ</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">Chaque répétition compte. Dépassez vos limites dans un environnement sécurisé.</p>
                                </div>
                            </FadeInSection>

                            {/* Bloc 2 */}
                            <FadeInSection delay={0.3}>
                                <div className="md:mt-20"> {/* Décalage esthétique */}
                                    <div className="relative h-[300px] md:h-[500px] w-full rounded-lg overflow-hidden border border-white/10 group mb-6">
                                        <Image src={selectedClass.images[1]} alt="Gallery 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="p-6 border-l border-primary/50 pl-6">
                                        <h4 className="font-display text-2xl mb-2 text-white flex items-center gap-2"><Target size={20} className="text-primary"/> PRÉCISION</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">La technique avant la charge. Nos coachs corrigent chaque mouvement.</p>
                                    </div>
                                </div>
                            </FadeInSection>
                        </div>

                        {/* 4. MASONRY FINALE */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                             {selectedClass.images.slice(2).map((img:string, idx:number) => (
                                <FadeInSection key={idx} delay={0.1 * idx}>
                                    <div className="relative h-[150px] md:h-[250px] w-full rounded-lg overflow-hidden border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
                                        <Image src={img} alt="Extra" fill className="object-cover" />
                                    </div>
                                </FadeInSection>
                             ))}
                        </div>

                        {/* 5. CTA */}
                        <FadeInSection>
                            <div className="text-center pb-20 border-t border-white/10 pt-20">
                                <h3 className="font-display text-3xl md:text-5xl mb-8">PRÊT À SUER ?</h3>
                                <TransitionLink href="/contact" className="inline-block bg-white text-black px-8 py-4 md:px-10 md:py-5 font-display text-lg md:text-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                                    Réserver ma séance
                                </TransitionLink>
                            </div>
                        </FadeInSection>

                    </div>
                </>
            )}
        </div>
      </div>
    </main>
  );
}