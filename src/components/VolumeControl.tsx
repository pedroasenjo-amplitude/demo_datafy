import { useEffect, useRef } from 'react';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePlayerStore } from '../store/usePlayerStore';

const VOLUME_EVENT_DEBOUNCE_MS = 400;

/**
 * El volumen se aplica al player en cada pixel del slider, pero
 * `volume_changed` solo se emite cuando el usuario para de arrastrar: un evento
 * por gesto, no cuarenta.
 */
export function VolumeControl(): JSX.Element {
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const reportVolumeChanged = usePlayerStore((s) => s.reportVolumeChanged);

  const debouncedVolume = useDebouncedValue(volume, VOLUME_EVENT_DEBOUNCE_MS);
  const lastReported = useRef(volume);

  useEffect(() => {
    if (debouncedVolume === lastReported.current) return;
    lastReported.current = debouncedVolume;
    reportVolumeChanged(debouncedVolume);
  }, [debouncedVolume, reportVolumeChanged]);

  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-400" aria-hidden="true">
        <path
          d="M4 9.5h3l4.5-3.5v12L7 14.5H4Z"
          fill="currentColor"
        />
        {volume > 0 && (
          <path
            d="M16 8.8a4.5 4.5 0 0 1 0 6.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        )}
        {volume > 50 && (
          <path
            d="M18.8 6.5a8 8 0 0 1 0 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        )}
      </svg>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={volume}
        aria-label="Volumen"
        onChange={(event) => {
          setVolume(Number(event.target.value));
        }}
        className="h-1 w-24 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        style={{
          background: `linear-gradient(to right, #1ed787 ${volume}%, #404040 ${volume}%)`,
        }}
      />
    </div>
  );
}
