import { downloadEmulators, EmulatorDownloads } from "./downloadEmulators";

const emulatorDownloadsLinux: Partial<EmulatorDownloads> = {
  dolphin:
    "https://github.com/bmsuseluda/Dolphin_emu_Appimage/releases/download/v2407.0.4/Dolphin_Emulator-git-x86_64.AppImage",
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.76/ryujinx-1.2.76-linux_x64.tar.gz",
};

export const downloadEmulatorsLinux = () =>
  downloadEmulators(emulatorDownloadsLinux, "Linux");

downloadEmulatorsLinux();
