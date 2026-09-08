import { create } from 'zustand';

import { getTrack, type Track } from '../data/catalog';
import { track } from '../lib/analytics';
import type { PlaybackSource, SkipReason } from '../lib/events';

/**
 * Contrato agnostico de proveedor que el store usa para mandar ordenes al
 * reproductor. `useYouTubePlayer` es quien lo implementa; el store nunca sabe
 * que detras hay YouTube.
 */
export interface PlayerController {
  load: (videoId: string, autoplay: boolean) => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  setVolume: (level: number) => void;
}

const RECENT_LIMIT = 8;

interface PlayerState {
  controller: PlayerController | null;
  /** Ids de track en orden de cola. */
  queue: string[];
  /** -1 cuando no hay nada cargado. */
  currentIndex: number;
  /** De donde salio la reproduccion actual; se reusa al reanudar. */
  source: PlaybackSource;
  isPlaying: boolean;
  shuffle: boolean;
  /** 0-100. */
  volume: number;
  positionSeconds: number;
  /** Duracion real reportada por el player; cae a la del catalogo si es 0. */
  durationSeconds: number;
  likedTrackIds: string[];
  recentTrackIds: string[];
  /** Corta el bucle si toda la cola falla al reproducirse. */
  consecutiveErrors: number;

  registerController: (controller: PlayerController | null) => void;
  playQueue: (trackIds: string[], startIndex: number, source: PlaybackSource) => void;
  togglePlayPause: () => void;
  skipNext: () => void;
  skipPrevious: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (level: number) => void;
  reportVolumeChanged: (level: number) => void;
  toggleShuffle: () => void;
  toggleLike: (trackId: string) => void;
  reportProgress: (positionSeconds: number, durationSeconds: number) => void;
  handleEnded: () => void;
  handlePlaybackError: () => void;
}

export const selectCurrentTrackId = (state: PlayerState): string | undefined =>
  state.currentIndex >= 0 ? state.queue[state.currentIndex] : undefined;

export const selectCurrentTrack = (state: PlayerState): Track | undefined => {
  const trackId = selectCurrentTrackId(state);
  return trackId === undefined ? undefined : getTrack(trackId);
};

