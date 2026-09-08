import { useCallback, useEffect, useState } from 'react';

import type { PageName } from '../lib/events';

/**
 * Routing por hash, sin react-router. GitHub Pages sirve un unico index.html,
 * asi que el hash evita los 404 al recargar en una ruta profunda.
 */
export type Route =
  | { name: 'home' }
  | { name: 'playlist'; playlistId: string }
  | { name: 'search' };

export const routeToPageName = (route: Route): PageName => route.name;

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'playlist':
      return `#/playlist/${route.playlistId}`;
    case 'search':
      return '#/search';
  }
}

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  const segments = path.split('/').filter((s) => s !== '');

  const [first, second] = segments;

  if (first === 'playlist' && second !== undefined) {
    return { name: 'playlist', playlistId: second };
  }
  if (first === 'search') {
    return { name: 'search' };
  }
  return { name: 'home' };
}

export interface RouteApi {
  route: Route;
  navigate: (route: Route) => void;
}

export function useRoute(): RouteApi {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = (): void => {
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // Solo escribe el hash: el listener de arriba es el que actualiza el estado,
  // asi que navegar por click y navegar con los botones del navegador siguen
  // exactamente el mismo camino.
  const navigate = useCallback((next: Route): void => {
    const hash = routeToHash(next);
    if (window.location.hash === hash) return;
    window.location.hash = hash;
  }, []);

  return { route, navigate };
}
