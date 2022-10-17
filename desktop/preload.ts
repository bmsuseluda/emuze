import { contextBridge, ipcRenderer } from "electron";

export type WindowChangeEvents =
  | "close"
  | "minimize"
  | "maximize"
  | "restore"
  | "fullscreen";

export const electronAPI = {
  changeWindow: (eventName: WindowChangeEvents) =>
    ipcRenderer.send("changeWindow", eventName),
  onFullscreen: (callback: (fullscreen: boolean) => void) =>
    ipcRenderer.on("fullscreen", (_event, fullscreen: boolean) =>
      callback(fullscreen)
    ),
  isFullscreen: () => ipcRenderer.invoke("isFullscreen"),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
