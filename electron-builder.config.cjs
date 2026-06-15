const buildEnv = process.env.BUILD_ENV || process.env.VITE_APP_ENV || "production";
const isHomologation = buildEnv === "homologation";
const updateUrl =
  process.env.ELECTRON_UPDATE_URL ||
  (isHomologation
    ? process.env.ELECTRON_UPDATE_URL_HOMOLOGATION
    : process.env.ELECTRON_UPDATE_URL_PRODUCTION) ||
  "https://SEU_STORAGE_ACCOUNT.zXX.web.core.windows.net/desktop/";

/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: isHomologation
    ? "br.com.consultar.mrp.homologation"
    : "br.com.consultar.mrp",
  productName: isHomologation ? "MRP Consultar Homolog" : "MRP Consultar",
  asar: true,
  npmRebuild: false,
  publish: [
    {
      provider: "generic",
      url: updateUrl,
    },
  ],
  directories: {
    output: isHomologation ? "release/homologation" : "release/production",
  },
  files: [
    "dist/**/*",
    "electron/**/*",
    "build/icons/**/*",
    "package.json",
  ],
  win: {
    icon: "build/icons/icon.ico",
    artifactName: isHomologation
      ? "MRP-Consultar-Homolog-Setup-${version}.${ext}"
      : "MRP-Consultar-Setup-${version}.${ext}",
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  linux: {
    icon: "build/icons",
    target: ["AppImage", "deb"],
    category: "Office",
  },
  mac: {
    icon: "build/icons/icon.icns",
    target: ["dmg", "zip"],
    category: "public.app-category.business",
  },
};
