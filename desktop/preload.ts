import electron from "electron";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;

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
  isUpdateAvailable: (callback: () => void) =>
    autoUpdater.on("appimage-filename-updated", () => {
      callback();
    }),
};

electron?.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
