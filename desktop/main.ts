import {homedir, platform} from "node:os";
import {app, BrowserWindow, globalShortcut, ipcMain, shell} from "electron";
import nodepath from "node:path";
import * as dotenv from "dotenv";
import electronUpdater from "electron-updater";
import {readAppearance, writeAppearance} from "../app/server/settings.server.js";
import {createLogFile, isDebug, log} from "../app/server/debug.server.js";
import {commandLineOptions, commandLineOptionsString,} from "../app/server/commandLine.server.js";
import {cpSync, existsSync, rmSync} from "node:fs";
import {initReactRouter} from "./initReactRouter.js";
import {homeDirectory} from "../app/server/homeDirectory.server.js";
import {fileURLToPath} from 'node:url';

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));
const { autoUpdater } = electronUpdater;

process.env.SDL_JOYSTICK_ALLOW_BACKGROUND_EVENTS = "1";
dotenv.config();

const setFullscreen = (window: BrowserWindow, fullscreen: boolean) => {
  window.setFullScreen(fullscreen);
  window.webContents.send("fullscreen", fullscreen);
  const appearance = readAppearance(true);
  writeAppearance({ ...appearance, fullscreen });
};

const showHelp = () => {
  console.log(commandLineOptionsString);
  app.quit();
};

app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");

// TODO: remove if workaround is not necessary anymore: https://github.com/electron/electron/issues/46538
app.commandLine.appendSwitch("gtk-version", "3");

/**
 * Migration from old home directory to new one.
 *
 * TODO: remove this in one of the next releases
 */
const moveHomeDirectory = () => {
  const oldHomeDirectory = nodepath.join(homedir(), ".emuze");

  if (existsSync(oldHomeDirectory)) {
    cpSync(oldHomeDirectory, homeDirectory, {
      recursive: true,
      force: true,
      preserveTimestamps: true,
    });
    rmSync(oldHomeDirectory, { recursive: true, force: true });
  }
};

app.on("ready", async () => {
  moveHomeDirectory();

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
          version: result?.updateInfo.version,
        });
      }
    })
    .catch((reason) => {
      log("error", "check for updates", reason);
    });
  autoUpdater.on("error", (error, message) => {
    log("error", "check for updates", error, message);
  });

  const appearance = readAppearance();
  const fullscreen =
    app.commandLine.hasSwitch(commandLineOptions.fullscreen.id) ||
    appearance?.fullscreen;

  // TODO: Check how to set context for react router with fullscreen
  const url = await initReactRouter();

  const window = new BrowserWindow({
    show: false,
    frame: false,
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
    minWidth: 650,
    minHeight: 600,
  });

  window.on("blur", () => {
    window.webContents.send("blur");
  });
  window.on("focus", () => {
    window.webContents.send("focus");
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
  window.maximize();
  window.show();

  if (fullscreen) {
    setFullscreen(window, true);
  }
});

app.on("will-quit", () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
