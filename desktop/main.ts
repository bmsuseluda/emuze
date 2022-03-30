import { initRemix } from "remix-electron";
import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import nodepath from "path";

app.on("ready", async () => {
  const url = await initRemix({
    serverBuild: __dirname,
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
        // if (window.isMaximized()) {
        //   window.restore();
        // } else {
        window.maximize();
        // }
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

  globalShortcut.register("CommandOrControl+F12", () => {
    window.webContents.toggleDevTools();
  });

  await window.loadURL(url);
  window.show();
});
