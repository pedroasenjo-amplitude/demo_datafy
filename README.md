# Datafy — demo de instrumentación con Amplitude

SPA que simula una app de música. Su único propósito es servir de entorno de
demo para instrumentación de analíticas con el SDK de Amplitude: no se
comercializa y no tiene backend.

El audio se reproduce con la **YouTube IFrame Player API** (embeds oficiales).
La app nunca descarga ni re-sirve audio.

React 18 · Vite · TypeScript estricto · Tailwind · Zustand · pnpm

---

## Correr en local

Requisitos: Node 20+ y pnpm 9+.

```bash
pnpm install
cp .env.example .env.local     # y pon tu API key dentro
pnpm dev
```

`.env.local` (está en `.gitignore`):

```
VITE_AMPLITUDE_API_KEY=tu_api_key_de_amplitude
```

**Sin API key la app funciona igual**: `initAnalytics()` detecta que falta,
avisa por consola y `track()` pasa a modo *dry-run*, imprimiendo cada evento con
sus propiedades en la consola del navegador. Es la forma más rápida de revisar
la taxonomía sin ensuciar un proyecto real.

Otros comandos:

```bash
pnpm build            # tsc --noEmit && vite build
pnpm typecheck
pnpm verify:youtube   # comprueba que los vídeos del catálogo siguen vivos
```

---

## Taxonomía de eventos

Todo sale por un único helper tipado, `track()` en `src/lib/analytics.ts`. El
contrato vive en `src/lib/events.ts`: `EventMap` asocia cada nombre de evento
con la forma exacta de sus propiedades, y `track()` es genérico sobre ese mapa,
así que **una propiedad mal escrita, sobrante o ausente es un error de
compilación**.

| Evento | Propiedades | Cuándo |
| --- | --- | --- |
| `app_opened` | — | Al cargar la app (una vez por carga) |
| `page_viewed` | `page_name` | En cada cambio de vista |
| `search_performed` | `query`, `results_count` | Búsqueda estabilizada (debounce 350 ms) |
| `playlist_opened` | `playlist_id`, `playlist_name`, `genre` | Al entrar en una playlist |
| `track_played` | `track_id`, `track_name`, `artist`, `genre`, `source` | Al arrancar o reanudar un track |
| `track_paused` | `track_id`, `position_seconds` | Al pausar |
| `track_skipped` | `track_id`, `position_seconds`, `percent_listened`, `reason` | Al abandonar un track antes del final |
| `track_completed` | `track_id`, `genre` | El player emite `ENDED` |
| `track_liked` / `track_unliked` | `track_id`, `genre` | Al marcar/desmarcar favorito |
| `shuffle_toggled` | `enabled` | Al cambiar el modo aleatorio |
| `volume_changed` | `level` | Al soltar el slider de volumen |
| `simulated_user_switched` | `plan` | Al cambiar de usuario simulado |

`source` ∈ `playlist` · `search` · `queue` · `recent`
`reason` ∈ `user` · `playback_error`

### Propiedad global

Un plugin de tipo *enrichment* (`currentPagePlugin`) inyecta `current_page` en
**todos** los eventos, incluidos los que genera autocapture. La vista activa
vive en una variable de módulo, no en el store, para que el plugin pueda leerla
sin importar React ni crear un ciclo de imports.

### Decisiones de instrumentación

Cosas que se pueden defender de otra manera; quedan explícitas para que sean
fáciles de cambiar en la demo:

- **Reanudar emite `track_played`** otra vez, conservando el `source` original
  de la reproducción en vez de inventar uno nuevo. La taxonomía no tiene un
  `track_resumed`.
- **`volume_changed` va con debounce de 400 ms.** El slider aplica el volumen al
  player en cada píxel, pero el evento sale un vez por gesto, no cuarenta.
- **`playlist_opened` se dispara en un efecto**, no en el `onClick` de la
  tarjeta, así que también cuenta entrar por un enlace directo o con el botón de
  atrás del navegador.
- **`percent_listened` usa la duración real** que reporta el player, y solo cae a
  la del catálogo si el player todavía no tiene metadatos.
- **`app_opened` se emite fuera de React** (en `main.tsx`), porque en StrictMode
  los efectos corren dos veces en desarrollo y saldría duplicado.
