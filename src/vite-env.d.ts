/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API key del proyecto de Amplitude. Se inyecta en build time. */
  readonly VITE_AMPLITUDE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
