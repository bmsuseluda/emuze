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
      callback(fullscreen),
    ),
  isFullscreen: () => ipcRenderer.invoke("isFullscreen"),
  closeEmuze: () => ipcRenderer.invoke("closeEmuze"),
  onBlur: (callback: () => void) =>
    ipcRenderer.on("blur", (_event) => callback()),
  onFocus: (callback: () => void) =>
    ipcRenderer.on("focus", (_event) => callback()),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
