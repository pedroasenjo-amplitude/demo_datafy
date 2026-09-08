import { usePlayerStore } from '../store/usePlayerStore';

import { HeartIcon } from './icons';

interface LikeButtonProps {
  trackId: string;
  size?: 'sm' | 'lg';
  /** Si es true, solo se ve al hacer hover en la fila (o si ya esta marcado). */
  revealOnHover?: boolean;
  className?: string;
}

export function LikeButton({
  trackId,
  size = 'sm',
  revealOnHover = false,
  className = '',
}: LikeButtonProps): JSX.Element {
  const isLiked = usePlayerStore((s) => s.likedTrackIds.includes(trackId));
  const toggleLike = usePlayerStore((s) => s.toggleLike);

  const iconClass = size === 'lg' ? 'h-8 w-8' : 'h-4 w-4';

  // Spotify solo muestra el corazon vacio al pasar por encima de la fila; el
  // relleno se ve siempre.
  const visibility =
    revealOnHover && !isLiked
      ? 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
      : 'opacity-100';

  return (
    <button
      type="button"
      aria-label={isLiked ? 'Quitar de tus me gusta' : 'Guardar en tus me gusta'}
      aria-pressed={isLiked}
      onClick={(event) => {
        event.stopPropagation();
        toggleLike(trackId);
      }}
      className={`shrink-0 transition ${visibility} ${
        isLiked ? 'text-accent' : 'text-subdued hover:text-white'
      } ${className}`}
    >
      <HeartIcon filled={isLiked} className={iconClass} />
    </button>
  );
}
