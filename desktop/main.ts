import { initRemix } from "remix-electron";
import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import nodepath from "path";

app.on("ready", async () => {
  const publicFolder =
    process.env.NODE_ENV === "development"
      ? nodepath.join(app.getAppPath(), "..", "public")
      : nodepath.join(app.getAppPath(), "..", "..", "public");

  const url = await initRemix({
    serverBuild: nodepath.join(__dirname),
    publicFolder,
  });

  const window = new BrowserWindow({
    show: false,
    frame: false,
    webPreferences: {
      preload: nodepath.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("window", (event, name: string) => {
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
      case "restore": {
        window.restore();
        break;
      }
      case "close":
        window.close();
        break;
      default:
        console.log("unknown window event name", name);
        break;
    }
  });

  // TODO: replace with local shortcut
  globalShortcut.register("CommandOrControl+F12", () => {
    window.webContents.toggleDevTools();
  });

  await window.loadURL(url);
  window.show();
});
