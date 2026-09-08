import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` debe coincidir EXACTAMENTE con el nombre del repositorio, incluidas
// mayusculas y minusculas: las rutas de GitHub Pages distinguen el caso. El
// repo es `demo_datafy`, asi que la app vive en
// https://pedroasenjo-amplitude.github.io/demo_datafy/
export default defineConfig({
  base: '/demo_datafy/',
  plugins: [react()],
});
