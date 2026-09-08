import { PlaylistCard } from '../components/PlaylistCard';
import { PlaylistShortcut } from '../components/PlaylistShortcut';
import { TrackList } from '../components/TrackList';
import { getTracks, playlists, type Playlist } from '../data/catalog';
import type { Route } from '../router/useRoute';
import { selectCurrentTrackId, usePlayerStore } from '../store/usePlayerStore';
import { useUserStore } from '../store/useUserStore';

interface HomeProps {
  navigate: (route: Route) => void;
}

/** Saludo segun la hora, como el de Spotify. */
function greeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 6) return 'Buenas noches';
  if (hour < 14) return 'Buenos dias';
  if (hour < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

export function Home({ navigate }: HomeProps): JSX.Element {
  const recentTrackIds = usePlayerStore((s) => s.recentTrackIds);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const currentTrackId = usePlayerStore(selectCurrentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const persona = useUserStore((s) => s.persona);

  const recentTracks = getTracks(recentTrackIds);

  const isPlaylistSounding = (playlist: Playlist): boolean =>
    isPlaying && currentTrackId !== undefined && playlist.trackIds.includes(currentTrackId);

  const openPlaylist = (playlist: Playlist): void => {
    navigate({ name: 'playlist', playlistId: playlist.id });
  };

  const playPlaylist = (playlist: Playlist): void => {
    playQueue(playlist.trackIds, 0, 'playlist');
  };

  return (
    <div className="flex flex-col gap-8 px-6 pb-10 pt-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {greeting(new Date())}
          {persona === null ? '' : `, ${persona.name.split(' ')[0] ?? ''}`}
        </h1>
      </header>

      {/* Tiles horizontales de acceso rapido. */}
      <section>
        <h2 className="sr-only">Accesos rapidos</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => (
            <PlaylistShortcut
              key={playlist.id}
              playlist={playlist}
              isPlaying={isPlaylistSounding(playlist)}
              onOpen={() => {
                openPlaylist(playlist);
              }}
              onPlay={() => {
                playPlaylist(playlist);
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-white hover:underline">
          Tus playlists
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isPlaying={isPlaylistSounding(playlist)}
              onOpen={() => {
                openPlaylist(playlist);
              }}
              onPlay={() => {
                playPlaylist(playlist);
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
          Escuchado recientemente
        </h2>
        {recentTracks.length === 0 ? (
          <p className="rounded-lg bg-surface-panel px-4 py-6 text-sm text-subdued">
            Todavia no has reproducido nada. Abre una playlist y dale al play.
          </p>
        ) : (
          <TrackList tracks={recentTracks} source="recent" />
        )}
      </section>
    </div>
  );
}
