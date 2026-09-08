import { useEffect } from 'react';

import { LibraryPanel } from './components/LibraryPanel';
import { PlayerBar } from './components/PlayerBar';
import { TopBar } from './components/TopBar';
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
      return <SearchView navigate={navigate} />;
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
    // Fondo negro con paneles redondeados flotando encima, como el Spotify
    // actual: top bar arriba, biblioteca + contenido en medio, player abajo.
    <div className="flex h-screen flex-col gap-2 bg-black p-2">
      <TopBar route={route} navigate={navigate} />

      <div className="flex min-h-0 flex-1 gap-2">
        <LibraryPanel route={route} navigate={navigate} />

        <main
          // `key` fuerza que el scroll vuelva arriba al cambiar de vista, que
          // es lo que hace cualquier navegacion de verdad.
          key={route.name === 'playlist' ? `playlist-${route.playlistId}` : route.name}
          className="min-w-0 flex-1 overflow-y-auto rounded-lg bg-surface-base"
        >
          <CurrentView route={route} navigate={navigate} />
        </main>
      </div>

      <PlayerBar />
      <YouTubeHost />
    </div>
  );
}
