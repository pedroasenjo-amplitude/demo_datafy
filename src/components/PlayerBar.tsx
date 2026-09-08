import type { ReactNode } from 'react';

import { selectCurrentTrack, usePlayerStore } from '../store/usePlayerStore';

import { LikeButton } from './LikeButton';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';

function IconButton({
  label,
  onClick,
  active = false,
  primary = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  primary?: boolean;
  children: ReactNode;
}): JSX.Element {
  const base = primary
    ? 'bg-white text-black hover:bg-neutral-200 h-9 w-9'
    : `h-8 w-8 hover:text-neutral-100 ${active ? 'text-accent' : 'text-neutral-400'}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex shrink-0 items-center justify-center rounded-full transition ${base}`}
    >
      {children}
    </button>
  );
}

export function PlayerBar(): JSX.Element {
  const currentTrack = usePlayerStore(selectCurrentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const skipNext = usePlayerStore((s) => s.skipNext);
  const skipPrevious = usePlayerStore((s) => s.skipPrevious);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);

  return (
    <footer className="flex h-24 shrink-0 items-center gap-4 border-t border-white/10 bg-surface-raised px-4">
      {/* Track actual */}
      <div className="flex w-1/4 min-w-0 items-center gap-3">
        {currentTrack === undefined ? (
          <span className="text-xs text-neutral-500">Nada suena todavia</span>
        ) : (
          <>
            <img
              src={currentTrack.coverUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-100">
                {currentTrack.title}
              </p>
              <p className="truncate text-xs text-neutral-400">{currentTrack.artist}</p>
            </div>
            <LikeButton trackId={currentTrack.id} />
          </>
        )}
      </div>

      {/* Controles */}
      <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <IconButton label="Aleatorio" onClick={toggleShuffle} active={shuffle}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M4 7h3.5l3 4m2.5 3 2.5 3H20M4 17h3.5l9-13H20M17 2.5 20 4l-3 1.5M17 15.5 20 17l-3 1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>

          <IconButton label="Anterior" onClick={skipPrevious}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M18 5v14L8 12ZM6 5h2v14H6Z" fill="currentColor" />
            </svg>
          </IconButton>

          <IconButton
            label={isPlaying ? 'Pausar' : 'Reproducir'}
            onClick={togglePlayPause}
            primary
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M7 5h3.5v14H7Zm6.5 0H17v14h-3.5Z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M7 4.5 19 12 7 19.5Z" fill="currentColor" />
              </svg>
            )}
          </IconButton>

          <IconButton label="Siguiente" onClick={skipNext}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M6 5v14l10-7ZM16 5h2v14h-2Z" fill="currentColor" />
            </svg>
          </IconButton>
        </div>

        <div className="w-full max-w-xl">
          <ProgressBar />
        </div>
      </div>

      {/* Volumen */}
      <div className="hidden w-1/4 justify-end md:flex">
        <VolumeControl />
      </div>
    </footer>
  );
}
