// --- DONNÉES DU PLANNING (facile à modifier) ---
// Source : publication Instagram du 23 juin 2026 (planning en place depuis le 1er juillet),
// + ATHX le samedi 9h (à la place du WOD TEAM).
export const SCHEDULE: Record<string, { time: string; type: string }[]> = {
  LUNDI: [
    { time: "10:00", type: "HYROX" },
    { time: "11:00", type: "WOD" },
    { time: "12:15", type: "HIIT" },
    { time: "16:00", type: "ATHX" },
    { time: "17:00", type: "HYROX" },
    { time: "18:15", type: "WEIGHTLIFTING" },
    { time: "19:30", type: "WOD" },
  ],
  MARDI: [
    { time: "10:00", type: "FBB" },
    { time: "11:00", type: "HYROX" },
    { time: "12:15", type: "WOD" },
    { time: "17:00", type: "WOD" },
    { time: "18:15", type: "GYM" },
    { time: "19:30", type: "FBB" },
  ],
  MERCREDI: [
    { time: "11:00", type: "GYM" },
    { time: "12:15", type: "WOD" },
    { time: "16:00", type: "GYM" },
    { time: "17:00", type: "WOD" },
    { time: "18:15", type: "HYROX" },
    { time: "19:30", type: "WOD TEAM" },
  ],
  JEUDI: [
    { time: "10:00", type: "WEIGHTLIFTING" },
    { time: "11:00", type: "WOD" },
    { time: "12:15", type: "HYROX" },
    { time: "17:00", type: "HYROX" },
    { time: "18:15", type: "WOD" },
    { time: "19:30", type: "WEIGHTLIFTING" },
  ],
  VENDREDI: [
    { time: "10:00", type: "WOD" },
    { time: "11:00", type: "HIIT" },
    { time: "12:15", type: "WOD" },
    { time: "16:00", type: "FBB" },
    { time: "17:00", type: "WOD" },
    { time: "18:15", type: "WOD" },
    { time: "19:30", type: "HYROX" },
  ],
  SAMEDI: [
    { time: "09:00", type: "ATHX" },
    { time: "10:00", type: "WOD TEAM" },
    { time: "11:00", type: "HYROX TEAM" },
    { time: "12:15", type: "COURS SPÉ" },
  ],
};

export const DAYS = Object.keys(SCHEDULE);
