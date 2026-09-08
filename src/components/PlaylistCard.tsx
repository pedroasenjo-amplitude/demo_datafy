import type { Playlist } from '../data/catalog';

import { PlayButton } from './PlayButton';

interface PlaylistCardProps {
  playlist: Playlist;
  isPlaying: boolean;
  onOpen: () => void;
  onPlay: () => void;
}

/**
 * Tarjeta de playlist con el boton de play que aparece deslizandose al hacer
 * hover. Abrir y reproducir son dos botones hermanos, no anidados.
 */
export function PlaylistCard({
  playlist,
  isPlaying,
  onOpen,
  onPlay,
}: PlaylistCardProps): JSX.Element {
  return (
    <div className="group relative rounded-lg bg-surface-panel p-4 transition hover:bg-surface-hover">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
        aria-label={`Abrir la playlist ${playlist.name}`}
      >
        <img
          src={playlist.coverUrl}
          alt=""
          loading="lazy"
          className="mb-4 aspect-square w-full rounded-md object-cover shadow-lg"
        />
        <span className="block truncate text-base font-semibold text-white">
          {playlist.name}
        </span>
        <span className="mt-1 line-clamp-2 block text-sm text-subdued">
          {playlist.description}
        </span>
      </button>

      {/* Sube y aparece en hover; si ya suena, se queda visible. */}
      <PlayButton
        isPlaying={isPlaying}
        onClick={onPlay}
        label={`Reproducir ${playlist.name}`}
        className={`absolute bottom-[88px] right-6 transition-all duration-300 ${
          isPlaying
            ? 'translate-y-0 opacity-100'
            : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100'
        }`}
      />
    </div>
  );
}
