import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsLinux: Partial<EmulatorDownloads> = {
  ares: "https://github.com/bmsuseluda/ares-emu-appimage/releases/download/v142.2.0/ares-v142-x86_64.AppImage",
  duckstation:
    "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/DuckStation-x64.AppImage",
  dolphin:
    "https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/20250213-021604/Dolphin_Emulator-2412-270-anylinux.squashfs-x86_64.AppImage",
  ryujinx:
    "https://github.com/Ryubing/Ryujinx/releases/download/1.2.81/ryujinx-1.2.81-x64.AppImage",
};

export const downloadEmulatorsLinux = () =>
  downloadEmulators(emulatorDownloadsLinux, "Linux");

downloadEmulatorsLinux();
