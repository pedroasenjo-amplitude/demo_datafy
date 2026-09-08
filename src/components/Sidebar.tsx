import { playlists } from '../data/catalog';
import type { Route } from '../router/useRoute';

import { UserSwitcher } from './UserSwitcher';

interface SidebarProps {
  route: Route;
  navigate: (route: Route) => void;
}

export function Sidebar({ route, navigate }: SidebarProps): JSX.Element {
  const navItemClass = (isActive: boolean): string =>
    `flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
      isActive ? 'bg-surface-hover text-neutral-100' : 'text-neutral-400 hover:text-neutral-100'
    }`;

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-4 border-r border-white/10 bg-surface-base p-4 md:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
          D
        </span>
        <span className="text-lg font-bold tracking-tight text-neutral-100">Datafy</span>
      </div>

      <nav className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => {
            navigate({ name: 'home' });
          }}
          className={navItemClass(route.name === 'home')}
        >
          Inicio
        </button>
        <button
          type="button"
          onClick={() => {
            navigate({ name: 'search' });
          }}
          className={navItemClass(route.name === 'search')}
        >
          Buscar
        </button>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Playlists
        </p>
        <ul className="flex flex-col gap-0.5">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <button
                type="button"
                onClick={() => {
                  navigate({ name: 'playlist', playlistId: playlist.id });
                }}
                className={navItemClass(
                  route.name === 'playlist' && route.playlistId === playlist.id,
                )}
              >
                <span className="truncate">{playlist.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <UserSwitcher />
    </aside>
  );
}
