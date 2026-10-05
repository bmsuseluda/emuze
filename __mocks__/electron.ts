export const app = {
  commandLine: {
    hasSwitch: () => false,
    appendSwitch: () => {},
  },
  getPath: () => "",
  quit: () => {},
  on: () => {},
};

export const BrowserWindow = {
  getAllWindows: () => [],
  getFocusedWindow: () => null,
};

export const dialog = {
  showOpenDialogSync: () => undefined,
  showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
};

export const globalShortcut = {
  register: () => {},
  unregister: () => {},
  unregisterAll: () => {},
};

export const protocol = {
  handle: () => {},
};

export default {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  protocol,
};
