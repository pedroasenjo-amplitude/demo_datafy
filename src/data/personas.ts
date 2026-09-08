import type { Plan } from '../lib/events';

/**
 * Usuarios simulados. Personas ficticias: sirven para ver cohortes distintas
 * en Amplitude sin tocar datos de nadie real.
 */
export interface Persona {
  id: string;
  name: string;
  avatarUrl: string;
  plan: Plan;
  country: string;
  favoriteGenre: string;
}

export const personas: Persona[] = [
  {
    id: 'nora',
    name: 'Nora Villalba',
    avatarUrl: 'https://picsum.photos/seed/persona-nora/80/80',
    plan: 'premium',
    country: 'ES',
    favoriteGenre: 'Indie',
  },
  {
    id: 'tomas',
    name: 'Tomas Iriarte',
    avatarUrl: 'https://picsum.photos/seed/persona-tomas/80/80',
    plan: 'free',
    country: 'AR',
    favoriteGenre: 'Rock',
  },
  {
    id: 'aisha',
    name: 'Aisha Ndiaye',
    avatarUrl: 'https://picsum.photos/seed/persona-aisha/80/80',
    plan: 'premium',
    country: 'FR',
    favoriteGenre: 'Hip-Hop',
  },
  {
    id: 'kenji',
    name: 'Kenji Watanabe',
    avatarUrl: 'https://picsum.photos/seed/persona-kenji/80/80',
    plan: 'free',
    country: 'JP',
    favoriteGenre: 'Electronica',
  },
];
