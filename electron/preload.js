import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronApp", Object.freeze({}));
