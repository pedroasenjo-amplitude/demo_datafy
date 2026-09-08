import { useEffect, useRef } from 'react';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePlayerStore } from '../store/usePlayerStore';

import { VolumeIcon } from './icons';

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
    <div className="group flex items-center gap-2">
      <VolumeIcon level={volume} className="h-4 w-4 text-subdued group-hover:text-white" />

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
        className="h-1 w-24 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:transition-opacity group-hover:[&::-webkit-slider-thumb]:opacity-100"
        style={{
          background: `linear-gradient(to right, #0052f2 ${volume}%, #4d4d4d ${volume}%)`,
        }}
      />
    </div>
  );
}
