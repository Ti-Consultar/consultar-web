import { app, BrowserWindow, nativeImage, shell } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
const shouldLoadLocalBuild = process.env.ELECTRON_LOAD_FILE === "true";
const devServerUrl = process.env.ELECTRON_START_URL || "http://localhost:5173";

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
  createMainWindow();

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
