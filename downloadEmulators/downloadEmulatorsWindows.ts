import { downloadEmulators, EmulatorDownloads } from "./downloadEmulators";

const emulatorDownloadsWindows: Partial<EmulatorDownloads> = {
  dolphin: "https://dl.dolphin-emu.org/releases/2407/dolphin-2407-x64.7z",
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.76/ryujinx-1.2.76-win_x64.zip",
};

export const downloadEmulatorsWindows = () =>
  downloadEmulators(emulatorDownloadsWindows, "Windows");

downloadEmulatorsWindows();
