import { initRemix } from "remix-electron";
import { platform } from "os";
import { app, BrowserWindow, ipcMain, session } from "electron";
import nodepath from "path";
import * as dotenv from "dotenv";
import { autoUpdater } from "electron-updater";
import { readAppearance, writeAppearance } from "../app/server/settings.server";
import { createLogFile, isDebug } from "../app/server/debug.server";

dotenv.config();

const setFullscreen = (window: BrowserWindow, fullscreen: boolean) => {
  window.setFullScreen(fullscreen);
  window.webContents.send("fullscreen", fullscreen);
  const appearance = readAppearance(true);
  writeAppearance({ ...appearance, fullscreen });
};

const showHelp = () => {
  console.log(`
Usage: emuze [options]

Options:
  --help            Show help
  --fullscreen      Start the app in fullscreen mode
  --debugEmuze      Activates verbose logging to .emuze/emuze.log
  --aresN64         Use ares emulator to play Nintendo 64 games
  --no-sandbox      Necessary if emuze is used as a non steam game (Steam Deck Game Mode)
  `);
  app.quit();
};

app.on("ready", async () => {
  if (app.commandLine.hasSwitch("help")) {
    showHelp();
    return;
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self'; object-src 'none';"],
      },
    });
  });

  autoUpdater.checkForUpdatesAndNotify().then((result) => {
    if (result) {
      console.log({
        version: result?.updateInfo.version,
      });
    }
  });

  if (isDebug()) {
    createLogFile();
  }

  const appearance = readAppearance();
  const fullscreen =
    app.commandLine.hasSwitch("fullscreen") || appearance?.fullscreen;

  const url = await initRemix({
    serverBuild: nodepath.join(__dirname, "../../build/index.js"),
    getLoadContext: () => ({
      fullscreen: window.isFullScreen(),
    }),
  });

  const window = new BrowserWindow({
    show: false,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: nodepath.join(__dirname, "preload.js"),
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
        console.log("unknown window change event name", name);
        break;
    }
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

  await window.loadURL(url);
  window.maximize();
  window.show();

  if (fullscreen) {
    setFullscreen(window, true);
  }
});
