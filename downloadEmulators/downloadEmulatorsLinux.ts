import { downloadEmulators, EmulatorDownloads } from "./downloadEmulators";

const emulatorDownloadsLinux: Partial<EmulatorDownloads> = {
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.76/ryujinx-1.2.76-linux_x64.tar.gz",
};

export const downloadEmulatorsLinux = () =>
  downloadEmulators(emulatorDownloadsLinux, "Linux");

downloadEmulatorsLinux();
