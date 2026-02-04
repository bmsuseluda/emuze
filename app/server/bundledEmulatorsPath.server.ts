import nodepath from "node:path";

export const bundledEmulatorsPathBase = nodepath.join(
  process.env.APPDIR || "",
  "emulators",
);

export const gamecontrollerdbPath = nodepath.join(
  bundledEmulatorsPathBase,
  "gamecontrollerdb.txt",
);
