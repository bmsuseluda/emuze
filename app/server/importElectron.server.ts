declare global {
  // eslint-disable-next-line no-var
  var __electron__: typeof Electron.CrossProcessExports;
}

const isDev = process.env.NODE_ENV === "development";

const importElectron = () => {
  if (isDev) {
    // electron is exposed as a global variable in dev mode.
    return global.__electron__;
  }
  return require("electron"); // doesn't work on remix:dev (vite-dev-server)
};

export const electron = importElectron();
