import { formatDuration, type Track } from '../data/catalog';
import type { PlaybackSource } from '../lib/events';
import { selectCurrentTrackId, usePlayerStore } from '../store/usePlayerStore';

import { LikeButton } from './LikeButton';
import { EqualizerIcon, PlayIcon } from './icons';

// Mismas columnas en la cabecera y en las filas, para que todo cuadre.
const GRID = 'grid grid-cols-[16px_minmax(0,4fr)_minmax(0,2fr)_auto] items-center gap-4';

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
    <li
      className={`group ${GRID} rounded-md px-4 py-2 transition hover:bg-white/10 ${
        isCurrent ? 'bg-white/5' : ''
      }`}
    >
      {/* Numero de pista que se convierte en play al pasar por encima. */}
      <button
        type="button"
        onClick={onPlay}
        aria-label={`Reproducir ${track.title} de ${track.artist}`}
        className="flex h-4 w-4 items-center justify-center text-sm tabular-nums text-subdued"
      >
        {isCurrent && isPlaying ? (
          <EqualizerIcon className="text-accent" />
        ) : (
          <>
            <span className={`group-hover:hidden ${isCurrent ? 'text-accent' : ''}`}>
              {position}
            </span>
            <PlayIcon className="hidden h-3.5 w-3.5 text-white group-hover:block" />
          </>
        )}
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <img
          src={track.coverUrl}
          alt=""
          loading="lazy"
          className="h-10 w-10 shrink-0 rounded object-cover"
        />
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-medium ${
              isCurrent ? 'text-accent' : 'text-white'
            }`}
          >
            {track.title}
          </p>
          <p className="truncate text-xs text-subdued group-hover:text-white">
            {track.artist}
          </p>
        </div>
      </div>

      <span className="truncate text-sm text-subdued">{track.genre}</span>

      <div className="flex items-center justify-end gap-4">
        <LikeButton trackId={track.id} revealOnHover />
        <span className="w-10 text-right text-sm tabular-nums text-subdued">
          {formatDuration(track.durationSeconds)}
        </span>
      </div>
    </li>
  );
}

interface TrackListProps {
  tracks: Track[];
  /** Se propaga a `track_played` como `source`. */
  source: PlaybackSource;
  /** La cabecera de columnas solo tiene sentido en la vista de playlist. */
  showHeader?: boolean;
}

export function TrackList({
  tracks,
  source,
  showHeader = false,
}: TrackListProps): JSX.Element {
  const playQueue = usePlayerStore((s) => s.playQueue);
  const currentTrackId = usePlayerStore(selectCurrentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const trackIds = tracks.map((t) => t.id);

  return (
    <div>
      {showHeader && (
        <div
          className={`${GRID} mb-2 border-b border-white/10 px-4 pb-2 text-xs uppercase tracking-wide text-subdued`}
        >
          <span className="text-center">#</span>
          <span>Titulo</span>
          <span>Genero</span>
          <span className="text-right">Duracion</span>
        </div>
      )}

      <ul>
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
    </div>
  );
}
