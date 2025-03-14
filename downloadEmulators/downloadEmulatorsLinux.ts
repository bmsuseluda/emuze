import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsLinux: Partial<EmulatorDownloads> = {
  ares: "https://github.com/bmsuseluda/ares-emu-appimage/releases/download/v143.0.0/ares-v143-x86_64.AppImage",
  duckstation:
    "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/DuckStation-x64.AppImage",
  dolphin:
    "https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/2503-33/Dolphin_Emulator-2503-33-anylinux.squashfs-x86_64.AppImage",
  ryujinx:
    "https://github.com/Ryubing/Stable-Releases/releases/download/1.2.86/ryujinx-1.2.86-x64.AppImage",
};

export const downloadEmulatorsLinux = () =>
  downloadEmulators(emulatorDownloadsLinux, "Linux");

downloadEmulatorsLinux();
