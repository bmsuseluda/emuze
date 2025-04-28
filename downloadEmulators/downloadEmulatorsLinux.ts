import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsLinux: Partial<EmulatorDownloads> = {
  ares: "https://github.com/pkgforge-dev/ares-emu-appimage/releases/download/v144/ares-v144-anylinux-x86_64.AppImage",
  azahar:
    "https://github.com/azahar-emu/azahar/releases/download/2120.3/azahar-2120.3-linux-appimage.tar.gz",
  duckstation:
    "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/DuckStation-x64.AppImage",
  dolphin:
    "https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/2503a-316/Dolphin_Emulator-2503a-316-anylinux.dwarfs-x86_64.AppImage",
  pcsx2:
    "https://github.com/PCSX2/pcsx2/releases/download/v2.2.0/pcsx2-v2.2.0-linux-appimage-x64-Qt.AppImage",
  ryujinx:
    "https://github.com/Ryubing/Stable-Releases/releases/download/1.3.1/ryujinx-1.3.1-x64.AppImage",
};

export const downloadEmulatorsLinux = () =>
  downloadEmulators(emulatorDownloadsLinux, "Linux");

downloadEmulatorsLinux();
