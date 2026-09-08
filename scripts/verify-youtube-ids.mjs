#!/usr/bin/env node
/**
 * Comprueba que los youtubeVideoId del catalogo existen y permiten embed.
 *
 *   pnpm verify:youtube
 *
 * Usa el endpoint oEmbed publico de YouTube, que devuelve 401/403 cuando el
 * propietario no permite la reproduccion embebida y 404 cuando el video no
 * existe o es privado. Es el chequeo mas fiable que se puede hacer sin API key.
 *
 * No modifica nada: solo imprime que IDs hay que sustituir en
 * src/data/catalog.ts.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const catalogPath = resolve(here, '../src/data/catalog.ts');

const source = await readFile(catalogPath, 'utf8');

// Extrae (titulo, artista, videoId) por orden de aparicion en el fichero.
const entries = [];
const trackPattern =
  /title:\s*['"`](.+?)['"`],\s*\n\s*artist:\s*['"`](.+?)['"`],[\s\S]*?youtubeVideoId:\s*'([\w-]{11})'/g;

for (const match of source.matchAll(trackPattern)) {
  const [, title, artist, videoId] = match;
  entries.push({ title, artist, videoId });
}

if (entries.length === 0) {
  console.error('No se ha podido extraer ningun track de src/data/catalog.ts.');
  process.exit(1);
}

console.log(`Verificando ${entries.length} videos...\n`);

const CONCURRENCY = 6;
const failures = [];

/** Minusculas, sin acentos y sin puntuacion, para comparar titulos. */
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function check({ title, artist, videoId }) {
  const url = `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${videoId}`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      // Un ID valido puede apuntar a otra cancion: comprobamos que el titulo
      // del catalogo aparezca en el que devuelve YouTube.
      if (!normalize(data.title).includes(normalize(title))) {
        const reason = `el ID apunta a otro video: "${data.title}"`;
        console.log(`  OJO   ${videoId}  ${title} — ${reason}`);
        failures.push({ title, artist, videoId, reason });
        return;
      }

      console.log(`  OK    ${videoId}  ${title} — ${data.title}`);
      return;
    }

    const reason =
      response.status === 404
        ? 'no existe, es privado o fue borrado'
        : response.status === 401 || response.status === 403
          ? 'embed no permitido por el propietario'
          : `HTTP ${response.status}`;

    console.log(`  FALLA ${videoId}  ${title} — ${reason}`);
    failures.push({ title, artist, videoId, reason });
  } catch (error) {
    const reason = `error de red: ${error instanceof Error ? error.message : String(error)}`;
    console.log(`  FALLA ${videoId}  ${title} — ${reason}`);
    failures.push({ title, artist, videoId, reason });
  }
}

// Cola sencilla para no lanzar 30 peticiones a la vez.
const queue = [...entries];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let next = queue.shift(); next !== undefined; next = queue.shift()) {
      await check(next);
    }
  }),
);

console.log('');

if (failures.length === 0) {
  console.log('Todos los videos responden y permiten embed.');
  process.exit(0);
}

console.log(`${failures.length} video(s) a sustituir en src/data/catalog.ts:\n`);
for (const f of failures) {
  console.log(`  ${f.videoId}  ${f.title} (${f.artist})  ->  ${f.reason}`);
}
console.log(
  '\nBusca el video en YouTube, copia el valor de ?v=<ID> de la URL y ' +
    'sustituye el youtubeVideoId correspondiente.',
);
process.exit(1);
