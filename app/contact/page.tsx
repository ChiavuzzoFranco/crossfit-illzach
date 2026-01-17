'use client';
import { useEffect } from "react";
import gsap from "gsap";

export default function ContactPage() {
  
  useEffect(() => {
    gsap.fromTo(".contact-reveal", 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  return (
    <main className="min-h-screen bg-bg text-white pt-32 pb-20 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20">
      
      {/* Infos */}
      <div className="flex flex-col justify-center">
        <h1 className="font-display text-[12vw] leading-none text-primary mb-8 contact-reveal">HELLO.</h1>
        <p className="font-body text-xl text-gray-400 mb-12 max-w-md contact-reveal">
          Vous avez une question ? Vous voulez passer nous voir ? La porte est toujours ouverte (sauf pendant les Burpees).
        </p>
        
        <div className="space-y-8 contact-reveal">
          <div>
            <h3 className="font-display text-2xl mb-2">ADRESSE</h3>
            <p className="font-body text-gray-500">
              15 Rue de l'Industrie<br/>
              68110 Illzach, France
            </p>
          </div>
          <div>
            <h3 className="font-display text-2xl mb-2">EMAIL</h3>
            <a href="mailto:contact@crossfitillzach.com" className="font-body text-gray-500 hover:text-white transition-colors">contact@crossfitillzach.com</a>
          </div>
          <div>
             <h3 className="font-display text-2xl mb-2">SOCIAL</h3>
             <div className="flex gap-4 font-body text-sm uppercase text-gray-500">
               <a href="#" className="hover:text-primary">Instagram</a>
               <a href="#" className="hover:text-primary">Facebook</a>
             </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-[#111] p-12 border border-white/10 contact-reveal self-center">
        <form className="space-y-8">
          <div className="flex flex-col gap-2">
            <label className="font-display text-sm tracking-widest text-gray-500">NOM</label>
            <input type="text" className="bg-transparent border-b border-white/20 py-2 outline-none focus:border-primary text-white transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-display text-sm tracking-widest text-gray-500">EMAIL</label>
            <input type="email" className="bg-transparent border-b border-white/20 py-2 outline-none focus:border-primary text-white transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-display text-sm tracking-widest text-gray-500">MESSAGE</label>
            <textarea rows={4} className="bg-transparent border-b border-white/20 py-2 outline-none focus:border-primary text-white transition-colors resize-none"></textarea>
          </div>
          
          <button className="w-full bg-white text-black font-display text-xl uppercase py-4 hover:bg-primary transition-colors mt-8">
            Envoyer
          </button>
        </form>
      </div>

    </main>
  );
}