- **Un vídeo que no se puede reproducir** (embed bloqueado, borrado, privado)
  emite `track_skipped` con `reason: "playback_error"` y salta al siguiente. Si
  falla toda la cola, la reproducción se detiene en vez de girar en vacío.

### Session Replay

`@amplitude/plugin-session-replay-browser` se registra con `sampleRate: 1`
(100% de las sesiones), que es lo que interesa en una demo. En producción real
esto sería un porcentaje bajo.

---

## Aspecto

La interfaz imita al Spotify actual: fondo negro con paneles redondeados
flotando encima, top bar con buscador centrado y avatar, panel "Tu biblioteca"
con portadas, cabecera de playlist con degradado y titular enorme, botón de play
que aparece deslizándose al hacer hover en las tarjetas, y barra de reproducción
en tres zonas.

### El azul, en dos valores

El color de marca es **`#0052F2`**, pero no se puede usar para todo. Sobre el
fondo `#121212` da un contraste de **2.7:1**, por debajo del mínimo de 4.5:1 que
pide WCAG AA para texto. Así que hay dos tokens con papeles distintos:

| Token | Valor | Uso |
| --- | --- | --- |
| `brand` | `#0052F2` | **Solo rellenos** con contenido blanco encima: botón de play, barra de progreso, volumen, degradados, tiles de categoría |
| `brand-hover` | `#1A66FF` | Hover del botón de play |
| `accent` | `#4D8CFF` | **Texto e iconos** de acento: título de la canción que suena, corazón marcado, ecualizador, estado activo. 6.4:1 sobre el fondo |

Spotify hace exactamente lo mismo con su verde: el del botón y el del texto no
son el mismo valor. Si algún día hay que cambiar el azul, se cambian los dos
tokens en `tailwind.config.js` y nada más.

Los grises son los de Spotify, neutros a propósito (`#121212` base, `#181818`
paneles, `#242424` elevado, `#2A2A2A` hover): un fondo neutro hace que el azul
salte más que un fondo azulado.

### Dos detalles deliberados

- **El play de la barra inferior es blanco, no azul.** Es así en Spotify: el
  color de marca se reserva para el botón grande de las páginas. Mantenerlo
  blanco es más fiel que "usar el azul en todas partes".
- **La cabecera de playlist no tiene corazón.** En Spotify ese corazón guarda la
  *playlist*, pero la taxonomía solo tiene `track_liked` con `track_id`.
  Cablearlo al primer track sería disparar un evento que no corresponde, y en
  una demo de instrumentación eso es peor que la falta de fidelidad. El corazón
  vive en cada fila y en la barra inferior, donde sí mapea a una canción.

La tipografía es la del sistema. Spotify usa Circular, que no es libre; la
alternativa cercana sería cargar Inter desde Google Fonts, pero no compensa
añadir una dependencia de red a una demo por eso.

---

## Sobre el reproductor de YouTube

`src/hooks/useYouTubePlayer.ts` es el **único** módulo de la app que sabe que
detrás hay YouTube. Expone un `PlayerController` neutro (`load` / `play` /
`pause` / `seek` / `setVolume`) y cuatro callbacks (`onReady`, `onEnded`,
`onError`, `onProgress`). El store y los componentes hablan solo de `trackId`.

El iframe se deja **visible en pequeño** (abajo a la derecha), a propósito: los
navegadores son bastante más fiables autorreproduciendo un iframe que está en
pantalla que uno con `display: none`. Los controles nativos van desactivados y
una capa transparente se come los clicks, para que el store siga siendo la única
fuente de verdad del estado de reproducción.

### Verificar el catálogo

Los 30 IDs de vídeo se verificaron el 2026-09-08 y los 30 responden, permiten
embed y apuntan a la canción correcta. Pero el permiso de embed lo controla el
propietario del vídeo y puede cambiar cualquier día, así que antes de una demo
importante:

```bash
pnpm verify:youtube
```

Consulta el endpoint oEmbed público de YouTube y avisa de tres casos: vídeo
inexistente o privado, embed no permitido, y —comparando títulos— un ID que
apunte a otra canción. Solo imprime; no modifica el catálogo.

---

## Despliegue en GitHub Pages

