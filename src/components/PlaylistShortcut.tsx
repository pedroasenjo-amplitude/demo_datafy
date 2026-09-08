import type { Playlist } from '../data/catalog';

import { PlayButton } from './PlayButton';

interface PlaylistShortcutProps {
  playlist: Playlist;
  isPlaying: boolean;
  onOpen: () => void;
  onPlay: () => void;
}

/**
 * Tile horizontal de la parte de arriba del Home de Spotify: portada pegada a
 * la izquierda, nombre, y boton de play que aparece en hover.
 */
export function PlaylistShortcut({
  playlist,
  isPlaying,
  onOpen,
  onPlay,
}: PlaylistShortcutProps): JSX.Element {
  return (
    <div className="group relative flex items-center overflow-hidden rounded-md bg-white/10 transition hover:bg-white/20">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
        aria-label={`Abrir la playlist ${playlist.name}`}
      >
        <img
          src={playlist.coverUrl}
          alt=""
          loading="lazy"
          className="h-20 w-20 shrink-0 object-cover shadow-lg"
        />
        <span className="min-w-0 flex-1 truncate pr-2 text-base font-bold text-white">
          {playlist.name}
        </span>
      </button>

      <PlayButton
        isPlaying={isPlaying}
        onClick={onPlay}
        label={`Reproducir ${playlist.name}`}
        className={`mr-4 transition-all duration-300 ${
          isPlaying
            ? 'translate-x-0 opacity-100'
            : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100'
        }`}
      />
    </div>
  );
}
