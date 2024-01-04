declare const electronAPI: typeof import("./desktop/preload").electronAPI;
declare type WindowChangeEvents =
  import("./desktop/preload").WindowChangeEvents;

interface Window {
  electronAPI: typeof electronAPI;
}
