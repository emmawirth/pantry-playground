
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  // add more env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  OPENAI_API_KEY?: string;
}
