'use client';
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "../../components/TransitionLink"; 
import Image from "next/image";

// --- DONNÉES ---
const CLASSES = [
  {
    id: "wod",
    title: "W.O.D",
    subtitle: "Workout Of the Day",
    desc: "Le cœur de notre méthode.",
    tags: ["Intensité", "Complet"],
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200", 
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
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
    tags: ["Technique", "Puissance"],
    cover: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1200",
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
    tags: ["Agilité", "Gainage"],
    cover: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200",
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
    tags: ["Santé", "Esthétique"],
    cover: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200",
      "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?q=80&w=800",
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800"
    ]
  },
  {
    id: "hyrox",
    title: "HYROX",
    subtitle: "Endurance",
    desc: "Course à pied et mouvements.",
    tags: ["Cardio", "Mental"],
    cover: "https://images.unsplash.com/photo-1552674605-46d538e1b1d1?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1552674605-46d538e1b1d1?q=80&w=1200",
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
    tags: ["Cohésion", "Fun"],
    cover: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200",
      "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?q=80&w=800",
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800"
    ]
  }
];

export default function Concept() {
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  
  // SCROLL LOCK
  useEffect(() => {
    if (selectedClass) { 
      document.body.style.overflow = 'hidden'; 
    } else { 
      document.body.style.overflow = ''; 
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedClass]);

  // ANIMATIONS D'APPARITION (FIXED)
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // 1. Hero Text
      gsap.fromTo(".hero-reveal", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );

      // 2. Cartes "Séance Type"
      ScrollTrigger.batch(".step-card", {
        start: "top 85%", // Déclenche un peu plus tôt
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
          );
        },
        once: true // Ne le joue qu'une fois
      });

      // 3. Liste Interactive (FIX pour Mobile & Desktop)
      // On utilise batch ici aussi pour être sûr que chaque ligne s'anime quand elle arrive
      ScrollTrigger.batch(".list-item", {
        start: "top 90%",
        onEnter: (elements) => {
          gsap.fromTo(elements,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
          );
        },
        once: true
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // ANIMATION OUVERTURE MODALE
  useLayoutEffect(() => {
    if (selectedClass) {
      gsap.set(modalRef.current, { yPercent: 100, display: "block" });
      const tl = gsap.timeline();
      tl.to(modalRef.current, { yPercent: 0, duration: 0.6, ease: "power3.inOut" })
        .fromTo(".gallery-item", 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power2.out" }, "-=0.2");
    } else {
      if (modalRef.current) {
        gsap.to(modalRef.current, {
          yPercent: 100, duration: 0.5, ease: "power3.in",
          onComplete: () => { gsap.set(modalRef.current, { display: "none" }); }
        });
      }
    }
  }, [selectedClass]);

  // GESTION SOURIS (DESKTOP SEULEMENT)
  // On ajoute une vérification pour éviter les erreurs sur mobile
  const handleMouseMove = (e: React.MouseEvent) => {
    // Si c'est un touch device (mobile), on ne fait rien de complexe
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = e.currentTarget as HTMLElement;
    const imgContainer = target.querySelector('.hover-reveal-img') as HTMLElement;
    const img = target.querySelector('.hover-reveal-img img');
    
    if(!imgContainer) return;

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    
    gsap.to(imgContainer, {
      x: x, y: y, xPercent: -50, yPercent: -50,
      duration: 0.5, ease: "power3.out"
    });
    
    const centerX = rect.width / 2;
    const rotateVal = (x - centerX) / 50; 
    if (img) gsap.to(img, { rotation: rotateVal, duration: 0.5 });
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = e.currentTarget as HTMLElement;
    const imgContainer = target.querySelector('.hover-reveal-img');
    gsap.to(".list-item", { opacity: 0.3, duration: 0.4 });
    gsap.to(target, { opacity: 1, duration: 0.4 });
    gsap.to(imgContainer, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = e.currentTarget as HTMLElement;
    const imgContainer = target.querySelector('.hover-reveal-img');
    gsap.to(".list-item", { opacity: 1, duration: 0.4 });
    gsap.to(imgContainer, { opacity: 0, scale: 0.5, duration: 0.3, ease: "power2.in" });
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-bg text-white pt-32 pb-20 relative">
      
      {/* HEADER */}
      <div className="px-6 md:px-12 mb-20 md:mb-32">
        <h1 className="font-display text-[12vw] leading-[0.8] mb-8 text-white uppercase">
          <span className="hero-reveal block">Notre</span>
          <span className="hero-reveal block text-primary">Méthode</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <p className="hero-reveal font-body text-xl text-gray-400 leading-relaxed">
              Le CrossFit chez nous n'est pas une compétition. C'est une méthodologie conçue pour vous rendre plus fort, plus endurant et en meilleure santé pour la vie de tous les jours.
            </p>
            <div className="hero-reveal flex items-end md:justify-end">
                <span className="text-primary font-display text-lg uppercase tracking-widest border-b border-primary pb-1">Sport Santé</span>
            </div>
        </div>
      </div>

      {/* SECTION PÉDAGOGIQUE */}
      <section className="timeline-section px-6 md:px-12 mb-32 md:mb-48">
         <div className="border-t border-white/20 pt-12">
            <h2 className="font-display text-2xl md:text-4xl mb-16 text-white uppercase">UNE SÉANCE TYPE (1H)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* 01 */}
               <div className="step-card opacity-0 group relative p-8 border border-white/10 hover:border-primary transition-colors bg-[#0a0a0a]">
                  <span className="font-display text-6xl text-white/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors">01</span>
                  <h3 className="font-display text-2xl text-primary mb-4">BRIEFING & WARM UP</h3>
                  <p className="font-body text-gray-400 text-sm leading-relaxed">
                    Le coach explique la séance et les objectifs. Ensuite, on s'échauffe ensemble pour préparer les articulations.
                  </p>
               </div>
               {/* 02 */}
               <div className="step-card opacity-0 group relative p-8 border border-white/10 hover:border-primary transition-colors bg-[#0a0a0a]">
                  <span className="font-display text-6xl text-white/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors">02</span>
                  <h3 className="font-display text-2xl text-white mb-4">SKILL / FORCE</h3>
                  <p className="font-body text-gray-400 text-sm leading-relaxed">
                    On prend le temps d'apprendre. Le coach corrige votre posture, vous apprenez un nouveau mouvement technique.
                  </p>
               </div>
               {/* 03 */}
               <div className="step-card opacity-0 group relative p-8 border border-white/10 hover:border-primary transition-colors bg-[#0a0a0a]">
                  <span className="font-display text-6xl text-white/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors">03</span>
                  <h3 className="font-display text-2xl text-white mb-4">LE W.O.D</h3>
                  <p className="font-body text-gray-400 text-sm leading-relaxed">
                    <span className="italic">"Workout of the Day"</span>. 10 à 20 minutes d'effort adapté à votre niveau pour se vider la tête.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* LISTE INTERACTIVE */}
      <section className="list-container px-6 md:px-12 mb-32 max-w-[1600px] mx-auto">
        <div className="mb-12">
            <h2 className="font-display text-sm text-gray-500 uppercase tracking-widest mb-2">Nos Programmes</h2>
            <p className="font-body text-2xl text-white">Quelle discipline est faite pour vous ?</p>
        </div>

        <div className="flex flex-col border-t border-white/10">
          {CLASSES.map((item, index) => (
            <div 
              key={item.id}
              onClick={() => setSelectedClass(item)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              // opacity-0 par défaut pour que le batch ScrollTrigger le révèle
              className="list-item opacity-0 group relative py-8 md:py-12 border-b border-white/10 cursor-pointer interactive flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-300 overflow-hidden"
            >
               {/* IMAGE FLOTTANTE (DESKTOP) */}
               <div 
                  className="hover-reveal-img absolute top-0 left-0 w-[300px] h-[200px] md:w-[450px] md:h-[300px] z-10 pointer-events-none opacity-0 scale-50 hidden md:block"
                  style={{ transformOrigin: "center center" }}
               >
                 <div className="relative w-full h-full overflow-hidden shadow-2xl rounded-lg">
                    <Image src={item.cover} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20"></div>
                 </div>
               </div>

               {/* TEXTE GAUCHE */}
               <div className="relative z-20 w-full md:w-1/3 pointer-events-none mix-blend-normal md:mix-blend-screen">
                 <div className="flex items-center">
                    <span className="text-primary font-display text-sm md:text-xl mr-4">0{index + 1}</span>
                    <h2 className="font-display text-3xl md:text-6xl uppercase text-white transition-colors duration-300 group-hover:text-gray-300 md:group-hover:text-white">
                      {item.title}
                    </h2>
                 </div>
               </div>

               {/* TEXTE DROITE (TAGS) - Visible aussi sur mobile pour info */}
               <div className="relative z-20 w-full md:w-1/3 text-left md:text-right pointer-events-none mt-2 md:mt-0 pl-8 md:pl-0">
                  <p className="font-body text-gray-400 text-xs md:text-sm mb-2">{item.subtitle}</p>
                  <div className="flex justify-start md:justify-end gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="border border-white/20 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-500 group-hover:text-white group-hover:border-white transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <section className="px-6 md:px-12 text-center">
         <TransitionLink href="/contact" className="bg-primary text-white px-8 py-4 font-display uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
           Réserver ma séance d'essai
         </TransitionLink>
      </section>

      {/* MODALE GALERIE */}
      <div 
        ref={modalRef}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[10050] h-[100dvh] w-screen bg-[#050505] hidden overflow-y-auto overflow-x-hidden no-scrollbar overscroll-contain"
      >
        <div className="relative w-full min-h-full">
          <div className="sticky top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center border-b border-white/10 bg-[#050505]/95 backdrop-blur-md z-50">
            <div>
              <h2 className="font-display text-2xl md:text-4xl uppercase text-white">{selectedClass?.title}</h2>
              <p className="font-body text-gray-400 text-xs tracking-widest uppercase mt-1">Galerie Photo</p>
            </div>
            <button 
              onClick={() => setSelectedClass(null)} 
              className="group border border-white/20 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white hover:text-black transition-colors interactive cursor-pointer"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">✕</span>
            </button>
          </div>

          <div className="p-6 md:p-12 pb-32">
             <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-[1600px] mx-auto">
                {selectedClass?.images && selectedClass.images.map((img: string, idx: number) => (
                  <div key={idx} className="gallery-item break-inside-avoid relative mb-6 group overflow-hidden bg-white/5 w-full">
                     <Image 
                       src={img} 
                       alt={`Gallery ${idx}`}
                       width={800}
                       height={1000}
                       className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                  </div>
                ))}
                
                <div className="gallery-item break-inside-avoid bg-[#111] p-8 border border-white/10 text-center flex flex-col items-center justify-center min-h-[300px] w-full">
                   <h3 className="font-display text-2xl mb-4 text-white">REJOIGNEZ-NOUS</h3>
                   <TransitionLink href="/planning" className="inline-block border border-white/30 px-6 py-3 font-display text-sm uppercase tracking-widest hover:bg-primary hover:border-primary hover:text-white transition-colors">
                     Voir le planning
                   </TransitionLink>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}