export const usePlayerStore = create<PlayerState>((set, get) => {
  /** Duracion efectiva para calcular porcentajes. */
  const effectiveDuration = (state: PlayerState, trackId: string): number => {
    if (state.durationSeconds > 0) return state.durationSeconds;
    return getTrack(trackId)?.durationSeconds ?? 0;
  };

  const emitSkipped = (state: PlayerState, reason: SkipReason): void => {
    const trackId = selectCurrentTrackId(state);
    if (trackId === undefined) return;

    const duration = effectiveDuration(state, trackId);
    const percent =
      duration > 0
        ? Math.min(100, Math.round((state.positionSeconds / duration) * 100))
        : 0;

    track('track_skipped', {
      track_id: trackId,
      position_seconds: Math.round(state.positionSeconds),
      percent_listened: percent,
      reason,
    });
  };

  const emitPlayed = (item: Track, source: PlaybackSource): void => {
    track('track_played', {
      track_id: item.id,
      track_name: item.title,
      artist: item.artist,
      genre: item.genre,
      source,
    });
  };

  /** Siguiente indice; con shuffle activo elige otro al azar. */
  const pickIndex = (state: PlayerState, direction: 1 | -1): number => {
    const { queue, currentIndex, shuffle } = state;
    if (queue.length === 0) return -1;
    if (queue.length === 1) return 0;

    if (shuffle) {
      let candidate = currentIndex;
      while (candidate === currentIndex) {
        candidate = Math.floor(Math.random() * queue.length);
      }
      return candidate;
    }

    const raw = currentIndex + direction;
    return ((raw % queue.length) + queue.length) % queue.length;
  };

  /** Carga y arranca el track en `index`, y emite `track_played`. */
  const startAt = (index: number, source: PlaybackSource): void => {
    const state = get();
    const trackId = state.queue[index];
    if (trackId === undefined) return;

    const item = getTrack(trackId);
    if (item === undefined) return;

    set({
      currentIndex: index,
      source,
      isPlaying: true,
      positionSeconds: 0,
      durationSeconds: item.durationSeconds,
      recentTrackIds: [
        trackId,
        ...state.recentTrackIds.filter((id) => id !== trackId),
      ].slice(0, RECENT_LIMIT),
    });

    state.controller?.load(item.youtubeVideoId, true);
    emitPlayed(item, source);
  };

  return {
    controller: null,
    queue: [],
    currentIndex: -1,
    source: 'playlist',
    isPlaying: false,
    shuffle: false,
    volume: 70,
    positionSeconds: 0,
    durationSeconds: 0,
    likedTrackIds: [],
    recentTrackIds: [],
    consecutiveErrors: 0,

    registerController: (controller) => {
      set({ controller });
      controller?.setVolume(get().volume);
    },

    playQueue: (trackIds, startIndex, source) => {
      if (trackIds.length === 0) return;
      set({ queue: trackIds, consecutiveErrors: 0 });
      startAt(startIndex, source);
    },

    togglePlayPause: () => {
      const state = get();
      const trackId = selectCurrentTrackId(state);

      // Nada cargado: el boton de play arranca la cola si la hay.
      if (trackId === undefined) {
        if (state.queue.length > 0) startAt(0, state.source);
        return;
      }

      if (state.isPlaying) {
        state.controller?.pause();
        set({ isPlaying: false });
        track('track_paused', {
          track_id: trackId,
          position_seconds: Math.round(state.positionSeconds),
        });
        return;
      }

      const item = getTrack(trackId);
      state.controller?.play();
      set({ isPlaying: true });
      // Reanudar cuenta como play, conservando el source original.
      if (item !== undefined) emitPlayed(item, state.source);
    },

    skipNext: () => {
      const state = get();
      if (state.queue.length === 0) return;
      emitSkipped(state, 'user');
      startAt(pickIndex(state, 1), 'queue');
    },

    skipPrevious: () => {
      const state = get();
      if (state.queue.length === 0) return;
      emitSkipped(state, 'user');
      startAt(pickIndex(state, -1), 'queue');
    },

    seekTo: (seconds) => {
      const state = get();
      state.controller?.seek(seconds);
      set({ positionSeconds: seconds });
    },

    setVolume: (level) => {
      const clamped = Math.min(100, Math.max(0, Math.round(level)));
      get().controller?.setVolume(clamped);
      set({ volume: clamped });
    },

    // Separado de setVolume: el slider actualiza en cada pixel, pero el evento
    // solo se manda cuando el usuario deja de moverlo (debounce en el control).
    reportVolumeChanged: (level) => {
      track('volume_changed', { level });
    },

    toggleShuffle: () => {
      const enabled = !get().shuffle;
      set({ shuffle: enabled });
      track('shuffle_toggled', { enabled });
    },

    toggleLike: (trackId) => {
      const item = getTrack(trackId);
      if (item === undefined) return;

      const { likedTrackIds } = get();
      const isLiked = likedTrackIds.includes(trackId);

      set({
        likedTrackIds: isLiked
          ? likedTrackIds.filter((id) => id !== trackId)
          : [...likedTrackIds, trackId],
      });

      track(isLiked ? 'track_unliked' : 'track_liked', {
        track_id: trackId,
        genre: item.genre,
      });
    },

    reportProgress: (positionSeconds, durationSeconds) => {
      const patch: Partial<PlayerState> = { positionSeconds };
      if (durationSeconds > 0) patch.durationSeconds = durationSeconds;
      // Si suena de verdad, la racha de errores queda cancelada.
      if (positionSeconds > 0 && get().consecutiveErrors !== 0) {
        patch.consecutiveErrors = 0;
      }
      set(patch);
    },

    handleEnded: () => {
      const state = get();
      const trackId = selectCurrentTrackId(state);
      const item = trackId === undefined ? undefined : getTrack(trackId);

      if (item !== undefined) {
        track('track_completed', { track_id: item.id, genre: item.genre });
      }

      const nextIndex = pickIndex(state, 1);
      if (nextIndex < 0) {
        set({ isPlaying: false });
        return;
      }
      startAt(nextIndex, 'queue');
    },

    handlePlaybackError: () => {
      const state = get();
      emitSkipped(state, 'playback_error');

      // Si ya ha fallado toda la cola, para en vez de girar en vacio.
      const errors = state.consecutiveErrors + 1;
      if (errors >= state.queue.length) {
        set({ isPlaying: false, consecutiveErrors: errors });
        return;
      }

      set({ consecutiveErrors: errors });
      startAt(pickIndex(state, 1), 'queue');
    },
  };
});
