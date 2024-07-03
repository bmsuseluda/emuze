import type { InstalledApplication } from "../applicationsDB.server/types";

export const applicationsPath = "F:/games/Emulation/emulators";

export const pcsx2 = {
  path: "F:/games/Emulation/emulators/Pcsx2-v1.7.2242-windows-64bit-AVX2/pcsx2x64-avx2.exe",
  id: "pcsx2",
} satisfies InstalledApplication;

export const lime3ds = {
  path: "F:/games/Emulation/emulators/Citra/nightly-mingw/citra-qt.exe",
  id: "lime3ds",
} satisfies InstalledApplication;

export const mednafen = {
  path: "F:/games/Emulation/emulators/mednafen-1.29.0-win64/mednafen.exe",
  id: "mednafen",
} satisfies InstalledApplication;

export const duckstation = {
  path: "F:/games/Emulation/emulators/duckstation-windows-x64-release/duckstation-nogui-x64-ReleaseLTCG.exe",
  id: "duckstation",
} satisfies InstalledApplication;

export const dolphin = {
  path: "F:/games/Emulation/emulators/dolphin-master-5.0-15445-x64/Dolphin.exe",
  id: "dolphin",
} satisfies InstalledApplication;

export const mameNeoGeo = {
  path: "F:/games/Emulation/emulators/mame/mame.exe",
  id: "mameNeoGeo",
} satisfies InstalledApplication;

export const applications = {
  duckstation,
  pcsx2,
  lime3ds,
  dolphin,
  mednafen,
  mameNeoGeo,
} satisfies Record<string, InstalledApplication>;
