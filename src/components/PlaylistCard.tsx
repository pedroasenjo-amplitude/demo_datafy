import type { Playlist } from '../data/catalog';

interface PlaylistCardProps {
  playlist: Playlist;
  onOpen: () => void;
}

export function PlaylistCard({ playlist, onOpen }: PlaylistCardProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col gap-3 rounded-lg bg-surface-raised p-4 text-left transition hover:bg-surface-hover"
    >
      <img
        src={playlist.coverUrl}
        alt=""
        loading="lazy"
        className="aspect-square w-full rounded-md object-cover shadow-lg"
      />
      <span>
        <span className="block truncate text-sm font-semibold text-neutral-100">
          {playlist.name}
        </span>
        <span className="mt-1 line-clamp-2 block text-xs text-neutral-400">
          {playlist.description}
        </span>
      </span>
    </button>
  );
}
