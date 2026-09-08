import { SearchIcon } from './icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/** Pill de busqueda del top bar. */
export function SearchBar({ value, onChange }: SearchBarProps): JSX.Element {
  return (
    <label className="flex h-12 w-full items-center gap-3 rounded-full bg-surface-elevated px-4 ring-1 ring-transparent transition hover:bg-surface-hover hover:ring-white/20 focus-within:!ring-white">
      <SearchIcon className="h-5 w-5 shrink-0 text-subdued" />
      <input
        type="search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder="Que te apetece escuchar?"
        aria-label="Buscar en el catalogo"
        className="w-full bg-transparent text-sm text-white placeholder:text-subdued focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
    </label>
  );
}
