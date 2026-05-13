import { contextBridge, ipcRenderer } from "electron";

const updaterApi = {
  getVersion: () => ipcRenderer.invoke("app:get-version"),
  checkForUpdates: () => ipcRenderer.invoke("updater:check-for-updates"),
  quitAndInstall: () => ipcRenderer.invoke("updater:quit-and-install"),
  onUpdaterEvent: (callback) => {
    const listener = (_event, payload) => callback(payload);

    ipcRenderer.on("updater:event", listener);

    return () => {
      ipcRenderer.removeListener("updater:event", listener);
    };
  },
};

contextBridge.exposeInMainWorld("electronApp", Object.freeze(updaterApi));
