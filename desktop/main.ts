import { initRemix } from "remix-electron";
import { app, BrowserWindow, ipcMain } from "electron";
import nodepath from "path";
import { readAppearance } from "./readSettings";
import * as dotenv from "dotenv";

dotenv.config();

const setFullscreen = (window: BrowserWindow, fullscreen: boolean) => {
  window.setFullScreen(fullscreen);
  window.webContents.send("fullscreen", fullscreen);
};

app.on("ready", async () => {
  const appearance = readAppearance();
  const fullscreen =
    app.commandLine.hasSwitch("fullscreen") || appearance?.fullscreen;

  if (process.env.NODE_ENV === "development") {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require("electron-devtools-installer");

    await installExtension(REACT_DEVELOPER_TOOLS);
  }

  const url = await initRemix({
    serverBuild: nodepath.join(__dirname, "../build/index.js"),
    getLoadContext: () => ({
      fullscreen: window.isFullScreen(),
    }),
  });

  const window = new BrowserWindow({
    show: false,
    frame: false,
    webPreferences: {
      preload: nodepath.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
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
