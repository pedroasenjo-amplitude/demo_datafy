import { useEffect } from 'react';

import { PlayButton } from '../components/PlayButton';
import { TrackList } from '../components/TrackList';
import { formatTotalDuration, getPlaylist, getTracks } from '../data/catalog';
import { track } from '../lib/analytics';
import { selectCurrentTrackId, usePlayerStore } from '../store/usePlayerStore';

interface PlaylistViewProps {
  playlistId: string;
}

export function PlaylistView({ playlistId }: PlaylistViewProps): JSX.Element {
  const playQueue = usePlayerStore((s) => s.playQueue);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const currentTrackId = usePlayerStore(selectCurrentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const playlist = getPlaylist(playlistId);

  // En un efecto y no en el click: asi tambien cuenta entrar por un enlace
  // directo o con el boton de atras del navegador.
  useEffect(() => {
    if (playlist === undefined) return;
    track('playlist_opened', {
      playlist_id: playlist.id,
      playlist_name: playlist.name,
      genre: playlist.genre,
    });
  }, [playlist]);

  if (playlist === undefined) {
    return (
      <p className="px-6 py-10 text-sm text-subdued">Esa playlist no existe.</p>
    );
  }

  const playlistTracks = getTracks(playlist.trackIds);
  const totalSeconds = playlistTracks.reduce((sum, t) => sum + t.durationSeconds, 0);

  const isSounding =
    currentTrackId !== undefined && playlist.trackIds.includes(currentTrackId);
  const isSoundingNow = isSounding && isPlaying;

  return (
    <div className="relative">
      {/* Degradado de marca que se desvanece hacia el fondo del panel. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-brand/80 via-brand/25 to-transparent"
        aria-hidden="true"
      />

      <header className="relative flex flex-col items-start gap-6 px-6 pb-6 pt-16 sm:flex-row sm:items-end">
        <img
          src={playlist.coverUrl}
          alt=""
          className="h-40 w-40 shrink-0 rounded object-cover shadow-2xl sm:h-52 sm:w-52"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-white">Playlist</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tighter text-white sm:text-6xl lg:text-display">
            {playlist.name}
          </h1>
          <p className="mt-4 text-sm text-white/80">{playlist.description}</p>
          <p className="mt-2 text-sm text-white/80">
            <span className="font-semibold text-white">Datafy</span>
            {' · '}
            {playlistTracks.length} canciones
            {' · '}
            <span className="text-white/60">{formatTotalDuration(totalSeconds)}</span>
          </p>
        </div>
      </header>

      {/* Fila de acciones, aun sobre el degradado. */}
      <div className="relative flex items-center gap-6 px-6 py-4">
        <PlayButton
          size="lg"
          isPlaying={isSoundingNow}
          label={isSoundingNow ? `Pausar ${playlist.name}` : `Reproducir ${playlist.name}`}
          onClick={() => {
            // Si ya suena algo de esta playlist, el boton grande hace de
            // play/pausa en vez de reiniciarla desde el principio.
            if (isSounding) {
              togglePlayPause();
            } else {
              playQueue(playlist.trackIds, 0, 'playlist');
            }
          }}
        />

        {/* Spotify pone aqui un corazon que guarda la PLAYLIST. No lo hay
            porque la taxonomia solo tiene `track_liked` con `track_id`:
            cablearlo al primer track seria disparar un evento que no
            corresponde. El corazon vive en cada fila y en la barra inferior,
            donde si mapea a una cancion concreta. */}
      </div>

      <div className="relative px-6 pb-10">
        <TrackList tracks={playlistTracks} source="playlist" showHeader />
      </div>
    </div>
  );
}
