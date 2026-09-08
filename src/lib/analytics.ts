import * as amplitude from '@amplitude/analytics-browser';
import type { Types } from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

import type {
  EventArgs,
  EventName,
  PageName,
  SimulatedUserProperties,
} from './events';

const API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

let initialized = false;

/**
 * Vista activa. Vive en un modulo aparte del router para que el plugin de
 * enrichment pueda leerla sin importar React ni crear un ciclo de imports.
 */
let currentPage: PageName = 'home';

export function setCurrentPage(page: PageName): void {
  currentPage = page;
}

/**
 * Inyecta `current_page` como event property en *todos* los eventos, incluidos
 * los que genera autocapture.
 */
const currentPagePlugin: Types.EnrichmentPlugin = {
  name: 'current-page-enrichment',
  type: 'enrichment',
  setup: async () => undefined,
  execute: async (event) => ({
    ...event,
    event_properties: {
      ...event.event_properties,
      current_page: currentPage,
    },
  }),
};

export function initAnalytics(): void {
  if (initialized) return;

  if (!API_KEY) {
    console.warn(
      '[analytics] VITE_AMPLITUDE_API_KEY no esta definida. La app funciona, ' +
        'pero los eventos solo se imprimen en consola. Copia .env.example a ' +
        '.env.local y pon tu key.',
    );
    return;
  }

  // Los plugins deben registrarse antes de init() para que capturen la sesion
  // completa desde el primer evento.
  amplitude.add(currentPagePlugin);
  amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));

  amplitude.init(API_KEY, {
    autocapture: true,
  });

  initialized = true;
}

/**
 * Unico punto de salida de eventos de la app. Tipado contra `EventMap`: el
 * compilador rechaza nombres desconocidos y propiedades que no encajen.
 */
export function track<E extends EventName>(event: E, ...args: EventArgs<E>): void {
  const properties = args[0];

  if (!initialized) {
    console.info('[analytics dry-run]', event, {
      ...properties,
      current_page: currentPage,
    });
    return;
  }

  amplitude.track(event, properties);
}

/** userId inicial pseudoaleatorio, sin user properties todavia. */
export function setAnalyticsUserId(userId: string): void {
  if (!initialized) {
    console.info('[analytics dry-run] setUserId', userId);
    return;
  }
  amplitude.setUserId(userId);
}

/** Resetea la identidad y manda las user properties del usuario simulado. */
export function identifySimulatedUser(
  userId: string,
  properties: SimulatedUserProperties,
): void {
  if (!initialized) {
    console.info('[analytics dry-run] identify', userId, properties);
    return;
  }

  amplitude.setUserId(userId);

  const identify = new amplitude.Identify();
  identify.set('plan', properties.plan);
  identify.set('country', properties.country);
  identify.set('favorite_genre', properties.favorite_genre);
  identify.set('display_name', properties.display_name);
  amplitude.identify(identify);
}
