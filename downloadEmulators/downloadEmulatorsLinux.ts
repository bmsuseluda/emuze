import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsLinux: Partial<EmulatorDownloads> = {
  ares: "https://github.com/bmsuseluda/ares-emu-appimage/releases/download/v142.0.1/ares-v142-x86_64.AppImage",
  duckstation:
    "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/DuckStation-x64.AppImage",
  dolphin:
    "https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/1.2412-4/Dolphin_Emulator-1.2412-4-x86_64.AppImage",
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.81/ryujinx-1.2.81-linux_x64.tar.gz",
};

export const downloadEmulatorsLinux = () =>
  downloadEmulators(emulatorDownloadsLinux, "Linux");

downloadEmulatorsLinux();
