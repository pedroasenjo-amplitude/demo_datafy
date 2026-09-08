/**
 * Declaraciones minimas de la YouTube IFrame Player API: solo la superficie que
 * usa `useYouTubePlayer`. Se mantiene a mano para no depender de @types/youtube
 * y para que ningun modulo necesite `any`.
 *
 * Referencia: https://developers.google.com/youtube/iframe_api_reference
 */

declare namespace YT {
  /** Valores que devuelve getPlayerState() / onStateChange. */
  type PlayerStateValue = -1 | 0 | 1 | 2 | 3 | 5;

  interface PlayerStateMap {
    readonly UNSTARTED: -1;
    readonly ENDED: 0;
    readonly PLAYING: 1;
    readonly PAUSED: 2;
    readonly BUFFERING: 3;
    readonly CUED: 5;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: PlayerStateValue;
  }

  /**
   * Codigos de error del player: 2 = videoId invalido, 5 = fallo del
   * reproductor HTML5, 100 = video no encontrado o privado, 101 y 150 = el
   * propietario no permite reproducirlo embebido.
   */
  interface OnErrorEvent extends PlayerEvent {
    data: 2 | 5 | 100 | 101 | 150;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    modestbranding?: 0 | 1;
    origin?: string;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
    };
  }

  interface LoadVideoByIdOptions {
    videoId: string;
    startSeconds?: number;
  }

  class Player {
    constructor(element: HTMLElement | string, options: PlayerOptions);
    loadVideoById(options: LoadVideoByIdOptions): void;
    cueVideoById(options: LoadVideoByIdOptions): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    setVolume(volume: number): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): PlayerStateValue;
    destroy(): void;
  }
}

interface Window {
  YT?: {
    Player: typeof YT.Player;
    PlayerState: YT.PlayerStateMap;
  };
  onYouTubeIframeAPIReady?: () => void;
}
