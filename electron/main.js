import { app, BrowserWindow, ipcMain, nativeImage, shell } from "electron";
import electronUpdater from "electron-updater";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { autoUpdater } = electronUpdater;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
const shouldLoadLocalBuild = process.env.ELECTRON_LOAD_FILE === "true";
const devServerUrl = process.env.ELECTRON_START_URL || "http://localhost:5173";
const updateServerUrl = process.env.ELECTRON_UPDATE_URL;

function sendUpdaterEvent(event, payload = {}) {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("updater:event", {
      event,
      ...payload,
    });
  });
}

function setupAutoUpdater() {
  if (isDev) {
    return;
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  if (updateServerUrl) {
    autoUpdater.setFeedURL({
      provider: "generic",
      url: updateServerUrl,
    });
  }

  autoUpdater.on("checking-for-update", () => {
    sendUpdaterEvent("checking-for-update");
  });

  autoUpdater.on("update-available", (info) => {
    sendUpdaterEvent("update-available", {
      version: info.version,
    });
  });

  autoUpdater.on("update-not-available", (info) => {
    sendUpdaterEvent("update-not-available", {
      version: info.version,
    });
  });

  autoUpdater.on("download-progress", (progress) => {
    sendUpdaterEvent("download-progress", {
      percent: Math.round(progress.percent || 0),
      transferred: progress.transferred,
      total: progress.total,
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    sendUpdaterEvent("update-downloaded", {
      version: info.version,
    });
  });

  autoUpdater.on("error", (error) => {
    sendUpdaterEvent("error", {
      message: error?.message || "Erro ao verificar atualizacao.",
    });
  });
}

async function checkForUpdates() {
  if (isDev) {
    return {
      enabled: false,
      reason: "development",
    };
  }

  await autoUpdater.checkForUpdates();

  return {
    enabled: true,
  };
}

function getWindowIcon() {
  if (process.platform === "darwin") {
    return undefined;
  }

  const iconCandidates = [
    path.join(__dirname, "../build/icons/512x512.png"),
    path.join(__dirname, "../build/icon.png"),
  ];

  const iconPath = iconCandidates.find((candidate) => fs.existsSync(candidate));

  if (!iconPath) {
    return undefined;
  }

  const icon = nativeImage.createFromPath(iconPath);

  return icon.isEmpty() ? undefined : icon;
}

function createMainWindow() {
  const icon = getWindowIcon();

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    ...(icon ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev && !shouldLoadLocalBuild) {
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
    return;
  }

  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(() => {
  setupAutoUpdater();
  createMainWindow();
  checkForUpdates().catch((error) => {
    sendUpdaterEvent("error", {
      message: error?.message || "Erro ao verificar atualizacao.",
    });
  });

  setInterval(() => {
    checkForUpdates().catch((error) => {
      sendUpdaterEvent("error", {
        message: error?.message || "Erro ao verificar atualizacao.",
      });
    });
  }, 4 * 60 * 60 * 1000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("app:get-version", () => app.getVersion());

ipcMain.handle("updater:check-for-updates", () => checkForUpdates());

ipcMain.handle("updater:quit-and-install", () => {
  if (isDev) {
    return {
      installed: false,
      reason: "development",
    };
  }

  autoUpdater.quitAndInstall(false, true);

  return {
    installed: true,
  };
});
