import type { ReactNode } from 'react';

import { selectCurrentTrack, usePlayerStore } from '../store/usePlayerStore';

import { LikeButton } from './LikeButton';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { NextIcon, PauseIcon, PlayIcon, PreviousIcon, ShuffleIcon } from './icons';

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}

function ControlButton({
  label,
  onClick,
  active = false,
  children,
}: ControlButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`relative flex h-8 w-8 shrink-0 items-center justify-center transition hover:scale-105 ${
        active ? 'text-accent' : 'text-subdued hover:text-white'
      }`}
    >
      {children}
      {/* Punto de estado activo debajo del icono, como en Spotify. */}
      {active && (
        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
      )}
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
    <footer className="flex h-20 shrink-0 items-center gap-4 px-2">
      {/* Izquierda: lo que suena. */}
      <div className="flex w-[30%] min-w-0 items-center gap-3">
        {currentTrack === undefined ? (
          <p className="text-xs text-subdued">Nada suena todavia</p>
        ) : (
          <>
            <img
              src={currentTrack.coverUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white hover:underline">
                {currentTrack.title}
              </p>
              <p className="truncate text-xs text-subdued hover:text-white hover:underline">
                {currentTrack.artist}
              </p>
            </div>
            <LikeButton trackId={currentTrack.id} className="ml-2" />
          </>
        )}
      </div>

      {/* Centro: controles y progreso. */}
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
        <div className="flex items-center gap-4">
          <ControlButton label="Aleatorio" onClick={toggleShuffle} active={shuffle}>
            <ShuffleIcon className="h-4 w-4" />
          </ControlButton>

          <ControlButton label="Anterior" onClick={skipPrevious}>
            <PreviousIcon className="h-4 w-4" />
          </ControlButton>

          {/* En la barra inferior el play de Spotify es BLANCO, no de marca:
              el azul se reserva para el boton grande de las paginas. */}
          <button
            type="button"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
          >
            {isPlaying ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4 translate-x-[1px]" />
            )}
          </button>

          <ControlButton label="Siguiente" onClick={skipNext}>
            <NextIcon className="h-4 w-4" />
          </ControlButton>
        </div>

        <div className="w-full max-w-2xl">
          <ProgressBar />
        </div>
      </div>

      {/* Derecha: volumen. */}
      <div className="hidden w-[30%] justify-end pr-2 md:flex">
        <VolumeControl />
      </div>
    </footer>
  );
}
