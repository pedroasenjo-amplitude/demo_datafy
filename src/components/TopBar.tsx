import type { Route } from '../router/useRoute';
import { useSearchStore } from '../store/useSearchStore';

import { SearchBar } from './SearchBar';
import { UserSwitcher } from './UserSwitcher';
import { HomeIcon } from './icons';

interface TopBarProps {
  route: Route;
  navigate: (route: Route) => void;
}

export function TopBar({ route, navigate }: TopBarProps): JSX.Element {
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 px-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          D
        </span>
        <span className="hidden text-base font-bold tracking-tight text-white sm:block">
          Datafy
        </span>
      </div>

      {/* Home + buscador centrados, como en el Spotify actual. */}
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            navigate({ name: 'home' });
          }}
          aria-label="Inicio"
          aria-current={route.name === 'home' ? 'page' : undefined}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-elevated transition hover:scale-105 hover:bg-surface-hover ${
            route.name === 'home' ? 'text-white' : 'text-subdued'
          }`}
        >
          <HomeIcon className="h-6 w-6" />
        </button>

        <div className="min-w-0 max-w-md flex-1">
          <SearchBar
            value={query}
            onChange={(next) => {
              setQuery(next);
              // Escribir lleva a la vista de busqueda, como en Spotify.
              if (next !== '' && route.name !== 'search') {
                navigate({ name: 'search' });
              }
            }}
          />
        </div>
      </div>

      <UserSwitcher />
    </header>
  );
}
