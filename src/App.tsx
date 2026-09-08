import { useEffect } from 'react';

import { PlayerBar } from './components/PlayerBar';
import { Sidebar } from './components/Sidebar';
import { YouTubeHost } from './components/YouTubeHost';
import { setCurrentPage, track } from './lib/analytics';
import { routeToPageName, useRoute, type Route } from './router/useRoute';
import { Home } from './views/Home';
import { PlaylistView } from './views/PlaylistView';
import { SearchView } from './views/SearchView';

function CurrentView({
  route,
  navigate,
}: {
  route: Route;
  navigate: (route: Route) => void;
}): JSX.Element {
  switch (route.name) {
    case 'home':
      return <Home navigate={navigate} />;
    case 'playlist':
      return <PlaylistView playlistId={route.playlistId} />;
    case 'search':
      return <SearchView />;
  }
}

export function App(): JSX.Element {
  const { route, navigate } = useRoute();
  const pageName = routeToPageName(route);

  // El orden importa: primero se actualiza la propiedad global, y solo despues
  // se emite el evento, para que `page_viewed` lleve ya la vista nueva.
  useEffect(() => {
    setCurrentPage(pageName);
    track('page_viewed', { page_name: pageName });
  }, [pageName]);

  return (
    <div className="flex h-screen flex-col bg-surface-base text-neutral-200">
      <div className="flex min-h-0 flex-1">
        <Sidebar route={route} navigate={navigate} />

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {/* En movil no hay sidebar: navegacion minima arriba. */}
          <div className="mb-4 flex gap-2 md:hidden">
            <button
              type="button"
              onClick={() => {
                navigate({ name: 'home' });
              }}
              className="rounded-full bg-surface-raised px-4 py-1.5 text-sm text-neutral-300"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => {
                navigate({ name: 'search' });
              }}
              className="rounded-full bg-surface-raised px-4 py-1.5 text-sm text-neutral-300"
            >
              Buscar
            </button>
          </div>

          <CurrentView route={route} navigate={navigate} />
        </main>

      </div>

      <PlayerBar />
      <YouTubeHost />
    </div>
  );
}
