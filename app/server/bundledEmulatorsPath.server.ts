import nodepath from "node:path";
import { extraFilesPath } from "./operationsystem.server.js";

export const bundledEmulatorsPathBase = nodepath.join(
  extraFilesPath,
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

export const emulatorsManifestMacPath = nodepath.join(
  bundledEmulatorsPathBase,
  "emulators-mac.json",
);

export const emulatorsManifestWindowsPath = nodepath.join(
  bundledEmulatorsPathBase,
  "emulators-windows.json",
);

export const bundledBiosOpenSourcePath = nodepath.join(
  extraFilesPath,
  "biosOpenSource",
);
