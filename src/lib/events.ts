/**
 * Contrato de la taxonomia de eventos.
 *
 * `EventMap` es la unica fuente de verdad: asocia cada nombre de evento con la
 * forma exacta de sus event properties. `track()` en `analytics.ts` es generico
 * sobre este mapa, de modo que una propiedad mal escrita, sobrante o ausente es
 * un error de compilacion, no un evento sucio en produccion.
 */

/** De donde arranco la reproduccion. */
export type PlaybackSource = 'playlist' | 'search' | 'queue' | 'recent';

/** Por que se abandono un track antes de terminarlo. */
export type SkipReason = 'user' | 'playback_error';

export type Plan = 'free' | 'premium';

/** Nombres de vista; se envian en `page_viewed` y como propiedad global. */
export type PageName = 'home' | 'playlist' | 'search';

/** Objeto de propiedades vacio, distinguible por `keyof` (a diferencia de `{}`). */
export type NoProperties = Record<never, never>;

export interface EventMap {
  app_opened: NoProperties;
  page_viewed: { page_name: PageName };
  search_performed: { query: string; results_count: number };
  playlist_opened: { playlist_id: string; playlist_name: string; genre: string };
  track_played: {
    track_id: string;
    track_name: string;
    artist: string;
    genre: string;
    source: PlaybackSource;
  };
  track_paused: { track_id: string; position_seconds: number };
  track_skipped: {
    track_id: string;
    position_seconds: number;
    percent_listened: number;
    reason: SkipReason;
  };
  track_completed: { track_id: string; genre: string };
  track_liked: { track_id: string; genre: string };
  track_unliked: { track_id: string; genre: string };
  shuffle_toggled: { enabled: boolean };
  volume_changed: { level: number };
  simulated_user_switched: { plan: Plan };
}

export type EventName = keyof EventMap;

/**
 * Hace opcional el segundo argumento de `track()` solo para los eventos que no
 * llevan propiedades (hoy, `app_opened`).
 */
export type EventArgs<E extends EventName> = keyof EventMap[E] extends never
  ? [properties?: EventMap[E]]
  : [properties: EventMap[E]];

/** Propiedad global inyectada en todos los eventos por el plugin de enrichment. */
export interface GlobalEventProperties {
  current_page: PageName;
}

/** User properties que se envian con `identify` al cambiar de usuario simulado. */
export interface SimulatedUserProperties {
  plan: Plan;
  country: string;
  favorite_genre: string;
  display_name: string;
}
