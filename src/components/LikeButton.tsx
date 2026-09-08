import { usePlayerStore } from '../store/usePlayerStore';

interface LikeButtonProps {
  trackId: string;
  className?: string;
}

export function LikeButton({ trackId, className = '' }: LikeButtonProps): JSX.Element {
  const isLiked = usePlayerStore((s) => s.likedTrackIds.includes(trackId));
  const toggleLike = usePlayerStore((s) => s.toggleLike);

  return (
    <button
      type="button"
      aria-label={isLiked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      aria-pressed={isLiked}
      onClick={(event) => {
        event.stopPropagation();
        toggleLike(trackId);
      }}
      className={`rounded-full p-1.5 transition hover:bg-white/10 ${
        isLiked ? 'text-accent' : 'text-neutral-500 hover:text-neutral-200'
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 20.5 4.2 12.9a4.9 4.9 0 0 1 0-7 5 5 0 0 1 7 0l.8.8.8-.8a5 5 0 0 1 7 0 4.9 4.9 0 0 1 0 7Z"
          fill={isLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    </button>
  );
}
