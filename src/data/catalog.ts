/**
 * Catalogo estatico. No hay backend: esto es todo el "contenido" de la demo.
 *
 * ─── SOBRE LOS youtubeVideoId ──────────────────────────────────────────────
 * Los 30 IDs se verificaron con `pnpm verify:youtube` el 2026-09-08: los 30
 * responden, permiten embed y el titulo que devuelve YouTube coincide con el
 * del catalogo.
 *
 * El permiso de embed lo controla el propietario del video y puede cambiar en
 * cualquier momento, asi que conviene volver a lanzar `pnpm verify:youtube`
 * antes de una demo importante. El script compara tambien el titulo, asi que
 * detecta un ID que apunte a otra cancion, no solo uno roto.
 * ───────────────────────────────────────────────────────────────────────────
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Duracion nominal del catalogo; para analiticas se usa la real del player. */
  durationSeconds: number;
  genre: string;
  coverUrl: string;
  youtubeVideoId: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  genre: string;
  coverUrl: string;
  trackIds: string[];
}

const cover = (seed: string): string =>
  `https://picsum.photos/seed/${seed}/320/320`;

export const tracks: Track[] = [
  // ── Clasicos del Rock ────────────────────────────────────────────────────
  {
    id: 't01',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    durationSeconds: 355,
    genre: 'Rock',
    coverUrl: cover('bohemian-rhapsody'),
    youtubeVideoId: 'fJ9rUzIMcZQ',
  },
  {
    id: 't02',
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    durationSeconds: 356,
    genre: 'Rock',
    coverUrl: cover('sweet-child'),
    youtubeVideoId: '1w7OgIMMRc4',
  },
  {
    id: 't03',
    title: 'Thunderstruck',
    artist: 'AC/DC',
    durationSeconds: 292,
    genre: 'Rock',
    coverUrl: cover('thunderstruck'),
    youtubeVideoId: 'v2AC41dglnM',
  },
  {
    id: 't04',
    title: "Livin' on a Prayer",
    artist: 'Bon Jovi',
    durationSeconds: 249,
    genre: 'Rock',
    coverUrl: cover('livin-on-a-prayer'),
    youtubeVideoId: 'lDK9QqIzhwk',
  },
  {
    id: 't05',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    durationSeconds: 301,
    genre: 'Rock',
    coverUrl: cover('teen-spirit'),
    youtubeVideoId: 'hTWKbfoikeg',
  },

  // ── Pop de los 2000s ─────────────────────────────────────────────────────
  {
    id: 't06',
    title: 'Rolling in the Deep',
    artist: 'Adele',
    durationSeconds: 228,
    genre: 'Pop',
    coverUrl: cover('rolling-in-the-deep'),
    youtubeVideoId: 'rYEDA3JcQqw',
  },
  {
    id: 't07',
    title: 'Shake It Off',
    artist: 'Taylor Swift',
    durationSeconds: 219,
    genre: 'Pop',
    coverUrl: cover('shake-it-off'),
    youtubeVideoId: 'nfWlot6h_JM',
  },
  {
    id: 't08',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    durationSeconds: 270,
    genre: 'Pop',
    coverUrl: cover('uptown-funk'),
    youtubeVideoId: 'OPf0YbXqDm0',
  },
  {
    id: 't09',
    title: 'Roar',
    artist: 'Katy Perry',
    durationSeconds: 269,
    genre: 'Pop',
    coverUrl: cover('roar'),
    youtubeVideoId: 'CevxZvSJLk8',
  },
  {
    id: 't10',
    title: 'Somebody That I Used to Know',
    artist: 'Gotye ft. Kimbra',
    durationSeconds: 244,
    genre: 'Pop',
    coverUrl: cover('somebody-i-used-to-know'),
    youtubeVideoId: '8UVNT4wvIGY',
  },

  // ── Hip-Hop Essentials ───────────────────────────────────────────────────
  {
    id: 't11',
    title: 'Rap God',
    artist: 'Eminem',
    durationSeconds: 363,
    genre: 'Hip-Hop',
    coverUrl: cover('rap-god'),
    youtubeVideoId: 'XbGs_qK2PQA',
  },
  {
    id: 't12',
    title: 'Love the Way You Lie',
    artist: 'Eminem ft. Rihanna',
    durationSeconds: 263,
    genre: 'Hip-Hop',
    coverUrl: cover('love-the-way-you-lie'),
    youtubeVideoId: 'uelHwf8o7_U',
  },
  {
    id: 't13',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    durationSeconds: 177,
    genre: 'Hip-Hop',
    coverUrl: cover('humble'),
    youtubeVideoId: 'tvTRZJ-4EyI',
  },
  {
    id: 't14',
    title: "God's Plan",
    artist: 'Drake',
    durationSeconds: 198,
    genre: 'Hip-Hop',
    coverUrl: cover('gods-plan'),
    youtubeVideoId: 'xpVfcZ0ZcFM',
  },
  {
    id: 't15',
    title: 'See You Again',
    artist: 'Wiz Khalifa ft. Charlie Puth',
    durationSeconds: 230,
    genre: 'Hip-Hop',
    coverUrl: cover('see-you-again'),
    youtubeVideoId: 'RgKAFK5djSk',
  },

  // ── Electronica para Foco ────────────────────────────────────────────────
  {
    id: 't16',
    title: 'Faded',
    artist: 'Alan Walker',
    durationSeconds: 212,
    genre: 'Electronica',
    coverUrl: cover('faded'),
    youtubeVideoId: '60ItHLz5WEA',
  },
  {
    id: 't17',
    title: 'Wake Me Up',
    artist: 'Avicii',
    durationSeconds: 250,
    genre: 'Electronica',
    coverUrl: cover('wake-me-up'),
    youtubeVideoId: 'IcrbM1l_BoI',
  },
  {
    id: 't18',
    title: 'Get Lucky',
    artist: 'Daft Punk ft. Pharrell Williams',
    durationSeconds: 369,
    genre: 'Electronica',
    coverUrl: cover('get-lucky'),
    youtubeVideoId: '5NV6Rdv1a3I',
  },
  {
    id: 't19',
    title: 'Closer',
    artist: 'The Chainsmokers ft. Halsey',
    durationSeconds: 244,
    genre: 'Electronica',
    coverUrl: cover('closer'),
    youtubeVideoId: 'PT2_F-1esPk',
  },
  {
    id: 't20',
    title: 'Summer',
    artist: 'Calvin Harris',
    durationSeconds: 223,
    genre: 'Electronica',
    coverUrl: cover('summer'),
    youtubeVideoId: 'ebXbLfLACGM',
  },

  // ── Indie & Alternativo ──────────────────────────────────────────────────
  {
    id: 't21',
    title: 'Mr. Brightside',
    artist: 'The Killers',
    durationSeconds: 222,
    genre: 'Indie',
    coverUrl: cover('mr-brightside'),
    youtubeVideoId: 'gGdGFtwCNBE',
  },
  {
    id: 't22',
    title: 'Do I Wanna Know?',
    artist: 'Arctic Monkeys',
    durationSeconds: 272,
    genre: 'Indie',
    coverUrl: cover('do-i-wanna-know'),
    youtubeVideoId: 'bpOSxM0rNPM',
  },
  {
    id: 't23',
    title: 'The Less I Know the Better',
    artist: 'Tame Impala',
    durationSeconds: 216,
    genre: 'Indie',
    coverUrl: cover('the-less-i-know'),
    youtubeVideoId: 'sBzrzS1Ag_g',
  },
  {
    id: 't24',
    title: 'Pumped Up Kicks',
    artist: 'Foster the People',
    durationSeconds: 239,
    genre: 'Indie',
    coverUrl: cover('pumped-up-kicks'),
    youtubeVideoId: 'SDTZ7iX4vTQ',
  },
  {
    id: 't25',
    title: 'Last Nite',
    artist: 'The Strokes',
    durationSeconds: 197,
    genre: 'Indie',
    coverUrl: cover('last-nite'),
    youtubeVideoId: 'TOypSnKFHrE',
  },

  // ── Fiesta Latina ────────────────────────────────────────────────────────
  {
    id: 't26',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    durationSeconds: 281,
    genre: 'Latino',
    coverUrl: cover('despacito'),
    youtubeVideoId: 'kJQP7kiw5Fk',
  },
  {
    id: 't27',
    title: 'Bailando',
    artist: 'Enrique Iglesias',
    durationSeconds: 245,
    genre: 'Latino',
    coverUrl: cover('bailando'),
    youtubeVideoId: 'NUsoVlDFqZg',
  },
  {
    id: 't28',
    title: "Hips Don't Lie",
    artist: 'Shakira ft. Wyclef Jean',
    durationSeconds: 218,
    genre: 'Latino',
    coverUrl: cover('hips-dont-lie'),
    youtubeVideoId: 'DUT5rEU6pqM',
  },
  {
    id: 't29',
    title: 'Mi Gente',
    artist: 'J Balvin & Willy William',
    durationSeconds: 189,
    genre: 'Latino',
    coverUrl: cover('mi-gente'),
    youtubeVideoId: 'wnJ6LuUFpMo',
  },
  {
    id: 't30',
    title: 'Danza Kuduro',
    artist: 'Don Omar ft. Lucenzo',
    durationSeconds: 199,
    genre: 'Latino',
    coverUrl: cover('danza-kuduro'),
    youtubeVideoId: '7zp1TbLFPp8',
  },
];

