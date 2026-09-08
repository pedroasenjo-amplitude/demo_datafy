/**
 * Iconos inline. Trazos y proporciones aproximados a los de Spotify; van aqui
 * juntos para que los componentes no se llenen de SVG.
 */

interface IconProps {
  className?: string;
}

export function PlayIcon({ className = 'h-4 w-4' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z" />
    </svg>
  );
}

export function PauseIcon({ className = 'h-4 w-4' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M5.7 3a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h3.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7H5.7zm9 0a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h3.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7h-3.6z" />
    </svg>
  );
}

export function PreviousIcon({ className = 'h-4 w-4' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
      <path d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z" />
    </svg>
  );
}

export function NextIcon({ className = 'h-4 w-4' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z" />
    </svg>
  );
}

export function ShuffleIcon({ className = 'h-4 w-4' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
      <path d="M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356a2.25 2.25 0 011.724-.804h1.947l-1.017 1.018a.75.75 0 001.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 00.39 3.5z" />
      <path d="M7.5 10.723l.98-1.167.957 1.14a2.25 2.25 0 001.724.804h1.947l-1.017-1.018a.75.75 0 111.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 11-1.06-1.06L13.109 13H11.16a3.75 3.75 0 01-2.873-1.34l-.787-.937z" />
    </svg>
  );
}

export function HeartIcon({
  filled,
  className = 'h-4 w-4',
}: IconProps & { filled: boolean }): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
    >
      <path d="M12 20.5 4.2 12.9a4.9 4.9 0 0 1 0-7 5 5 0 0 1 7 0l.8.8.8-.8a5 5 0 0 1 7 0 4.9 4.9 0 0 1 0 7Z" />
    </svg>
  );
}

export function SearchIcon({ className = 'h-4 w-4' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function HomeIcon({ className = 'h-5 w-5' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33z" />
    </svg>
  );
}

export function LibraryIcon({ className = 'h-6 w-6' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zm6 0a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zm7.29-.94a1 1 0 01-1.23-.7L12.5 4.06a1 1 0 011.93-.52l4.56 16.3a1 1 0 01-.7 1.22z" />
    </svg>
  );
}

export function VolumeIcon({
  level,
  className = 'h-4 w-4',
}: IconProps & { level: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 9.5h3l4.5-3.5v12L7 14.5H4Z" fill="currentColor" />
      {level > 0 && (
        <path
          d="M16 8.8a4.5 4.5 0 0 1 0 6.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
      {level > 50 && (
        <path
          d="M18.8 6.5a8 8 0 0 1 0 11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * Barritas animadas que Spotify muestra en la fila que esta sonando. Van con
 * divs y keyframes de CSS, no con SMIL: se anima la altura de cada barra con
 * un desfase distinto.
 */
export function EqualizerIcon({ className = '' }: IconProps): JSX.Element {
  return (
    <span
      className={`flex h-3.5 w-3.5 items-end justify-center gap-[2px] ${className}`}
      aria-hidden="true"
    >
      <span className="w-[2px] animate-eq bg-current" style={{ animationDelay: '0ms' }} />
      <span className="w-[2px] animate-eq bg-current" style={{ animationDelay: '150ms' }} />
      <span className="w-[2px] animate-eq bg-current" style={{ animationDelay: '300ms' }} />
    </span>
  );
}
