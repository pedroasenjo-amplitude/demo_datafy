import { getTracks, playlists } from '../data/catalog';
import type { Route } from '../router/useRoute';
import { selectCurrentTrackId, usePlayerStore } from '../store/usePlayerStore';

import { EqualizerIcon, LibraryIcon } from './icons';

interface LibraryPanelProps {
  route: Route;
  navigate: (route: Route) => void;
}

/** Panel "Tu biblioteca": lista de playlists con portada, como en Spotify. */
export function LibraryPanel({ route, navigate }: LibraryPanelProps): JSX.Element {
  const currentTrackId = usePlayerStore(selectCurrentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  return (
    <aside className="hidden w-72 shrink-0 flex-col overflow-hidden rounded-lg bg-surface-panel lg:flex">
      <div className="flex items-center gap-3 px-5 py-4 text-subdued">
        <LibraryIcon className="h-6 w-6" />
        <h2 className="text-base font-bold text-white">Tu biblioteca</h2>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {playlists.map((playlist) => {
          const isOpen = route.name === 'playlist' && route.playlistId === playlist.id;
          // Suena algo de esta playlist ahora mismo?
          const isSounding =
            currentTrackId !== undefined && playlist.trackIds.includes(currentTrackId);

          return (
            <li key={playlist.id}>
              <button
                type="button"
                onClick={() => {
                  navigate({ name: 'playlist', playlistId: playlist.id });
                }}
                className={`flex w-full items-center gap-3 rounded-md p-2 text-left transition hover:bg-surface-hover ${
                  isOpen ? 'bg-surface-hover' : ''
                }`}
              >
                <img
                  src={playlist.coverUrl}
                  alt=""
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm font-medium ${
                      isSounding ? 'text-accent' : 'text-white'
                    }`}
                  >
                    {playlist.name}
                  </span>
                  <span className="block truncate text-xs text-subdued">
                    Playlist · {getTracks(playlist.trackIds).length} canciones
                  </span>
                </span>

                {isSounding && isPlaying && (
                  <EqualizerIcon className="shrink-0 text-accent" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
