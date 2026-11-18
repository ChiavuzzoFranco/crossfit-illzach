// --- TARIFS (facile à modifier) ---
// Source : publication Instagram du 17 juin 2026 (engagement 12 mois).
// Les prix sans engagement viennent de l'ancien site : à confirmer.
export type Plan = {
  id: string;
  role: string;          // ta place dans la tribu
  roleLine: string;
  name: string;
  tagline: string;
  priceAnnual: number;   // / mois, engagement 12 mois
  priceMonthly: number;  // / mois, sans engagement
  features: string[];
  popular?: boolean;
  special?: string;
};

export const PLANS: Plan[] = [
  {
    id: '2x',
    role: 'L’Éclaireur',
    roleLine: 'Tu découvres la jungle, à ton rythme.',
    name: '2 séances',
    tagline: 'par semaine',
    priceAnnual: 65,
    priceMonthly: 75,
    features: ['2 cours / semaine', 'Accès à tous les cours', 'Hyrox inclus'],
  },
  {
    id: '3x',
    role: 'Le Grimpeur',
    roleLine: 'Tu prends de la hauteur, séance après séance.',
    name: '3 séances',
    tagline: 'par semaine',
    priceAnnual: 75,
    priceMonthly: 95,
    features: ['3 cours / semaine', 'Accès à tous les cours', 'Hyrox inclus'],
  },
  {
    id: 'illimite',
    role: 'Le Dos argenté',
    roleLine: 'Le chef de la tribu : tout, tout le temps.',
    name: 'Illimité',
    tagline: 'cours + espace free',
    priceAnnual: 89,
    priceMonthly: 110,
    features: ['Cours illimités', 'Accès libre 7j/7, 6h–22h', 'Badge inclus'],
    popular: true,
  },
  {
    id: 'heros',
    role: 'Les Gardiens',
    roleLine: 'Vous protégez les autres. Ici, la tribu vous dit merci.',
    name: 'Héros du quotidien',
    tagline: 'illimité',
    priceAnnual: 65,
    priceMonthly: 75,
    features: ['Cours illimités', 'Accès libre 7j/7, 6h–22h', 'Justificatif demandé'],
    special: 'Forces de l’ordre & soignants',
  },
];

export const BADGE_DEPOSIT = 20; // caution badge, en €
