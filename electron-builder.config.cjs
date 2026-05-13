const updateUrl =
  process.env.ELECTRON_UPDATE_URL ||
  "https://SEU_STORAGE_ACCOUNT.zXX.web.core.windows.net/windows/";

/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: "br.com.consultar.mrp",
  productName: "MRP Consultar",
  asar: true,
  npmRebuild: false,
  publish: [
    {
      provider: "generic",
      url: updateUrl,
    },
  ],
  directories: {
    output: "release",
  },
  files: [
    "dist/**/*",
    "electron/**/*",
    "build/icons/**/*",
    "package.json",
  ],
  win: {
    icon: "build/icons/icon.ico",
    artifactName: "MRP-Consultar-Setup-${version}.${ext}",
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
