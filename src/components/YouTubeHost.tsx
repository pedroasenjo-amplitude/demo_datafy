import { useMemo } from 'react';

import { useYouTubePlayer, type YouTubePlayerHandlers } from '../hooks/useYouTubePlayer';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * Monta el player de YouTube y cablea sus callbacks al store. Se renderiza una
 * sola vez, en el shell de la app.
 *
 * Se deja visible en pequeño a proposito: los navegadores son mucho mas
 * fiables autorreproduciendo un iframe que esta en pantalla que uno con
 * display:none. Los controles nativos van desactivados y una capa transparente
 * se come los clicks, para que el store siga siendo la unica fuente de verdad.
 */
export function YouTubeHost(): JSX.Element {
  const registerController = usePlayerStore((s) => s.registerController);
  const handleEnded = usePlayerStore((s) => s.handleEnded);
  const handlePlaybackError = usePlayerStore((s) => s.handlePlaybackError);
  const reportProgress = usePlayerStore((s) => s.reportProgress);

  const handlers = useMemo<YouTubePlayerHandlers>(
    () => ({
      onReady: registerController,
      onEnded: handleEnded,
      onError: handlePlaybackError,
      onProgress: reportProgress,
    }),
    [registerController, handleEnded, handlePlaybackError, reportProgress],
  );

  const { containerRef } = useYouTubePlayer(handlers);

  return (
    <div className="fixed bottom-28 right-3 z-40 aspect-video w-28 overflow-hidden rounded-lg border border-white/10 bg-black shadow-xl sm:w-40">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
