// État partagé entre le DOM (scroll) et la scène 3D, sans re-render React.
export const hybridStore = {
  hero: 0,      // 0 → 1 pendant le premier écran
  race: 0,      // 0 → 1 pendant la section "la course"
  athx: 0,      // 0 → 1 pendant la section ATHX
  velocity: 0,  // vitesse de scroll lissée (px/frame normalisés)
  mouseX: 0,    // -1 → 1
  mouseY: 0,    // -1 → 1
};

export const STATION_COUNT = 8;

// Progression "course" utile (après la descente de caméra) → u ∈ [0,1]
export const raceToU = (race: number) => Math.min(1, Math.max(0, race));

// Chaque segment = 1 km de run (RUN_PART du segment) puis la station
export const RUN_PART = 0.55;

// Distance affichée : exactement i+1 km à l'arrivée sur la station i, figée pendant la station
export const raceKm = (u: number) => {
  if (u >= 1) return STATION_COUNT;
  const i = Math.floor(u * STATION_COUNT);
  const local = u * STATION_COUNT - i;
  return i + Math.min(1, local / RUN_PART);
};

// Position d'une porte de station sur la course (u) : franchie juste après la fin du km
export const stationU = (i: number) => (i + RUN_PART + 0.12) / STATION_COUNT;
