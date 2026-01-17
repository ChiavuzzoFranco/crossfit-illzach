'use client';
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "../../components/TransitionLink";

export default function LaBox() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      
      // 1. PRÉPARATION (Invisible au départ)
      gsap.set(".reveal-hero", { y: 100, opacity: 0 });
      gsap.set(".feature-row", { opacity: 0 }); // On gère l'apparition au scroll

      // 2. HERO ANIMATION (Après la transition de page)
      gsap.to(".reveal-hero", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.6 // Synchro avec les colonnes noires
      });

      // 3. SECTIONS ANIMATION (Scroll)
      const sections = gsap.utils.toArray('.feature-row');
      sections.forEach((section: any) => {
        gsap.fromTo(section,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 75%", // Se déclenche quand la section arrive aux 3/4 de l'écran
            }
          }
        );
      });

      // 4. PARALLAX SUR LES IMAGES
      gsap.utils.toArray('.parallax-img').forEach((img: any) => {
        gsap.to(img, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-bg text-white pt-32 pb-20 overflow-hidden">
      
      {/* === HEADER === */}
      <div className="px-6 md:px-12 mb-20 md:mb-32">
        <h1 className="font-display text-[12vw] leading-[0.8] mb-8 uppercase">
          <span className="reveal-hero block">L'Espace</span>
          <span className="reveal-hero block text-primary stroke-text">D'entraînement</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-5 reveal-hero">
            <p className="font-body text-gray-400 text-lg leading-relaxed">
              300m² dédiés à votre progression. Pas de miroirs, pas de machines guidées inutiles. Juste de l'espace, du matériel professionnel, et une communauté.
            </p>
          </div>
          <div className="md:col-span-7 reveal-hero flex justify-start md:justify-end">
             <div className="flex gap-4 text-xs font-body uppercase tracking-widest text-gray-500">
                <span>/// Zone Industrielle Illzach</span>
                <span>/// Parking Gratuit</span>
             </div>
          </div>
        </div>
      </div>

      {/* === VISITE GUIDÉE (Alternance Texte / Image) === */}
      <div className="flex flex-col gap-24 md:gap-40 px-6 md:px-12">

        {/* SECTION 1 : LE PLATEAU */}
        <div className="feature-row grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
           <div className="relative h-[50vh] w-full overflow-hidden bg-[#111]">
              <Image 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200" // Remplacer par photo grand angle de la box
                alt="Plateau CrossFit Illzach"
                fill
                className="parallax-img object-cover opacity-80"
              />
           </div>
           <div className="order-first md:order-last">
              <span className="text-primary font-display text-6xl mb-4 block">01.</span>
              <h2 className="font-display text-4xl mb-6">LE PLATEAU</h2>
              <p className="font-body text-gray-400 leading-relaxed mb-6">
                Un espace ouvert ("Open Space") conçu pour la liberté de mouvement. 
                Le sol est un revêtement technique spécial qui absorbe les chocs pour protéger vos articulations 
                lors des sauts ou de la chute des barres.
              </p>
              <ul className="space-y-2 font-body text-sm text-gray-300">
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Rig (Cage) de gymnastique 10m</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Espace Poids Libres</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Cordes à grimper (4m)</li>
              </ul>
           </div>
        </div>

        {/* SECTION 2 : LE MATÉRIEL */}
        <div className="feature-row grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
           <div>
              <span className="text-primary font-display text-6xl mb-4 block">02.</span>
              <h2 className="font-display text-4xl mb-6">MATÉRIEL HAUT DE GAMME</h2>
              <p className="font-body text-gray-400 leading-relaxed mb-6">
                La qualité du matériel n'est pas un luxe, c'est une sécurité. 
                Nous travaillons avec les marques références (Rogue, Concept2) pour garantir 
                des barres qui tournent bien (protègent les poignets) et des machines ergonomiques.
              </p>
           </div>
           <div className="relative h-[50vh] w-full overflow-hidden bg-[#111]">
              <Image 
                src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1200" // Remplacer par gros plan sur une barre ou Dumbbell
                alt="Matériel Rogue Fitness"
                fill
                className="parallax-img object-cover opacity-80"
              />
           </div>
        </div>

        {/* SECTION 3 : ZONE DE VIE */}
        <div className="feature-row grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
           <div className="relative h-[50vh] w-full overflow-hidden bg-[#111]">
              <Image 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200" // Remplacer par photo coin canapé/café
                alt="Coin Café CrossFit"
                fill
                className="parallax-img object-cover opacity-80"
              />
           </div>
           <div className="order-first md:order-last">
              <span className="text-primary font-display text-6xl mb-4 block">03.</span>
              <h2 className="font-display text-4xl mb-6">L'ESPACE COMMUNAUTÉ</h2>
              <p className="font-body text-gray-400 leading-relaxed mb-6">
                Le CrossFit, c'est 50% de sport, 50% de social. 
                Avant ou après la séance, retrouvez-vous dans notre espace détente. 
                Café, canapés, discussions... c'est ici que naissent les amitiés.
              </p>
           </div>
        </div>

      </div>

      {/* === CTA FOOTER === */}
      <section className="mt-32 py-20 bg-[#080808] border-t border-white/10 text-center">
        <h3 className="font-display text-4xl mb-8">VENEZ VISITER</h3>
        <p className="font-body text-gray-400 max-w-lg mx-auto mb-10">
          Les photos c'est bien, l'ambiance réelle c'est mieux. 
          Passez nous voir 15 minutes avant un cours pour sentir l'énergie du lieu.
        </p>
        <TransitionLink href="/contact" className="inline-block bg-white text-black px-12 py-4 font-display text-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
           Prendre RDV
        </TransitionLink>
      </section>

    </main>
  );
}