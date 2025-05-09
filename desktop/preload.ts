import electron from "electron";

export type WindowChangeEvents =
  | "close"
  | "minimize"
  | "maximize"
  | "restore"
  | "fullscreen";

export const electronAPI = {
  changeWindow: (eventName: WindowChangeEvents) =>
    electron?.ipcRenderer.send("changeWindow", eventName),
  onFullscreen: (callback: (fullscreen: boolean) => void) =>
    electron?.ipcRenderer.on("fullscreen", (_event, fullscreen: boolean) =>
      callback(fullscreen),
    ),
  isFullscreen: () => electron?.ipcRenderer.invoke("isFullscreen"),
  closeEmuze: () => electron?.ipcRenderer.invoke("closeEmuze"),
  onBlur: (callback: () => void) =>
    electron?.ipcRenderer.on("blur", (_event) => callback()),
  onFocus: (callback: () => void) =>
    electron?.ipcRenderer.on("focus", (_event) => callback()),
};

electron?.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
