import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` debe coincidir con el nombre del repositorio para que GitHub Pages
// resuelva los assets bajo https://<usuario>.github.io/Demo_Datafy/
export default defineConfig({
  base: '/Demo_Datafy/',
  plugins: [react()],
});
