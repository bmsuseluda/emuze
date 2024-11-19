import { downloadEmulators, EmulatorDownloads } from "./downloadEmulators";

const emulatorDownloadsWindows: Partial<EmulatorDownloads> = {
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.76/ryujinx-1.2.76-win_x64.zip",
};

export const downloadEmulatorsWindows = () =>
  downloadEmulators(emulatorDownloadsWindows, "Windows");

downloadEmulatorsWindows();
