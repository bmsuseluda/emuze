import electronUpdater from "electron-updater";
import nodepath from "node:path";
import { readGeneral, writeGeneral } from "../../app/server/settings.server.js";
import { log } from "../../app/server/debug.server.js";
import { platform } from "node:os";
import { spawn } from "node:child_process";

const showReleaseNotesOnStart = () => {
  const general = readGeneral();
  writeGeneral({ ...general, showReleaseNotesOnStart: true });
};

const { autoUpdater } = electronUpdater;

const updateWindows = () => {
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
    showReleaseNotesOnStart();
  });
};

const executeAppimageUpdater = (args: string[]) =>
  spawn(bundledAppimageUpdaterPath, args, {
    stdio: ["inherit", "pipe", "inherit"],
  });

export const bundledAppimageUpdaterPath = nodepath.join(
  process.env.APPDIR || "",
  "updater",
  "linux",
  "appimageupdate-x86_64-linux",
);

const downloadUpdateLinux = () => {
  log("info", "download update");
  const appimageUpdater = executeAppimageUpdater([
    "-Or",
    process.env.APPIMAGE || "",
  ]);

  appimageUpdater.stdout.on("data", (data) => {
    log("info", "download update", "stdout", data);
  });

  appimageUpdater.on("close", (code) => {
    log("info", "download update", "close", code);
    if (code === 0) {
      showReleaseNotesOnStart();
    }
  });
};

const updateLinux = () => {
  log("info", "check for updates");
  const appimageUpdater = executeAppimageUpdater(["-j", '"$APPIMAGE"']);

  appimageUpdater.stdout.on("data", (data) => {
    log("info", "check for updates", "stdout", data);

    if (data === "1") {
      downloadUpdateLinux();
    }
  });

  appimageUpdater.on("close", (code) => {
    log("info", "check for updates", "close", code);
  });
};

export const update = () => {
  if (platform() === "win32") {
    updateWindows();
  } else {
    updateLinux();
  }
};
