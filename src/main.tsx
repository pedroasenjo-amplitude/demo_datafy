import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';
import { initAnalytics, setAnalyticsUserId, track } from './lib/analytics';
import { useUserStore } from './store/useUserStore';

initAnalytics();

// Fuera de React a proposito: en StrictMode los efectos se ejecutan dos veces
// en desarrollo, y `app_opened` debe salir una sola vez por carga.
setAnalyticsUserId(useUserStore.getState().userId);
track('app_opened');

const container = document.getElementById('root');
if (container === null) {
  throw new Error('No existe #root en index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
