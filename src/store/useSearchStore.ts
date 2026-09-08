import { create } from 'zustand';

/**
 * La query vive en un store propio porque el input esta en el top bar (como en
 * Spotify) pero los resultados se pintan en la vista de busqueda. El debounce y
 * el evento `search_performed` siguen siendo cosa de `SearchView`.
 */
interface SearchState {
  query: string;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => {
    set({ query });
  },
}));