El workflow está en `.github/workflows/deploy.yml`: construye con
`pnpm install --frozen-lockfile` y publica con las actions oficiales de Pages,
todas pineadas por SHA de commit. Se dispara en cada push a `main` y también a
mano (`workflow_dispatch`).

Dos detalles que hacen que funcione bajo un subdirectorio:

- `base: '/demo_datafy/'` en `vite.config.ts` — tiene que coincidir
  **exactamente** con el nombre del repo, mayúsculas incluidas: las rutas de
  Pages distinguen el caso. Si renombras el repo, hay que cambiarlo aquí, o los
  assets darán 404.
- Routing por hash propio (`#/`, `#/playlist/:id`, `#/search`), sin
  react-router: Pages sirve un único `index.html`, y el hash evita el 404 al
  recargar en una ruta profunda.

### 1. Crear el secret

En el repo: **Settings → Secrets and variables → Actions → New repository
secret**.

- Name: `VITE_AMPLITUDE_API_KEY`
- Secret: tu API key de Amplitude

Vite inlinea las variables `VITE_*` en el bundle en build time, así que la key
acaba siendo visible en el JavaScript publicado. Es lo esperado: una API key de
cliente de Amplitude está diseñada para ser pública. **No pongas aquí una clave
de la API de servidor ni un secret key.**

### 2. Activar Pages

En el repo: **Settings → Pages → Build and deployment → Source: GitHub
Actions**. No hace falta elegir rama ni carpeta; el propio workflow publica el
artefacto.

Esto es importante y es el fallo fácil: con la opción por defecto (*Deploy from
a branch*) Pages sirve la **raíz del repo tal cual**, es decir el `index.html`
sin construir, que apunta a `/src/main.tsx`. El navegador no sabe ejecutar TSX,
así que se ve una página en blanco aunque el repo esté perfecto.

### 3. Comprobar

Tras el primer push a `master`, la pestaña **Actions** muestra los dos jobs
(`build` y `deploy`) y el job de deploy imprime la URL final:
`https://pedroasenjo-amplitude.github.io/demo_datafy/`

---

## Estructura

```
src/
├─ main.tsx                  init de analytics + app_opened, antes de render
├─ App.tsx                   shell, routing y page_viewed
├─ data/
│  ├─ catalog.ts             30 tracks, 6 playlists, búsqueda y helpers
│  └─ personas.ts            4 usuarios simulados
├─ lib/
│  ├─ events.ts              EventMap: la taxonomía, como tipos
│  └─ analytics.ts           init, track(), identify y plugin de enrichment
├─ store/
│  ├─ usePlayerStore.ts      cola, track actual, likes, historial + eventos
│  ├─ useUserStore.ts        userId simulado y cambio de persona
│  └─ useSearchStore.ts      query compartida entre el top bar y la vista
├─ hooks/
│  ├─ useYouTubePlayer.ts    única frontera con la IFrame API
│  └─ useDebouncedValue.ts
├─ router/useRoute.ts        routing por hash
├─ views/                    Home · PlaylistView · SearchView
├─ components/
│  ├─ TopBar.tsx             logo, home, buscador, avatar
│  ├─ LibraryPanel.tsx       "Tu biblioteca" con portadas
│  ├─ PlayerBar.tsx          tres zonas: suena / controles / volumen
│  ├─ TrackList.tsx          tabla con cabecera de columnas y hover
│  ├─ PlaylistCard.tsx       tarjeta con play en hover
│  ├─ PlaylistShortcut.tsx   tile horizontal del Home
│  ├─ PlayButton.tsx         botón circular de marca (sm / lg)
│  ├─ SearchBar.tsx · UserSwitcher.tsx · ProgressBar.tsx ·
│  ├─ VolumeControl.tsx · LikeButton.tsx · YouTubeHost.tsx
│  └─ icons.tsx              SVGs inline, fuera de los componentes
└─ types/youtube.d.ts        declaraciones mínimas de la IFrame API
```

La lógica de analíticas vive en el store, no en los componentes: el store es
quien conoce la posición, el `source` y la cola, así que es el sitio natural
para calcular `percent_listened` o decidir qué `source` lleva un `track_played`.
Los componentes solo llaman acciones.
