// État partagé entre le scroll (DOM) et la scène 3D, sans re-render React.
export const story = {
  jungle: 0,   // 0 → 1 : on écarte les feuilles → la tribu
  name: 0,     // 0 → 1 : chapitre « ton prénom »
  people: 0,   // 0 → 1 : chapitre « les gens »
  session: 0,  // 0 → 1 : la séance (accueil → WOD)
  last: 0,     // 0 → 1 : « le dernier »
  cheer: 0,    // 0 → 1 : intensité des encouragements
  scaling: 0,  // 0 → 1 : « ouvert à tous »
  formats: 0,  // 0 → 1 : CrossFit → Hyrox → ATHX
  week: 0,     // 0 → 1 : le planning
  plans: 0,    // 0 → 1 : les tarifs
  trial: 0,    // 0 → 1 : la séance d'essai
  greeted: 0,  // 0 → 1 : impulsion quand le visiteur donne son prénom
  velocity: 0,
  mouseX: 0,
  mouseY: 0,
  // poids de mise en lumière des archétypes (chapitre « les gens »)
  highlight: [0, 0, 0, 0, 0] as number[],
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// smoothstep sûr (bornes jamais égales)
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / Math.max(b - a, 1e-4));
  return t * t * (3 - 2 * t);
};

// Fenêtre d'apparition/disparition d'un élément selon une progression
export const windowed = (x: number, start: number, end: number, fade = 0.06) =>
  smooth(start, start + fade, x) * (1 - smooth(end - fade, end, x));
