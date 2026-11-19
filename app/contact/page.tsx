'use client';
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CheckCircle } from "lucide-react";
import JungleLeaves from "../../components/jungle/JungleLeaves";
import { Splash, Stamp, Sticker, TORN } from "../../components/jungle/ui";

const JungleBackdrop = dynamic(() => import("../../components/jungle/JungleBackdrop"), { ssr: false });

const GymMap = dynamic(() => import("../../components/GymMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#050505]" />,
});

// --- Wrapper qui ne monte GymMap que quand la section est visible ---
function LazyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full bg-[#050505]">
      {visible && <GymMap />}
    </div>
  );
}

// --- 1. SOUS-COMPOSANT PRINCIPAL ---
function ContactContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const selectedPlan = searchParams.get('plan');
  const selectedCreneau = searchParams.get('creneau');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const ACCESS_KEY = "f44c73a7-9a33-468e-b470-e71fbf6246ff";

  // --- ANIMATIONS GSAP (lazy loaded) ---
  useEffect(() => {
    let ctx: any;
    (async () => {
      const { default: gsap } = await import("gsap");
      ctx = gsap.context(() => {
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
    })();
    return () => { if (ctx) ctx.revert(); };
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

  // Champs « écrits à la main » sur le papier
  const field = "w-full bg-transparent border-b-2 border-bg/25 focus:border-primary outline-none py-1.5 font-brush text-xl md:text-2xl text-bg placeholder:text-bg/25 transition-colors";
  const lab = "font-display uppercase tracking-[0.2em] text-[11px] text-bg/55";

  return (
    <div ref={containerRef} className="relative min-h-screen text-white pt-32 pb-12 selection:bg-primary selection:text-white">
      {/* Jungle en fond du haut de page, fondue vers le bas */}
      <JungleBackdrop variant="frame" className="absolute inset-x-0 top-0 h-[115svh]" />
      <div className="absolute inset-x-0 top-[80svh] h-[35svh] bg-gradient-to-b from-transparent to-bg pointer-events-none" />

      {/* SECTION 1 : INFOS & FORMULAIRE */}
      <div className="relative px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 mb-24 max-w-7xl mx-auto">

        {/* COLONNE GAUCHE : INFOS */}
        <div className="relative flex flex-col justify-center">
          <div className="absolute -inset-10 bg-[radial-gradient(closest-side,rgba(8,8,8,0.88),rgba(8,8,8,0.45)_60%,transparent)] -z-10" />
          <p className="font-brush text-primary text-3xl md:text-4xl -rotate-3 contact-reveal">Une question ?</p>
          <h1 className="font-display text-[22vw] md:text-[11vw] leading-none text-white mb-6 contact-reveal">HELLO<span className="text-primary">.</span></h1>
          <p className="font-body text-lg md:text-xl text-gray-200 mb-10 max-w-md contact-reveal">
            Vous avez une question ? Vous voulez passer nous voir ? La porte est toujours ouverte (sauf pendant les Burpees).
          </p>

          <div className="space-y-6 contact-reveal">
            <div>
              <h3 className="font-brush text-xl text-white -rotate-1 mb-2">Adresse</h3>
              <a href="https://www.google.com/maps/search/?api=1&query=CrossFit%20Illzach%204%20Rue%20de%20Lisbonne%2068110%20Illzach" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Sticker rot={-2} tone="white" className="px-4 py-2 text-base md:text-lg">4 Rue de Lisbonne, 68110 Illzach ↗</Sticker>
              </a>
            </div>
            <div>
              <h3 className="font-brush text-xl text-white -rotate-1 mb-2">Email</h3>
              <a href="mailto:contact@crossfit-illzach.fr" className="inline-block">
                <Sticker rot={1} tone="black" className="px-4 py-2 text-base md:text-lg normal-case">contact@crossfit-illzach.fr</Sticker>
              </a>
            </div>
            <div>
              <h3 className="font-brush text-xl text-white -rotate-1 mb-2">Social</h3>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/crossfitillzach/?hl=fr" target="_blank" rel="noopener noreferrer"><Sticker rot={-3} tone="red" className="px-4 py-2 text-sm md:text-base">Instagram</Sticker></a>
                <a href="https://www.facebook.com/CrossFitIllzach/" target="_blank" rel="noopener noreferrer"><Sticker rot={2} tone="white" className="px-4 py-2 text-sm md:text-base">Facebook</Sticker></a>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE sur papier déchiré */}
        <div className="relative contact-reveal self-center -rotate-1">
          <Splash variant={5} className="absolute -right-10 -top-12 w-40 h-40 text-primary -z-10" />
          <div className="relative bg-[#f3eee6] text-bg px-6 md:px-10 pt-10 pb-9 shadow-[12px_14px_0_rgba(0,0,0,0.6)]" style={{ clipPath: TORN }}>
            <Stamp className="absolute right-5 top-5 w-20 md:w-24 text-primary/80 rotate-12" />
            {isSuccess ? (
              <div className="flex flex-col items-start py-12">
                <CheckCircle size={44} className="text-primary mb-5" />
                <h2 className="font-display text-4xl md:text-5xl mb-2">MESSAGE REÇU</h2>
                <p className="font-brush text-xl text-bg/80">Le staff te recontacte très vite.</p>
                <button onClick={() => setIsSuccess(false)} className="mt-8 text-sm underline decoration-primary underline-offset-4 text-bg/70 hover:text-bg transition-colors">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                <input type="hidden" name="access_key" value={ACCESS_KEY} />
                {selectedCreneau
                  ? <input type="hidden" name="subject" value={`Séance d'essai : ${selectedCreneau}`} />
                  : selectedPlan && <input type="hidden" name="subject" value={`Demande Abonnement : ${selectedPlan}`} />
                }

                <div className="pr-24">
                  <p className="font-display uppercase text-4xl md:text-6xl leading-none">Écris-nous</p>
                  <p className="font-brush text-primary text-2xl -rotate-1">La tribu te répond</p>
                </div>

                {selectedCreneau && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={lab}>Créneau</span>
                    <Sticker rot={-2} tone="red" className="px-3 py-1.5 text-base">{selectedCreneau}</Sticker>
                  </div>
                )}

                {!selectedCreneau && selectedPlan && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={lab}>Sujet</span>
                    <Sticker rot={-2} tone="red" className="px-3 py-1.5 text-base">{selectedPlan}</Sticker>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className={lab}>Prénom</label>
                    <input required type="text" name="prenom" placeholder="Prénom" className={field} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={lab}>Nom</label>
                    <input required type="text" name="nom" placeholder="Nom" className={field} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className={lab}>Email</label>
                    <input required type="email" name="email" placeholder="toi@mail.fr" className={field} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={lab}>Téléphone</label>
                    <input required type="tel" name="telephone" placeholder="06…" className={field} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={lab}>Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    className={`${field} resize-none text-lg md:text-xl`}
                    defaultValue={selectedCreneau
                      ? `Bonjour, je souhaite réserver une séance d'essai sur le créneau suivant : ${selectedCreneau}.`
                      : selectedPlan ? `Bonjour, je suis intéressé par l'offre ${selectedPlan}.` : ""
                    }
                  ></textarea>
                </div>

                <button disabled={isSubmitting} className="group block w-full pt-2 disabled:opacity-50 disabled:cursor-wait">
                  <Sticker rot={-1} tone="red" className="block w-full px-5 py-4 text-xl text-center group-hover:bg-bg transition-colors">
                    {isSubmitting ? 'Envoi...' : 'Envoyer →'}
                  </Sticker>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2 : LA MAP, encadrée par la jungle */}
      <div className="relative isolate px-4 md:px-12 py-10 map-reveal">
        <JungleLeaves set="corners" />
        <div className="relative max-w-7xl mx-auto">
          <div className="mb-6">
            <p className="font-brush text-primary text-3xl md:text-4xl -rotate-2">Le camp de la tribu</p>
            <h2 className="font-display text-5xl md:text-7xl text-white uppercase leading-none">La Zone</h2>
            <p className="font-body text-gray-300 text-sm tracking-widest uppercase mt-1">Z.I ILE NAPOLÉON</p>
          </div>
          <div className="relative w-full h-[60vh] md:h-[70vh] shadow-[12px_14px_0_rgba(0,0,0,0.6)]" style={{ clipPath: TORN }}>
            <LazyMap />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. COMPOSANT EXPORTÉ ---
export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]"></div>}>
      <ContactContent />
    </Suspense>
  );
}
