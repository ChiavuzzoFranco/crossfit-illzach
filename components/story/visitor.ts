'use client';
import { useSyncExternalStore } from 'react';

// Ce que le visiteur nous confie pendant la story (prénom, créneau, formule).
// Gardé en mémoire + localStorage (confort uniquement : tout marche sans).
type Visitor = { name: string; slot: string; plan: string };

const KEY = 'cfi-visitor';
let state: Visitor = { name: '', slot: '', plan: '' };
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch { /* stockage indisponible : on continue sans */ }
}

export function setVisitor(patch: Partial<Visitor>) {
  state = { ...state, ...patch };
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* idem */ }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const SERVER: Visitor = { name: '', slot: '', plan: '' };

export function useVisitor(): Visitor {
  return useSyncExternalStore(
    subscribe,
    () => { load(); return state; },
    () => SERVER,
  );
}

// Nettoie et met en forme un prénom saisi (« léa » → « Léa »)
export function formatName(raw: string) {
  const n = raw.trim().replace(/\s+/g, ' ').slice(0, 24);
  return n.replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, c: string) => sep + c.toUpperCase());
}

// Défilement vers un chapitre (fluide avec Lenis s'il est actif)
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
