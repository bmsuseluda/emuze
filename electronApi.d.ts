declare const electronAPI: typeof import("./desktop/preload.js").electronAPI;
declare type WindowChangeEvents =
  import("./desktop/preload.js").WindowChangeEvents;

interface Window {
  electronAPI: typeof electronAPI;
}
