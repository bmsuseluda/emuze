import { platform } from "node:os";
import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  shell,
  screen,
} from "electron";
import nodepath from "node:path";
import * as dotenv from "dotenv";
import electronUpdater from "electron-updater";
import {
  readAppearance,
  writeAppearance,
} from "../app/server/settings.server.js";
import { createLogFile, isDebug, log } from "../app/server/debug.server.js";
import {
  commandLineOptions,
  commandLineOptionsString,
} from "../app/server/commandLine.server.js";
import { initReactRouter } from "./initReactRouter.js";
import { fileURLToPath } from "node:url";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));
const { autoUpdater } = electronUpdater;

dotenv.config();

const setFullscreen = (window: BrowserWindow, fullscreen: boolean) => {
  if (fullscreen && window.isMaximized()) {
    window.unmaximize();
  }

  window.setFullScreen(fullscreen);
  window.webContents.send("fullscreen", fullscreen);
  const appearance = readAppearance(true);
  writeAppearance({ ...appearance, fullscreen });

  if (!fullscreen) {
    window.maximize();
  }
};

const showHelp = () => {
  console.log(commandLineOptionsString);
  app.quit();
};

app.commandLine.appendSwitch("lang", "en-US");
app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");

app.on("ready", async () => {
  if (app.commandLine.hasSwitch(commandLineOptions.help.id)) {
    showHelp();
    return;
  }

  if (isDebug()) {
    createLogFile();
  }

  autoUpdater
    .checkForUpdatesAndNotify()
    .then((result) => {
      if (result) {
        log("info", "check for updates", {
          version: result.updateInfo.version,
          updateAvailable: result.isUpdateAvailable,
        });
      }
    })
    .catch((reason) => {
      log("error", "check for updates", reason);
    });
  autoUpdater.on("error", (error, message) => {
    log("error", "check for updates", error, message);
  });
  autoUpdater.on("download-progress", (info) => {
    log("debug", "update download progress", info);
  });
  autoUpdater.on("update-downloaded", ({ downloadedFile }) => {
    log("debug", "update downloaded", downloadedFile);
  });
  autoUpdater.on("appimage-filename-updated", (path) => {
    log("debug", "update appimage filename updated", path);
  });

  const appearance = readAppearance();
  const fullscreen =
    app.commandLine.hasSwitch(commandLineOptions.fullscreen.id) ||
    appearance?.fullscreen;

  // TODO: Check how to set context for react router with fullscreen
  const url = await initReactRouter();

  const { height, width } = screen.getPrimaryDisplay().workAreaSize;

  const window = new BrowserWindow({
    show: false,
    frame: false,
    transparent: platform() !== "win32",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: nodepath.join(__dirname, "preload.mjs"),
    },
    icon:
      platform() === "win32"
        ? nodepath.join(__dirname, "..", "public", "icon.ico")
        : nodepath.join(__dirname, "..", "public", "icons", "icon96x96.png"),
    minWidth: 800,
    minHeight: 800,
    width,
    height,
  });

  ipcMain.handle("isFullscreen", () => window.isFullScreen());

  ipcMain.on("changeWindow", (_event, name: WindowChangeEvents) => {
    switch (name) {
      case "minimize":
        window.minimize();
        break;
      case "maximize":
        if (window.isMaximized()) {
          window.restore();
        } else {
          window.maximize();
        }
        break;
      case "fullscreen":
        setFullscreen(window, !window.isFullScreen());
        break;
      case "restore": {
        window.restore();
        break;
      }
      case "close":
        window.close();
        break;
      default:
        log("error", "unknown window change event name", name);
        break;
    }
  });

  ipcMain.handle("closeEmuze", () => {
    app.quit();
  });

  window.webContents.on("before-input-event", (event, input) => {
    if (input.key.toLowerCase() === "f12") {
      event.preventDefault();
      window.webContents.toggleDevTools();
    }
    if (input.key.toLowerCase() === "f11") {
      event.preventDefault();
      setFullscreen(window, !window.isFullScreen());
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  await window.loadURL(url);
  if (!fullscreen) {
    window.maximize();
  }

  window.show();

  if (fullscreen) {
    setFullscreen(window, true);
  }

  window.on("show", () => {
    setTimeout(() => {
      window.focus();
    }, 50);
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
