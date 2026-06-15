import 'vite/client';

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: "development" | "homologation" | "production";
  readonly VITE_API_URL_AUTH?: string;
  readonly VITE_API_URL_BASE?: string;
  readonly VITE_API_URL_MRP: string;
  readonly VITE_API_URL_CONSULTS: string;
  readonly VITE_DESKTOP_APP_DOWNLOAD_URL?: string;
  readonly VITE_ELECTRON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
