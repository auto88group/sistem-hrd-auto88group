interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly BASE_URL: string;
  readonly VITE_HOLIDAY_JSON: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
