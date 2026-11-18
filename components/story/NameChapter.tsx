'use client';
import { forwardRef, useState } from 'react';
import Reveal from './Reveal';
import { story } from './store';
import { formatName, setVisitor, useVisitor } from './visitor';

const NameChapter = forwardRef<HTMLElement>(function NameChapter(_, ref) {
  const { name } = useVisitor();
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<'ask' | 'skipped' | 'edit'>('ask');

  const greet = () => {
    story.greeted = 1;
    window.setTimeout(() => { story.greeted = 0; }, 1400);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = formatName(draft);
    if (!n) return;
    setVisitor({ name: n });
    setMode('ask');
    greet();
  };

  const known = name && mode !== 'edit';
  const small = 'mt-6 font-body text-[11px] uppercase tracking-[0.25em] text-gray-500 hover:text-primary transition-colors';

  return (
    <section ref={ref} id="prenom" data-ch="name" className="relative z-10 h-[200svh]">
      <div className="sticky top-0 h-[100svh] flex items-center px-4 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/60 to-transparent pointer-events-none" />
        <Reveal w={[0.02, 1.2]} className="relative w-full max-w-3xl">
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gray-400 mb-4">Dans la tribu</p>
          <h2 className="font-display uppercase text-white text-5xl md:text-8xl leading-[0.88] mb-10">
            Ici, on t’appelle<br />par ton <span className="text-primary">prénom.</span>
          </h2>

          {known ? (
            <div aria-live="polite">
              <p className="font-display uppercase text-white text-3xl md:text-5xl leading-none">Enchanté,</p>
              <p className="font-brush text-primary text-6xl md:text-8xl -rotate-2 leading-tight">{name}</p>
              <p className="font-body text-gray-300 text-lg mt-4">Bienvenue chez toi. Viens, on te présente tout le monde.</p>
              <button type="button" onClick={() => { setDraft(name); setMode('edit'); }} className={small}>
                Ce n’est pas toi ?
              </button>
            </div>
          ) : mode === 'skipped' ? (
            <div aria-live="polite">
              <p className="font-display uppercase text-white text-4xl md:text-6xl leading-none">Pas de souci.</p>
              <p className="font-body text-gray-300 text-lg mt-4">Ici, personne ne te force à rien. Viens, on te fait visiter.</p>
              <button type="button" onClick={() => setMode('ask')} className={small}>Finalement, je me présente</button>
            </div>
          ) : (
            <form onSubmit={submit} className="max-w-xl">
              <label htmlFor="visitor-name" className="block font-body text-gray-300 text-lg mb-3">Et toi, c’est comment ?</label>
              <div className="flex items-end gap-4 border-b-2 border-white/25 focus-within:border-primary transition-colors">
                <input
                  id="visitor-name"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoComplete="given-name"
                  maxLength={24}
                  placeholder="Ton prénom"
                  className="flex-1 bg-transparent font-brush text-4xl md:text-6xl text-primary placeholder:text-white/20 py-2 outline-none min-w-0"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="shrink-0 mb-3 bg-primary text-white font-display uppercase tracking-widest text-sm px-5 py-3 disabled:opacity-30 hover:bg-white hover:text-black transition-colors"
                >
                  C’est moi
                </button>
              </div>
              <button type="button" onClick={() => setMode('skipped')} className={small}>Je préfère rester discret·e</button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
});

export default NameChapter;
