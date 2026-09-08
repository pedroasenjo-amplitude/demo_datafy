import { formatDuration, type Track } from '../data/catalog';
import type { PlaybackSource } from '../lib/events';
import { selectCurrentTrackId, usePlayerStore } from '../store/usePlayerStore';

import { LikeButton } from './LikeButton';

interface TrackRowProps {
  track: Track;
  position: number;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}

function TrackRow({
  track,
  position,
  isCurrent,
  isPlaying,
  onPlay,
}: TrackRowProps): JSX.Element {
  return (
    <li className="flex items-center gap-3 rounded-md px-3 py-2 transition hover:bg-surface-hover">
      {/* El boton cubre solo la zona de "reproducir": el like es un boton
          hermano, para no anidar botones. */}
      <button
        type="button"
        onClick={onPlay}
        aria-label={`Reproducir ${track.title} de ${track.artist}`}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <span
          className={`w-5 shrink-0 text-right text-sm tabular-nums ${
            isCurrent ? 'text-accent' : 'text-neutral-500'
          }`}
        >
          {isCurrent && isPlaying ? '▶' : position}
        </span>

        <img
          src={track.coverUrl}
          alt=""
          loading="lazy"
          className="h-10 w-10 shrink-0 rounded object-cover"
        />

        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-sm font-medium ${
              isCurrent ? 'text-accent' : 'text-neutral-100'
            }`}
          >
            {track.title}
          </span>
          <span className="block truncate text-xs text-neutral-400">{track.artist}</span>
        </span>
      </button>

      <span className="hidden shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-xs text-neutral-400 sm:block">
        {track.genre}
      </span>

      <LikeButton trackId={track.id} />

      <span className="w-10 shrink-0 text-right text-xs tabular-nums text-neutral-500">
        {formatDuration(track.durationSeconds)}
      </span>
    </li>
  );
}

interface TrackListProps {
  tracks: Track[];
  /** Se propaga a `track_played` como `source`. */
  source: PlaybackSource;
}

export function TrackList({ tracks, source }: TrackListProps): JSX.Element {
  const playQueue = usePlayerStore((s) => s.playQueue);
  const currentTrackId = usePlayerStore(selectCurrentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const trackIds = tracks.map((t) => t.id);

  return (
    <ul className="flex flex-col gap-0.5">
      {tracks.map((item, index) => (
        <TrackRow
          key={item.id}
          track={item}
          position={index + 1}
          isCurrent={item.id === currentTrackId}
          isPlaying={isPlaying}
          onPlay={() => {
            playQueue(trackIds, index, source);
          }}
        />
      ))}
    </ul>
  );
}
