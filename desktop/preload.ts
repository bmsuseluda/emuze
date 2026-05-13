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
};

electron?.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
