import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsWindows: Partial<EmulatorDownloads> = {
  ares: "https://github.com/ares-emulator/ares/releases/download/v143/ares-windows-x64.zip",
  duckstation:
    "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/duckstation-windows-x64-release.zip",
  dolphin: "https://dl.dolphin-emu.org/releases/2503/dolphin-2503-x64.7z",
  pcsx2:
    "https://github.com/PCSX2/pcsx2/releases/download/v2.2.0/pcsx2-v2.2.0-windows-x64-Qt.7z",
  ryujinx:
    "https://github.com/Ryubing/Stable-Releases/releases/download/1.2.86/ryujinx-1.2.86-win_x64.zip",
};

export const downloadEmulatorsWindows = () =>
  downloadEmulators(emulatorDownloadsWindows, "Windows");

downloadEmulatorsWindows();
