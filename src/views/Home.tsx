import { PlaylistCard } from '../components/PlaylistCard';
import { TrackList } from '../components/TrackList';
import { getTracks, playlists } from '../data/catalog';
import type { Route } from '../router/useRoute';
import { usePlayerStore } from '../store/usePlayerStore';
import { useUserStore } from '../store/useUserStore';

interface HomeProps {
  navigate: (route: Route) => void;
}

export function Home({ navigate }: HomeProps): JSX.Element {
  const recentTrackIds = usePlayerStore((s) => s.recentTrackIds);
  const persona = useUserStore((s) => s.persona);

  const recentTracks = getTracks(recentTrackIds);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold text-neutral-100">
          {persona === null ? 'Buenas' : `Buenas, ${persona.name.split(' ')[0] ?? ''}`}
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Entorno de demo. Cada interaccion manda un evento a Amplitude.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-100">Playlists destacadas</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onOpen={() => {
                navigate({ name: 'playlist', playlistId: playlist.id });
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-100">Escuchado recientemente</h2>
        {recentTracks.length === 0 ? (
          <p className="rounded-lg bg-surface-raised px-4 py-6 text-sm text-neutral-500">
            Todavia no has reproducido nada. Abre una playlist y dale al play.
          </p>
        ) : (
          <TrackList tracks={recentTracks} source="recent" />
        )}
      </section>
    </div>
  );
}
