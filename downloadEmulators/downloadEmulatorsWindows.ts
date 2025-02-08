import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsWindows: Partial<EmulatorDownloads> = {
  ares: "https://github.com/ares-emulator/ares/releases/download/v142/ares-windows-x64.zip",
  duckstation:
    "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/duckstation-windows-x64-release.zip",
  dolphin: "https://dl.dolphin-emu.org/releases/2412/dolphin-2412-x64.7z",
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.81/ryujinx-1.2.81-win_x64.zip",
};

export const downloadEmulatorsWindows = () =>
  downloadEmulators(emulatorDownloadsWindows, "Windows");

downloadEmulatorsWindows();
