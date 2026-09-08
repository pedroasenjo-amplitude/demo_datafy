import { useEffect } from 'react';

import { TrackList } from '../components/TrackList';
import { getPlaylist, getTracks } from '../data/catalog';
import { track } from '../lib/analytics';
import { usePlayerStore } from '../store/usePlayerStore';

interface PlaylistViewProps {
  playlistId: string;
}

export function PlaylistView({ playlistId }: PlaylistViewProps): JSX.Element {
  const playQueue = usePlayerStore((s) => s.playQueue);
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
      <p className="rounded-lg bg-surface-raised px-4 py-6 text-sm text-neutral-400">
        Esa playlist no existe.
      </p>
    );
  }

  const playlistTracks = getTracks(playlist.trackIds);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <img
          src={playlist.coverUrl}
          alt=""
          className="h-40 w-40 shrink-0 rounded-lg object-cover shadow-2xl"
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Playlist · {playlist.genre}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-neutral-100">{playlist.name}</h1>
          <p className="mt-2 text-sm text-neutral-400">{playlist.description}</p>
          <p className="mt-1 text-xs text-neutral-500">{playlistTracks.length} canciones</p>

          <button
            type="button"
            onClick={() => {
              playQueue(playlist.trackIds, 0, 'playlist');
            }}
            className="mt-4 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-black transition hover:bg-accent-hover"
          >
            Reproducir
          </button>
        </div>
      </header>

      <TrackList tracks={playlistTracks} source="playlist" />
    </div>
  );
}
