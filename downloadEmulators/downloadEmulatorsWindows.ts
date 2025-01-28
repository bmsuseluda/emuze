import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsWindows: Partial<EmulatorDownloads> = {
  ares: "https://github.com/ares-emulator/ares/releases/download/v141/ares-windows.zip",
  dolphin: "https://dl.dolphin-emu.org/releases/2407/dolphin-2407-x64.7z",
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.81/ryujinx-1.2.81-win_x64.zip",
};

export const downloadEmulatorsWindows = () =>
  downloadEmulators(emulatorDownloadsWindows, "Windows");

downloadEmulatorsWindows();