export const playlists: Playlist[] = [
  {
    id: 'pl-rock',
    name: 'Clasicos del Rock',
    description: 'Los himnos que todo el mundo sabe cantar.',
    genre: 'Rock',
    coverUrl: cover('playlist-rock'),
    trackIds: ['t01', 't02', 't03', 't04', 't05'],
  },
  {
    id: 'pl-pop',
    name: 'Pop de los 2000s',
    description: 'Radio-friendly, directo a la nostalgia.',
    genre: 'Pop',
    coverUrl: cover('playlist-pop'),
    trackIds: ['t06', 't07', 't08', 't09', 't10'],
  },
  {
    id: 'pl-hiphop',
    name: 'Hip-Hop Essentials',
    description: 'Barras, flow y produccion de manual.',
    genre: 'Hip-Hop',
    coverUrl: cover('playlist-hiphop'),
    trackIds: ['t11', 't12', 't13', 't14', 't15'],
  },
  {
    id: 'pl-electro',
    name: 'Electronica para Foco',
    description: 'Beat constante para sesiones largas.',
    genre: 'Electronica',
    coverUrl: cover('playlist-electro'),
    trackIds: ['t16', 't17', 't18', 't19', 't20'],
  },
  {
    id: 'pl-indie',
    name: 'Indie & Alternativo',
    description: 'Guitarras con actitud de sotano.',
    genre: 'Indie',
    coverUrl: cover('playlist-indie'),
    trackIds: ['t21', 't22', 't23', 't24', 't25'],
  },
  {
    id: 'pl-latino',
    name: 'Fiesta Latina',
    description: 'Sube el volumen y aparta los muebles.',
    genre: 'Latino',
    coverUrl: cover('playlist-latino'),
    trackIds: ['t26', 't27', 't28', 't29', 't30'],
  },
];

const trackIndex = new Map<string, Track>(tracks.map((t) => [t.id, t]));
const playlistIndex = new Map<string, Playlist>(playlists.map((p) => [p.id, p]));

export function getTrack(trackId: string): Track | undefined {
  return trackIndex.get(trackId);
}

export function getPlaylist(playlistId: string): Playlist | undefined {
  return playlistIndex.get(playlistId);
}

export function getTracks(trackIds: readonly string[]): Track[] {
  return trackIds
    .map((id) => trackIndex.get(id))
    .filter((t): t is Track => t !== undefined);
}

/** Busqueda local sobre titulo, artista y genero. */
export function searchTracks(query: string): Track[] {
  const needle = query.trim().toLowerCase();
  if (needle === '') return [];

  return tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(needle) ||
      t.artist.toLowerCase().includes(needle) ||
      t.genre.toLowerCase().includes(needle),
  );
}

/** "1 h 12 min" / "23 min", como la linea de metadatos de una playlist. */
export function formatTotalDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
}

export function formatDuration(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
