'use client';
import { useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { CheckCircle } from "lucide-react";

// Si tu n'as pas encore créé ce composant, commente la ligne ci-dessous
import GymMap from "../../components/GymMap"; 

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  // Récupération du plan sélectionné dans l'URL (ex: ?plan=ILLIMITE)
  const selectedPlan = searchParams.get('plan');

  // États du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // CLÉ WEB3FORMS (Mets la tienne ici)
  const ACCESS_KEY = "f44c73a7-9a33-468e-b470-e71fbf6246ff"; 

  // --- ANIMATIONS GSAP ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(".contact-reveal", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
      
      tl.fromTo(".map-reveal",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" },
        "-=0.5"
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // --- LOGIQUE D'ENVOI ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050505] text-white pt-32 pb-12 selection:bg-primary selection:text-white">
      
      {/* SECTION 1 : INFOS & FORMULAIRE */}
      <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 max-w-7xl mx-auto">
        
        {/* COLONNE GAUCHE : INFOS */}
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-[12vw] leading-none text-primary mb-8 contact-reveal">HELLO.</h1>
          <p className="font-body text-xl text-gray-400 mb-12 max-w-md contact-reveal">
            Vous avez une question ? Vous voulez passer nous voir ? La porte est toujours ouverte (sauf pendant les Burpees).
          </p>
          
          <div className="space-y-8 contact-reveal">
            <div>
              <h3 className="font-display text-2xl mb-2 text-white">ADRESSE</h3>
              <p className="font-body text-gray-500 leading-relaxed">
                4 Rue de Lisbonne<br/>
                68110 Illzach, France
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-2 text-white">EMAIL</h3>
              <a href="mailto:contact@crossfitillzach.com" className="font-body text-gray-500 hover:text-primary transition-colors">
                contact@crossfitillzach.com
              </a>
            </div>
            <div>
               <h3 className="font-display text-2xl mb-2 text-white">SOCIAL</h3>
               <div className="flex gap-4 font-body text-sm uppercase text-gray-500">
                 <a href="#" className="hover:text-primary transition-colors">Instagram</a>
                 <a href="#" className="hover:text-primary transition-colors">Facebook</a>
               </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="bg-[#111] p-8 md:p-12 border border-white/10 contact-reveal self-center relative overflow-hidden group">
          {/* Petite décoration rouge au hover */}
          <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-in-out"></div>
          
          <div className="relative z-10">
            {isSuccess ? (
              // MESSAGE DE SUCCÈS
              <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <CheckCircle size={48} className="text-primary mb-6" />
                <h2 className="font-display text-3xl mb-2 text-white">MESSAGE REÇU</h2>
                <p className="text-gray-400 font-body">Le staff te recontacte très vite.</p>
                <button onClick={() => setIsSuccess(false)} className="mt-8 text-xs underline decoration-primary underline-offset-4 hover:text-white text-gray-500 transition-colors">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              // FORMULAIRE ACTIF
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Inputs cachés Web3Forms */}
                <input type="hidden" name="access_key" value={ACCESS_KEY} />
                {selectedPlan && <input type="hidden" name="subject" value={`Demande Abonnement : ${selectedPlan}`} />}

                {/* BANDEAU SI ABONNEMENT SÉLECTIONNÉ */}
                {selectedPlan && (
                   <div className="pb-4 border-b border-white/10 mb-6 flex justify-between items-end">
                      <span className="font-display text-gray-500 text-sm tracking-widest">SUJET</span>
                      <span className="font-display text-primary text-xl uppercase">{selectedPlan}</span>
                   </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-display text-sm tracking-widest text-gray-500">PRÉNOM</label>
                    <input required type="text" name="prenom" className="bg-transparent border-b border-white/20 py-2 outline-none focus:border-primary text-white transition-colors w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-display text-sm tracking-widest text-gray-500">NOM</label>
                    <input required type="text" name="nom" className="bg-transparent border-b border-white/20 py-2 outline-none focus:border-primary text-white transition-colors w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-display text-sm tracking-widest text-gray-500">EMAIL</label>
                    <input required type="email" name="email" className="bg-transparent border-b border-white/20 py-2 outline-none focus:border-primary text-white transition-colors w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-display text-sm tracking-widest text-gray-500">TÉLÉPHONE</label>
                    <input required type="tel" name="telephone" className="bg-transparent border-b border-white/20 py-2 outline-none focus:border-primary text-white transition-colors w-full" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-display text-sm tracking-widest text-gray-500">MESSAGE</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    className="bg-transparent border-b border-white/20 py-2 outline-none focus:border-primary text-white transition-colors resize-none w-full"
                    defaultValue={selectedPlan ? `Bonjour, je suis intéressé par l'offre ${selectedPlan}.` : ""}
                  ></textarea>
                </div>
                
                <button 
                  disabled={isSubmitting} 
                  className="w-full bg-white text-black font-display text-xl uppercase py-4 hover:bg-primary hover:text-white transition-colors mt-8 disabled:opacity-50 disabled:cursor-wait"
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2 : LA MAP 3D IMMERSIVE */}
      <div className="w-full h-[60vh] md:h-[70vh] border-y border-white/10 relative map-reveal">
         {/* Titre superposé */}
         <div className="absolute top-6 left-6 md:left-12 z-10 pointer-events-none mix-blend-difference">
            <h2 className="font-display text-4xl md:text-6xl text-white uppercase">La Zone</h2>
            <p className="font-body text-primary text-sm tracking-widest uppercase">Illzach — Industry Sector</p>
         </div>

         {/* LE COMPOSANT THREE.JS */}
         {/* Assure-toi que ce composant existe ou remplace-le par une image si besoin */}
         <div className="w-full h-full bg-[#080808]">
            <GymMap /> 
         </div>
         
         {/* Overlay esthétique (Lignes de visée caméra) */}
         <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent md:border-[#050505]">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
         </div>
      </div>

    </main>
  );
}