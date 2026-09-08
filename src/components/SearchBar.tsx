interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps): JSX.Element {
  return (
    <label className="flex items-center gap-3 rounded-full bg-surface-raised px-4 py-2.5 ring-1 ring-white/10 focus-within:ring-accent/60">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-neutral-500"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder="Canciones, artistas o generos"
        aria-label="Buscar en el catalogo"
        className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
      />
    </label>
  );
}
