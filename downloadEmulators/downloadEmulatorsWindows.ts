import type { EmulatorDownloads } from "./downloadEmulators";
import { downloadEmulators } from "./downloadEmulators";

const emulatorDownloadsWindows: Partial<EmulatorDownloads> = {
  ares: "https://github.com/ares-emulator/ares/releases/download/v144/ares-windows-x64.zip",
  azahar:
    "https://github.com/azahar-emu/azahar/releases/download/2121.1/azahar-2121.1-windows-msvc.zip",
  duckstation:
    "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/duckstation-windows-x64-release.zip",
  dolphin: "https://dl.dolphin-emu.org/releases/2503a/dolphin-2503a-x64.7z",
  pcsx2:
    "https://github.com/PCSX2/pcsx2/releases/download/v2.2.0/pcsx2-v2.2.0-windows-x64-Qt.7z",
  ryujinx:
    "https://github.com/Ryubing/Stable-Releases/releases/download/1.3.1/ryujinx-1.3.1-win_x64.zip",
};

export const downloadEmulatorsWindows = () =>
  downloadEmulators(emulatorDownloadsWindows, "Windows");

downloadEmulatorsWindows();
