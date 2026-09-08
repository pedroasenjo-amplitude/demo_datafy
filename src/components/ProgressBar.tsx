import { formatDuration } from '../data/catalog';
import { usePlayerStore } from '../store/usePlayerStore';

/** Barra de progreso con seek. La posicion la alimenta el ticker del player. */
export function ProgressBar(): JSX.Element {
  const positionSeconds = usePlayerStore((s) => s.positionSeconds);
  const durationSeconds = usePlayerStore((s) => s.durationSeconds);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const hasTrack = usePlayerStore((s) => s.currentIndex >= 0);

  const max = durationSeconds > 0 ? durationSeconds : 1;
  const value = Math.min(positionSeconds, max);
  const percent = (value / max) * 100;

  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-neutral-400">
        {formatDuration(positionSeconds)}
      </span>

      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        disabled={!hasTrack}
        aria-label="Progreso de la cancion"
        onChange={(event) => {
          seekTo(Number(event.target.value));
        }}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-700 accent-accent disabled:cursor-default [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        style={{
          background: `linear-gradient(to right, #1ed787 ${percent}%, #404040 ${percent}%)`,
        }}
      />

      <span className="w-9 shrink-0 text-[11px] tabular-nums text-neutral-400">
        {formatDuration(durationSeconds)}
      </span>
    </div>
  );
}
