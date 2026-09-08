import { PauseIcon, PlayIcon } from './icons';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  label: string;
  /** `lg` es el boton grande de cabecera de playlist; `sm` el de las tarjetas. */
  size?: 'sm' | 'lg';
  className?: string;
}

/**
 * Boton circular de play. Es el sitio donde el azul de marca se usa en puro:
 * relleno #0052F2 con el icono en blanco (4.6:1), nunca como color de texto.
 */
export function PlayButton({
  isPlaying,
  onClick,
  label,
  size = 'sm',
  className = '',
}: PlayButtonProps): JSX.Element {
  const sizeClass = size === 'lg' ? 'h-14 w-14' : 'h-12 w-12';
  const iconClass = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xl transition hover:scale-105 hover:bg-brand-hover active:scale-100 ${sizeClass} ${className}`}
    >
      {isPlaying ? (
        <PauseIcon className={iconClass} />
      ) : (
        // El triangulo pesa a la izquierda: se desplaza 1px para centrarlo.
        <PlayIcon className={`${iconClass} translate-x-[1px]`} />
      )}
    </button>
  );
}
