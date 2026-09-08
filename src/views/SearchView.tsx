import { useEffect, useMemo, useRef, useState } from 'react';

import { SearchBar } from '../components/SearchBar';
import { TrackList } from '../components/TrackList';
import { searchTracks } from '../data/catalog';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { track } from '../lib/analytics';

const SEARCH_DEBOUNCE_MS = 350;

export function SearchView(): JSX.Element {
  const [query, setQuery] = useState('');
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

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-md">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {!hasQuery && (
        <p className="text-sm text-neutral-500">
          Busca por titulo, artista o genero. Prueba con &quot;rock&quot; o &quot;Adele&quot;.
        </p>
      )}

      {hasQuery && results.length === 0 && (
        <p className="text-sm text-neutral-500">
          Sin resultados para &quot;{debouncedQuery.trim()}&quot;.
        </p>
      )}

      {results.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm text-neutral-400">
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </h2>
          <TrackList tracks={results} source="search" />
        </section>
      )}
    </div>
  );
}
