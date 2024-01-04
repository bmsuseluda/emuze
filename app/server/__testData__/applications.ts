import type { Application } from "~/types/jsonFiles/applications";

export const applicationsPath = "F:/games/Emulation/emulators";

export const pcsx2 = {
  path: "F:/games/Emulation/emulators/Pcsx2-v1.7.2242-windows-64bit-AVX2/pcsx2x64-avx2.exe",
  id: "pcsx2",
} satisfies Application;

export const play = {
  path: "F:/games/Emulation/emulators/Play/play.exe",
  id: "play",
} satisfies Application;

export const blastem = {
  path: "F:/games/Emulation/emulators/Blastem win32-0.6.2/blastem.exe",
  id: "blastem",
} satisfies Application;

export const bsnes = {
  path: "F:/games/Emulation/emulators/bsnes/bsnes-mt.exe",
  id: "bsnes",
} satisfies Application;

export const citra = {
  path: "F:/games/Emulation/emulators/Citra/nightly-mingw/citra-qt.exe",
  id: "citra",
} satisfies Application;

export const mednafen = {
  path: "F:/games/Emulation/emulators/mednafen-1.29.0-win64/mednafen.exe",
  id: "mednafen",
} satisfies Application;

export const duckstation = {
  path: "F:/games/Emulation/emulators/duckstation-windows-x64-release/duckstation-nogui-x64-ReleaseLTCG.exe",
  id: "duckstation",
} satisfies Application;

export const dolphin = {
  path: "F:/games/Emulation/emulators/dolphin-master-5.0-15445-x64/Dolphin.exe",
  id: "dolphin",
} satisfies Application;

export const applications = {
  blastem,
  bsnes,
  duckstation,
  citra,
  pcsx2,
  play,
  dolphin,
  mednafen,
} satisfies Record<string, Application>;
