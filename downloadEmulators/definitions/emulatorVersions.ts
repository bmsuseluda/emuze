import { ApplicationId } from "../../app/server/applicationsDB.server/applicationId.js";

export const emulatorVersions = {
  ares: "148",
  azahar: "2125.1.3",
  cemu: "2.6",
  dolphin: "2606",
  dosboxpure: "1.0-preview6",
  duckstation: "0.1-7371",
  eden: "0.2.1",
  flycast: "2.6",
  mame: "0.288",
  mednafen: "1.32.1",
  melonds: "1.1",
  pcsx2: "2.6.3",
  ppsspp: "1.20.4",
  rosaliesMupenGui: "0.9.0",
  rpcs3: "0.0.42",
  ryujinx: "1.3.3",
  scummvm: "2026.3.0",
  xemu: "0.8.136",
} satisfies Record<ApplicationId, string>;

export type OperatingSystem = "Windows" | "Linux";
export interface Download {
  url: string;
  hash: string;
}
type EmulatorDownloads = Record<
  ApplicationId,
  Record<OperatingSystem, Download>
>;

export const emulatorDownloads = {
  ares: {
    Linux: {
      url: `https://github.com/pkgforge-dev/ares-emu-appimage/releases/download/v${emulatorVersions.ares}%402026-08-17_1786998446/ares-v${emulatorVersions.ares}-anylinux-x86_64.AppImage`,
      hash: "0775a15f773d293dc1d7ab03b0d0def203e7ebad969bc89665f772affff25af7",
    },
    Windows: {
      url: `https://github.com/ares-emulator/ares/releases/download/v${emulatorVersions.ares}/ares-windows-x64.zip`,
      hash: "",
    },
  },
  azahar: {
    Linux: {
      url: `https://github.com/pkgforge-dev/Azahar-AppImage-Enhanced/releases/download/${emulatorVersions.azahar}%402026-08-01_1785586204/Azahar-${emulatorVersions.azahar}-anylinux-x86_64.AppImage`,
      hash: "86487a72cadede66e10c152328abbe9d9a8e89d1b68167c610f9dccd19fa7553",
    },
    Windows: {
      url: `https://github.com/azahar-emu/azahar/releases/download/${emulatorVersions.azahar}/azahar-windows-msys2-${emulatorVersions.azahar}.zip`,
      hash: "",
    },
  },
  cemu: {
    Linux: {
      url: `https://github.com/pkgforge-dev/Cemu-AppImage-Enhanced/releases/download/2.6-4%402026-02-01_1769935971/Cemu-2.6-4-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/cemu-project/Cemu/releases/download/v${emulatorVersions.cemu}/cemu-${emulatorVersions.cemu}-windows-x64.zip`,
      hash: "",
    },
  },
  dolphin: {
    Linux: {
      url: `https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/${emulatorVersions.dolphin}%402026-08-01_1785586331/Dolphin_Emulator-${emulatorVersions.dolphin}-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://dl.dolphin-emu.org/releases/${emulatorVersions.dolphin}/dolphin-${emulatorVersions.dolphin}-x64.7z`,
      hash: "",
    },
  },
  dosboxpure: {
    Linux: {
      url: `https://github.com/pkgforge-dev/DOSBox-Pure-Unleashed-AppImage/releases/download/4a1141224%402026-08-01_1785586171/DOSBox_Pure_Unleashed-4a1141224-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/schellingb/dosbox-pure-unleashed/releases/download/${emulatorVersions.dosboxpure}/dosbox_pure_unleashed-windows-64bit-${emulatorVersions.dosboxpure}.zip`,
      hash: "",
    },
  },
  duckstation: {
    Linux: {
      url: `https://github.com/pkgforge-dev/DuckStation-GPL-AppImage-Enhanced/releases/download/0.1.7465-7%402026-05-01_1777674496/DuckStation-0.1.7465-7-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/Kyuyrii/Duckstation-GPL3/releases/download/v${emulatorVersions.duckstation}/duckstation-windows-x64-release.zip`,
      hash: "",
    },
  },
  eden: {
    Linux: {
      url: `https://stable.eden-emu.dev/v${emulatorVersions.eden}/Eden-Linux-v${emulatorVersions.eden}-amd64-clang-pgo.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://stable.eden-emu.dev/v${emulatorVersions.eden}/Eden-Windows-v${emulatorVersions.eden}-amd64-clang-pgo.zip`,
      hash: "",
    },
  },
  flycast: {
    Linux: {
      url: `https://github.com/pkgforge-dev/Flycast-AppImage-Enhanced/releases/download/2.6-1%402026-08-01_1785585864/Flycast-2.6-1-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/flyinghead/flycast/releases/download/v${emulatorVersions.flycast}/flycast-win64-${emulatorVersions.flycast}.zip`,
      hash: "",
    },
  },
  mame: {
    Linux: {
      url: `https://github.com/pkgforge-dev/MAME-AppImage/releases/download/0.288-1%402026-07-22_1784754526/MAME-0.288-1-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/mamedev/mame/releases/download/mame0288/mame0288b_x64.exe`,
      hash: "",
    },
  },
  mednafen: {
    Linux: {
      url: `https://github.com/pkgforge-dev/mednafen-appimage/releases/download/1.32.1%402026-08-09_1786298295/Mednafen_Emulator-1.32.1-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://mednafen.github.io/releases/files/mednafen-${emulatorVersions.mednafen}-win64.zip`,
      hash: "",
    },
  },
  melonds: {
    Linux: {
      url: `https://github.com/pkgforge-dev/melonDS-AppImage-Enhanced/releases/download/1.1-2%402026-08-18_1787083018/melonDS-1.1-2-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/melonDS-emu/melonDS/releases/download/${emulatorVersions.melonds}/melonDS-${emulatorVersions.melonds}-windows-x86_64.zip`,
      hash: "",
    },
  },
  pcsx2: {
    Linux: {
      url: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions.pcsx2}/pcsx2-v${emulatorVersions.pcsx2}-linux-appimage-x64-Qt.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions.pcsx2}/pcsx2-v${emulatorVersions.pcsx2}-windows-x64-Qt.7z`,
      hash: "",
    },
  },
  ppsspp: {
    Linux: {
      url: `https://github.com/hrydgard/ppsspp/releases/download/v${emulatorVersions.ppsspp}/PPSSPP-v${emulatorVersions.ppsspp}-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://www.ppsspp.org/files/${emulatorVersions.ppsspp.replaceAll(".", "_")}/ppsspp_win.zip`,
      hash: "",
    },
  },
  rosaliesMupenGui: {
    Linux: {
      url: `https://github.com/pkgforge-dev/RMG-AppImage-Enhanced/releases/download/${emulatorVersions.rosaliesMupenGui}-1%402026-08-01_1785586196/RMG-${emulatorVersions.rosaliesMupenGui}-1-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/Rosalie241/RMG/releases/download/v${emulatorVersions.rosaliesMupenGui}/RMG-Portable-Windows64-v${emulatorVersions.rosaliesMupenGui}.zip`,
      hash: "",
    },
  },
  rpcs3: {
    Linux: {
      url: `https://github.com/RPCS3/rpcs3-binaries-linux/releases/download/build-daa437904edaddc746a466d7a3c76e415bba5c00/rpcs3-v${emulatorVersions.rpcs3}-19689-daa43790_linux64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/RPCS3/rpcs3-binaries-win/releases/download/build-daa437904edaddc746a466d7a3c76e415bba5c00/rpcs3-v${emulatorVersions.rpcs3}-19689-daa43790_win64_msvc.7z`,
      hash: "",
    },
  },
  ryujinx: {
    Linux: {
      url: `https://git.ryujinx.app/projects/Ryubing/releases/download/${emulatorVersions.ryujinx}/ryujinx-${emulatorVersions.ryujinx}-x64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://git.ryujinx.app/projects/Ryubing/releases/download/${emulatorVersions.ryujinx}/ryujinx-${emulatorVersions.ryujinx}-win_x64.zip`,
      hash: "",
    },
  },
  scummvm: {
    Linux: {
      url: `https://github.com/pkgforge-dev/ScummVM-AppImage/releases/download/${emulatorVersions.scummvm}-1%402026-08-01_1785585620/ScummVM-${emulatorVersions.scummvm}-1-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://downloads.scummvm.org/frs/scummvm/${emulatorVersions.scummvm}/scummvm-${emulatorVersions.scummvm}-win32-x86_64.zip`,
      hash: "",
    },
  },
  xemu: {
    Linux: {
      url: `https://github.com/pkgforge-dev/xemu-AppImage-Enhanced/releases/download/0.8.135-1%402026-08-01_1785585799/xemu-0.8.135-1-anylinux-x86_64.AppImage`,
      hash: "",
    },
    Windows: {
      url: `https://github.com/xemu-project/xemu/releases/download/v${emulatorVersions.xemu}/xemu-win-x86_64-release.zip`,
      hash: "",
    },
  },
} satisfies Partial<EmulatorDownloads>;
