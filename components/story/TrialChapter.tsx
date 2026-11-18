'use client';
import { forwardRef, useState } from 'react';
import { SCHEDULE, DAYS } from '@/lib/schedule';
import { PLANS } from '@/lib/plans';
import { story } from './store';
import { setVisitor, useVisitor } from './visitor';
import { slotKey } from './WeekChapter';
import { Splash, Stamp, Sticker, TORN } from './ui';

// Même service d'envoi que l'ancienne page contact (web3forms)
const ACCESS_KEY = 'f44c73a7-9a33-468e-b470-e71fbf6246ff';
const ADDRESS = '4 Rue de Lisbonne, 68110 Illzach';
const PHONE = '06 45 63 43 98';
const EMAIL = 'contact@crossfit-illzach.fr';

// Champs « écrits à la main » sur le papier
const field = 'w-full bg-transparent border-b-2 border-bg/25 focus:border-primary outline-none py-1.5 font-brush text-xl md:text-2xl text-bg placeholder:text-bg/25 transition-colors';
const lab = 'block font-display uppercase tracking-[0.2em] text-[11px] text-bg/55';

const TrialChapter = forwardRef<HTMLElement>(function TrialChapter(_, ref) {
  const { name, slot, plan } = useVisitor();
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [sentName, setSentName] = useState('');

  const allSlots = DAYS.flatMap((d) => SCHEDULE[d].map((s) => slotKey(d, s.time, s.type)));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const prenom = String(data.get('prenom') ?? '').trim();
    data.set('subject', `Séance d’essai — ${prenom}${data.get('creneau') ? ` — ${data.get('creneau')}` : ''}`);
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setSentName(prenom);
      setStatus('done');
      if (prenom && !name) setVisitor({ name: prenom });
      story.greeted = 1;
      window.setTimeout(() => { story.greeted = 0; }, 1600);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section ref={ref} id="essai" data-ch="trial" className="relative z-10 md:h-[190svh]">
      <div className="md:sticky md:top-0 min-h-[100svh] flex items-center px-4 md:px-12 py-24">
        <div className="relative w-full max-w-6xl mx-auto grid md:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-16 items-center reveal-on-scroll">
          {/* Le message, posé dans la clairière */}
          <div className="relative">
            <div className="absolute -inset-10 bg-[radial-gradient(closest-side,rgba(8,8,8,0.85),rgba(8,8,8,0.45)_60%,transparent)] -z-10" />
            <p className="font-brush text-primary text-4xl md:text-6xl -rotate-3 mb-1">{name ? `${name},` : 'Et toi ?'}</p>
            <h2 className="font-display uppercase text-white text-5xl md:text-8xl leading-[0.86] mb-6">
              La tribu<br /><span className="text-primary">t’attend.</span>
            </h2>
            <p className="font-body text-gray-200 text-base md:text-lg leading-relaxed max-w-md mb-8">
              Voici ton invitation. Remplis-la, on te rappelle pour caler ta première séance.
              Viens comme tu es : on s’occupe du reste.
            </p>
            <p className="font-brush text-white text-2xl -rotate-1 mb-3">Le camp de la tribu</p>
            <div className="flex flex-wrap gap-3">
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('CrossFit Illzach ' + ADDRESS)}`} target="_blank" rel="noopener noreferrer">
                <Sticker rot={-2} tone="white" className="px-3 py-1.5 text-sm hover:bg-peach transition-colors">{ADDRESS} ↗</Sticker>
              </a>
              <a href={`tel:${PHONE.replace(/\s/g, '')}`}><Sticker rot={2} tone="black" className="px-3 py-1.5 text-sm">{PHONE}</Sticker></a>
              <a href={`mailto:${EMAIL}`}><Sticker rot={-1} tone="black" className="px-3 py-1.5 text-sm normal-case">{EMAIL}</Sticker></a>
              <a href="https://www.instagram.com/crossfitillzach/" target="_blank" rel="noopener noreferrer"><Sticker rot={3} tone="red" className="px-3 py-1.5 text-sm">Instagram ↗</Sticker></a>
            </div>
          </div>

          {/* L'invitation : papier déchiré, tamponné */}
          <div className="relative -rotate-1 md:-rotate-2">
            <Splash variant={5} className="absolute -right-10 -top-12 w-40 h-40 text-primary -z-10" />
            <div className="relative bg-[#f3eee6] text-bg px-6 md:px-10 pt-10 pb-9 shadow-[12px_14px_0_rgba(0,0,0,0.6)]" style={{ clipPath: TORN }}>
              <Stamp className="absolute right-5 top-5 w-20 md:w-24 text-primary/80 rotate-12" />

              {status === 'done' ? (
                <div className="py-10" aria-live="polite">
                  <p className="font-brush text-primary text-3xl md:text-4xl -rotate-2 mb-2">Invitation acceptée !</p>
                  <p className="font-display uppercase text-5xl md:text-7xl leading-none mb-4">Bienvenue, {sentName || name || 'toi'}.</p>
                  <p className="font-body text-bg/75">On te recontacte très vite pour caler ta séance. La tribu a hâte de te rencontrer.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <input type="hidden" name="access_key" value={ACCESS_KEY} />
                  <input type="hidden" name="from_name" value="Site CrossFit Illzach" />
                  <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

                  <div className="pr-24">
                    <p className="font-display uppercase text-5xl md:text-6xl leading-none">Invitation</p>
                    <p className="font-brush text-primary text-2xl md:text-3xl -rotate-1">Séance d’essai</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <label htmlFor="t-prenom" className={lab}>Invité·e</label>
                      <input id="t-prenom" name="prenom" required defaultValue={name} key={`p-${name}`} autoComplete="given-name" placeholder="Prénom" className={field} />
                    </div>
                    <div>
                      <label htmlFor="t-nom" className={lab}>Nom</label>
                      <input id="t-nom" name="nom" required autoComplete="family-name" placeholder="Nom" className={field} />
                    </div>
                    <div>
                      <label htmlFor="t-email" className={lab}>Email</label>
                      <input id="t-email" name="email" type="email" required autoComplete="email" placeholder="toi@mail.fr" className={field} />
                    </div>
                    <div>
                      <label htmlFor="t-tel" className={lab}>Téléphone</label>
                      <input id="t-tel" name="telephone" type="tel" required autoComplete="tel" placeholder="06…" className={field} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <label htmlFor="t-creneau" className={lab}>Rendez-vous</label>
                      <select id="t-creneau" name="creneau" defaultValue={slot} key={`s-${slot}`} className={`${field} text-lg md:text-xl`}>
                        <option value="">Je ne sais pas encore</option>
                        {allSlots.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="t-formule" className={lab}>Ta place envisagée</label>
                      <select id="t-formule" name="formule" defaultValue={plan} key={`f-${plan}`} className={`${field} text-lg md:text-xl`}>
                        <option value="">Je verrai après l’essai</option>
                        {PLANS.map((p) => <option key={p.id} value={p.name}>{p.role} ({p.name})</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="t-msg" className={lab}>Un mot pour le coach</label>
                    <textarea id="t-msg" name="message" rows={2} placeholder="Blessure, objectif, première fois…" className={`${field} resize-none text-lg`} />
                  </div>

                  <button type="submit" disabled={status === 'sending'} className="group block w-full pt-2 disabled:opacity-60">
                    <Sticker rot={-1} tone="red" className="block w-full px-5 py-4 text-lg md:text-xl text-center group-hover:bg-bg transition-colors">
                      {status === 'sending' ? 'Envoi…' : 'J’accepte l’invitation →'}
                    </Sticker>
                  </button>
                  {status === 'error' && (
                    <p className="font-body text-sm text-primary" role="alert">
                      Oups, l’envoi n’a pas marché. Réessaie, ou appelle-nous au {PHONE}.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default TrialChapter;
