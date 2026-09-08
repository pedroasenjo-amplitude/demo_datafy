import { useEffect, useMemo, useRef } from 'react';

import { TrackList } from '../components/TrackList';
import { playlists, searchTracks } from '../data/catalog';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { track } from '../lib/analytics';
import type { Route } from '../router/useRoute';
import { useSearchStore } from '../store/useSearchStore';

const SEARCH_DEBOUNCE_MS = 350;

interface SearchViewProps {
  navigate: (route: Route) => void;
}

export function SearchView({ navigate }: SearchViewProps): JSX.Element {
  // El input esta en el top bar; aqui solo se leen la query y los resultados.
  const query = useSearchStore((s) => s.query);
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  const results = useMemo(() => searchTracks(debouncedQuery), [debouncedQuery]);

  // Un evento por busqueda estabilizada, no uno por tecla.
  const lastTrackedQuery = useRef<string | null>(null);
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed === '' || trimmed === lastTrackedQuery.current) return;
    lastTrackedQuery.current = trimmed;
    track('search_performed', { query: trimmed, results_count: results.length });
  }, [debouncedQuery, results]);

  const hasQuery = debouncedQuery.trim() !== '';

  // Sin query, Spotify muestra las categorias para explorar.
  if (!hasQuery) {
    return (
      <div className="px-6 pb-10 pt-6">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-white">
          Explorar todo
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              type="button"
              onClick={() => {
                navigate({ name: 'playlist', playlistId: playlist.id });
              }}
              className="relative aspect-[1.6] overflow-hidden rounded-lg bg-brand p-4 text-left transition hover:brightness-110"
            >
              <span className="text-xl font-bold tracking-tight text-white">
                {playlist.genre}
              </span>
              <img
                src={playlist.coverUrl}
                alt=""
                loading="lazy"
                className="absolute -bottom-2 -right-4 h-20 w-20 rotate-[25deg] rounded object-cover shadow-xl"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-10 pt-6">
      {results.length === 0 ? (
        <>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            No hay resultados para &quot;{debouncedQuery.trim()}&quot;
          </h1>
          <p className="mt-3 text-sm text-subdued">
            Comprueba que las palabras esten bien escritas o prueba con otros terminos.
          </p>
        </>
      ) : (
        <>
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-white">
            Canciones
          </h1>
          <p className="mb-4 text-sm text-subdued">
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </p>
          <TrackList tracks={results} source="search" />
        </>
      )}
    </div>
  );
}
