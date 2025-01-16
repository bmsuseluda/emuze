import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsLinux: Partial<EmulatorDownloads> = {
  ares: "https://github.com/bmsuseluda/ares-emu-appimage/releases/download/v141.0.12/ares-v141-x86_64.AppImage",
  dolphin:
    "https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/1.2412-4/Dolphin_Emulator-1.2412-4-x86_64.AppImage",
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.78/ryujinx-1.2.78-linux_x64.tar.gz",
};

export const downloadEmulatorsLinux = () =>
  downloadEmulators(emulatorDownloadsLinux, "Linux");

downloadEmulatorsLinux();
