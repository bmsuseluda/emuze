import { initRemix } from "remix-electron";
import { app, BrowserWindow, nativeTheme } from "electron";

app.on("ready", async () => {
  const url = await initRemix({
    serverBuild: __dirname,
  });

  nativeTheme.themeSource = "dark";

  const window = new BrowserWindow({
    show: false,
    darkTheme: true,
    autoHideMenuBar: true,
  });
  await window.loadURL(url);
  window.show();
});
