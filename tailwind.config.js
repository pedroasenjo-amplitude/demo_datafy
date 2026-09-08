/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Grises de Spotify, neutros a proposito: hacen que el azul salte.
        surface: {
          base: '#121212', // fondo del panel principal
          panel: '#181818', // biblioteca y tarjetas
          elevated: '#242424', // pill de busqueda, botones del top bar
          hover: '#2a2a2a', // hover de filas y tarjetas
        },
        // El azul de marca. Solo para RELLENOS con contenido blanco encima:
        // boton de play, barra de progreso, degradados. Sobre #121212 da 2.7:1,
        // asi que como color de texto no se usa nunca.
        brand: {
          DEFAULT: '#0052f2',
          hover: '#1a66ff',
        },
        // Tinte claro de la misma familia para TEXTO e iconos de acento:
        // 6.4:1 sobre #121212, legible. Spotify hace lo mismo con su verde.
        accent: '#4d8cff',
        // Texto secundario de Spotify.
        subdued: '#b3b3b3',
      },
      fontSize: {
        // Titulares de pagina de Spotify: enormes y muy apretados.
        display: ['5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      keyframes: {
        // Barritas del ecualizador de la fila que esta sonando.
        eq: {
          '0%, 100%': { height: '30%' },
          '50%': { height: '100%' },
        },
      },
      animation: {
        eq: 'eq 0.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
