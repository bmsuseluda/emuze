import nodepath from "node:path";

export const bundledEmulatorsPathBase = nodepath.join(
  process.env.APPDIR || "",
  "emulators",
);

export const gamecontrollerdbPath = nodepath.join(
  bundledEmulatorsPathBase,
  "gamecontrollerdb.txt",
);

export const emulatorsManifestLinuxPath = nodepath.join(
  bundledEmulatorsPathBase,
  "emulators-linux.json",
);

export const emulatorsManifestWindowsPath = nodepath.join(
  bundledEmulatorsPathBase,
  "emulators-windows.json",
);

export const bundledBiosOpenSourcePath = nodepath.join(
  process.env.APPDIR || "",
  "biosOpenSource",
);
