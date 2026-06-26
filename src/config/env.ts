type AppEnvironment = "development" | "homologation" | "production";

const rawEnv = import.meta.env;

const normalizeUrl = (value: string) => value.replace(/\/+$/, "");

const requiredUrl = (key: string, value?: string) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  try {
    return normalizeUrl(new URL(value).toString());
  } catch {
    throw new Error(`Invalid URL configured for environment variable: ${key}`);
  }
};

const resolveAppEnvironment = (): AppEnvironment => {
  if (rawEnv.VITE_APP_ENV === "homologation" || rawEnv.MODE === "homologation") {
    return "homologation";
  }

  if (rawEnv.VITE_APP_ENV === "production" || rawEnv.MODE === "production") {
    return "production";
  }

  return "development";
};

export const env = {
  appEnvironment: resolveAppEnvironment(),
  isDevelopment: rawEnv.DEV,
  isProduction: rawEnv.PROD,
  isHomologation: resolveAppEnvironment() === "homologation",
  isElectron: rawEnv.VITE_ELECTRON === "true",
  api: {
    auth: requiredUrl(
      "VITE_API_URL_AUTH",
      rawEnv.VITE_API_URL_AUTH || rawEnv.VITE_API_URL_BASE,
    ),
    mrp: requiredUrl("VITE_API_URL_MRP", rawEnv.VITE_API_URL_MRP),
    consults: requiredUrl(
      "VITE_API_URL_CONSULTS",
      rawEnv.VITE_API_URL_CONSULTS,
    ),
  },
  desktopAppDownloadUrl: rawEnv.VITE_DESKTOP_APP_DOWNLOAD_URL,
} as const;
