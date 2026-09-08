import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

import type { PlayerController } from '../store/usePlayerStore';

/**
 * Unico modulo de la app que conoce YouTube. Envuelve la IFrame Player API y
 * la expone como un `PlayerController` neutro mas un puñado de callbacks; ni el
 * store ni los componentes importan nada de YouTube.
 */

const IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';

let apiPromise: Promise<void> | null = null;

/** Carga el script de la IFrame API una sola vez por pagina. */
function loadIframeApi(): Promise<void> {
  if (apiPromise !== null) return apiPromise;

  apiPromise = new Promise<void>((resolve) => {
    if (window.YT?.Player !== undefined) {
      resolve();
      return;
    }

    // La API solo admite un callback global; encadenamos el que hubiera.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = (): void => {
      previous?.();
      resolve();
    };

    const script = document.createElement('script');
    script.src = IFRAME_API_SRC;
    script.async = true;
    document.head.appendChild(script);
  });

  return apiPromise;
}

export interface YouTubePlayerHandlers {
  /** El player esta listo y acepta ordenes. */
  onReady: (controller: PlayerController) => void;
  /** El video llego al final (evento ENDED). */
  onEnded: () => void;
  /** El video no se puede reproducir: embed bloqueado, borrado, privado... */
  onError: () => void;
  /** Progreso, ~2 veces por segundo. `duration` es 0 hasta tener metadatos. */
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
}

const PROGRESS_INTERVAL_MS = 500;

export function useYouTubePlayer(handlers: YouTubePlayerHandlers): {
  containerRef: RefObject<HTMLDivElement>;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);

  // Los handlers cambian en cada render; el player se crea una sola vez, asi
  // que los leemos siempre desde el ref.
  const handlersRef = useRef<YouTubePlayerHandlers>(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    let cancelled = false;
    let progressTimer: number | undefined;
    let mount: HTMLDivElement | undefined;

    const controller: PlayerController = {
      load: (videoId, autoplay) => {
        const player = playerRef.current;
        if (player === null) return;
        if (autoplay) {
          player.loadVideoById({ videoId });
        } else {
          player.cueVideoById({ videoId });
        }
      },
      play: () => {
        playerRef.current?.playVideo();
      },
      pause: () => {
        playerRef.current?.pauseVideo();
      },
      seek: (seconds) => {
        playerRef.current?.seekTo(seconds, true);
      },
      setVolume: (level) => {
        playerRef.current?.setVolume(level);
      },
    };

    void loadIframeApi().then(() => {
      const container = containerRef.current;
      const api = window.YT;
      if (cancelled || container === null || api === undefined) return;

      // La API sustituye el elemento que le pasas por un <iframe>. Le damos un
      // div propio para no arrancarle a React un nodo que el cree suyo.
      mount = document.createElement('div');
      mount.style.width = '100%';
      mount.style.height = '100%';
      container.appendChild(mount);

      new api.Player(mount, {
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            handlersRef.current.onReady(controller);
          },
          onStateChange: (event) => {
            if (event.data === api.PlayerState.ENDED) {
              handlersRef.current.onEnded();
            }
          },
          onError: () => {
            handlersRef.current.onError();
          },
        },
      });

      progressTimer = window.setInterval(() => {
        const player = playerRef.current;
        if (player === null) return;
        handlersRef.current.onProgress(player.getCurrentTime(), player.getDuration());
      }, PROGRESS_INTERVAL_MS);
    });

    return () => {
      cancelled = true;
      if (progressTimer !== undefined) window.clearInterval(progressTimer);
      playerRef.current?.destroy();
      playerRef.current = null;
      mount?.remove();
    };
  }, []);

  return { containerRef };
}
