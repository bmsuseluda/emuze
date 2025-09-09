import type { InstalledApplication } from "../applicationsDB.server/types.js";

export const applicationsPath = "F:/games/Emulation/emulators";

export const lime3ds = {
  path: "F:/games/Emulation/emulators/Citra/nightly-mingw/citra-qt.exe",
  id: "lime3ds",
} satisfies InstalledApplication;

export const mameNeoGeo = {
  path: "F:/games/Emulation/emulators/mame/mame.exe",
  id: "mameNeoGeo",
} satisfies InstalledApplication;

export const applications = {
  lime3ds,
  mameNeoGeo,
} satisfies Record<string, InstalledApplication>;
