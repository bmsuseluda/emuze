import CrossProcessExports from "electron";

declare global {
  // eslint-disable-next-line no-var
  var __electron__: typeof CrossProcessExports;
}

const isDev = process.env.NODE_ENV === "development";

export const importElectron = (): typeof CrossProcessExports => {
  if (isDev) {
    // electron is exposed as a global variable in dev mode.
    return global.__electron__;
  }
  return CrossProcessExports; // doesn't work on remix:dev (vite-dev-server)
};

export const getElectronWindow = () => {
  const electron = importElectron();
  const window = electron?.BrowserWindow?.getAllWindows().at(0);

  return window;
};

export const setFocusOnElectronWindow = () => {
  getElectronWindow()?.focus();
  getElectronWindow()?.focusOnWebView();
};
