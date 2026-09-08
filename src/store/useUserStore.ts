import { create } from 'zustand';

import type { Persona } from '../data/personas';
import { identifySimulatedUser } from '../lib/analytics';
import { track } from '../lib/analytics';

/** userId pseudoaleatorio, solo en memoria: cada recarga es un usuario nuevo. */
function randomUserId(prefix: string): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${suffix}`;
}

interface UserState {
  userId: string;
  /** `null` hasta que se elige una persona en el selector. */
  persona: Persona | null;
  switchPersona: (persona: Persona) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: randomUserId('anon'),
  persona: null,

  switchPersona: (persona) => {
    // Cambiar de persona simulada resetea la identidad por completo: nuevo
    // userId, no un alias del anterior.
    const userId = randomUserId(persona.id);
    set({ userId, persona });

    identifySimulatedUser(userId, {
      plan: persona.plan,
      country: persona.country,
      favorite_genre: persona.favoriteGenre,
      display_name: persona.name,
    });

    track('simulated_user_switched', { plan: persona.plan });
  },
}));
