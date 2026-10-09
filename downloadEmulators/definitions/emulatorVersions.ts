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
      url: `https://github.com/pkgforge-dev/ares-emu-appimage/releases/download/v${emulatorVersions.ares}%402026-05-30_1780149007/ares-v${emulatorVersions.ares}-anylinux-x86_64.AppImage`,
      hash: "a3283ef645a25ab8458920e16a79a973fd02698eb2ee183f0a7b04a318467696",
    },
    Windows: {
      url: `https://github.com/ares-emulator/ares/releases/download/v${emulatorVersions.ares}/ares-windows-x64.zip`,
      hash: "fa97958e1d359e3fe254353f87b6508f2762a959d7eb264c69965ad002037298",
    },
  },
  azahar: {
    Linux: {
      url: `https://github.com/pkgforge-dev/Azahar-AppImage-Enhanced/releases/download/${emulatorVersions.azahar}%402026-08-01_1785586204/Azahar-${emulatorVersions.azahar}-anylinux-x86_64.AppImage`,
      hash: "86487a72cadede66e10c152328abbe9d9a8e89d1b68167c610f9dccd19fa7553",
    },
    Windows: {
      url: `https://github.com/azahar-emu/azahar/releases/download/${emulatorVersions.azahar}/azahar-windows-msys2-${emulatorVersions.azahar}.zip`,
      hash: "6aabc16d7023a6d6bbe9b950591d1f128c1c543c1c8fffc3a337997353c9d980",
    },
  },
  cemu: {
    Linux: {
      url: `https://github.com/cemu-project/Cemu/releases/download/v${emulatorVersions.cemu}/Cemu-${emulatorVersions.cemu}-x86_64.AppImage`,
      hash: "0c20c4aeb800bb13d9bab9474ef45a6f8fcde6402cad9b32ac2a1bbd03186313",
    },
    Windows: {
      url: `https://github.com/cemu-project/Cemu/releases/download/v${emulatorVersions.cemu}/cemu-${emulatorVersions.cemu}-windows-x64.zip`,
      hash: "a6bcc2bc42a362d10213819948f3152fae7d47f70067f25939b51d3ddcfb0896",
    },
  },
  dolphin: {
    Linux: {
      url: `https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/${emulatorVersions.dolphin}%402026-08-01_1785586331/Dolphin_Emulator-${emulatorVersions.dolphin}-anylinux-x86_64.AppImage`,
      hash: "9ef53557783ab094ec577d37f169f1d39b503e7fef7a1b2679c5eaa82c05f099",
    },
    Windows: {
      url: `https://dl.dolphin-emu.org/releases/${emulatorVersions.dolphin}/dolphin-${emulatorVersions.dolphin}-x64.7z`,
      hash: "c6ea821c820cdc5d52d9f4d315fdca629d51a1b9f4f7e671948b905c085d7f59",
    },
  },
  dosboxpure: {
    Linux: {
      url: `https://github.com/schellingb/dosbox-pure-unleashed/releases/download/${emulatorVersions.dosboxpure}/dosbox_pure_unleashed-linux-x64-${emulatorVersions.dosboxpure}.zip`,
      hash: "92e0c5699660181879d54d8fd833a3b0266c8299602ba03e116650ef7902abe1",
    },
    Windows: {
      url: `https://github.com/schellingb/dosbox-pure-unleashed/releases/download/${emulatorVersions.dosboxpure}/dosbox_pure_unleashed-windows-64bit-${emulatorVersions.dosboxpure}.zip`,
      hash: "1836e03190451f4cef80b760ea8ac6d8ff229f1eab44114f5a1203f91b145953",
    },
  },
  duckstation: {
    Linux: {
      url: `https://github.com/Kyuyrii/Duckstation-GPL3/releases/download/v${emulatorVersions.duckstation}/DuckStation-x64.AppImage`,
      hash: "29c772a35fd78703e65554bc11290dbfeed5a84f7964b67c4127cf5dcca0b57a",
    },
    Windows: {
      url: `https://github.com/Kyuyrii/Duckstation-GPL3/releases/download/v${emulatorVersions.duckstation}/duckstation-windows-x64-release.zip`,
      hash: "b1036ea9dbf91609cef77daf03bdf2efce19b03ed3d6b4ea7c5c3396f5fc3b96",
    },
  },
  eden: {
    Linux: {
      url: `https://stable.eden-emu.dev/v${emulatorVersions.eden}/Eden-Linux-v${emulatorVersions.eden}-amd64-clang-pgo.AppImage`,
      hash: "7a28bf988b0648831989722bdbaa90ab31371b403808199813e0ea7c8b25ba6d",
    },
    Windows: {
      url: `https://stable.eden-emu.dev/v${emulatorVersions.eden}/Eden-Windows-v${emulatorVersions.eden}-amd64-clang-pgo.zip`,
      hash: "6c1b53ce325170a026cc0f87098380027dc6170d94ba95f913aab7596fd097cb",
    },
  },
  flycast: {
    Linux: {
      url: `https://github.com/flyinghead/flycast/releases/download/v${emulatorVersions.flycast}/flycast-x86_64.AppImage`,
      hash: "ba9bafb4527bbb7247c6b460dbf9ee39aba24c6cb69c22e9b021f7886eb40b1f",
    },
    Windows: {
      url: `https://github.com/flyinghead/flycast/releases/download/v${emulatorVersions.flycast}/flycast-win64-${emulatorVersions.flycast}.zip`,
      hash: "8bfca5c620df3c67599f14c46cb1567e776142f898a6f57b382a4506c94e7c43",
    },
  },
  mame: {
    Linux: {
      url: `https://github.com/pkgforge-dev/MAME-AppImage/releases/download/0.288-1%402026-07-22_1784754526/MAME-0.288-1-anylinux-x86_64.AppImage`,
      hash: "9529dadaa7dc4e9cce9dafadd63440b76d66210651dff606ba56e189aaf022f6",
    },
    Windows: {
      url: `https://github.com/mamedev/mame/releases/download/mame0288/mame0288b_x64.exe`,
      hash: "e4ae20a2359d716fb16824961b1b0fb28d8662ffd1298504edff39d368bb4a55",
    },
  },
  mednafen: {
    Linux: {
      url: `https://github.com/pkgforge-dev/mednafen-appimage/releases/download/${emulatorVersions.mednafen}%402025-09-08_1757361413/mednafen-${emulatorVersions.mednafen}-anylinux-x86_64.AppImage`,
      hash: "9a64a9075b4982c2f17f2885c05857a633e7138dfb725e63262f15a961c38a35",
    },
    Windows: {
      url: `https://mednafen.github.io/releases/files/mednafen-${emulatorVersions.mednafen}-win64.zip`,
      hash: "3b680ce6b50a17bcbb2ac611e38962ee469e399b412cc435ffacd6e7f6fb1982",
    },
  },
  melonds: {
    Linux: {
      url: `https://github.com/melonDS-emu/melonDS/releases/download/${emulatorVersions.melonds}/melonDS-${emulatorVersions.melonds}-appimage-x86_64.zip`,
      hash: "bf377420a2e95f2cd2cdda17d5372b51c2534f858b038db9ec6d129554875124",
    },
    Windows: {
      url: `https://github.com/melonDS-emu/melonDS/releases/download/${emulatorVersions.melonds}/melonDS-${emulatorVersions.melonds}-windows-x86_64.zip`,
      hash: "9f3f8a244103be20b5b657af5b0ed1b2a66bb20a7181476a6d294c9a53d4f8c8",
    },
  },
  pcsx2: {
    Linux: {
      url: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions.pcsx2}/pcsx2-v${emulatorVersions.pcsx2}-linux-appimage-x64-Qt.AppImage`,
      hash: "8ce7de8613c17b00b01028a512dd1b81998b6626ebbe93a067e0eb20aeedd5bf",
    },
    Windows: {
      url: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions.pcsx2}/pcsx2-v${emulatorVersions.pcsx2}-windows-x64-Qt.7z`,
      hash: "963ae6c82bc858a09115c2455247feb76b453862c04f60d41ef80739d802ae60",
    },
  },
  ppsspp: {
    Linux: {
      url: `https://github.com/hrydgard/ppsspp/releases/download/v${emulatorVersions.ppsspp}/PPSSPP-v${emulatorVersions.ppsspp}-anylinux-x86_64.AppImage`,
      hash: "661c098e6b7f7610171a57b7c533ce8bba6f2312b71e76d61e850461973eba21",
    },
    Windows: {
      url: `https://www.ppsspp.org/files/${emulatorVersions.ppsspp.replaceAll(".", "_")}/ppsspp_win.zip`,
      hash: "a60f04ebdb0b5f1655422bd7f88349a46999b17ad5115d6ddb290c3934bd5163",
    },
  },
  rosaliesMupenGui: {
    Linux: {
      url: `https://github.com/pkgforge-dev/RMG-AppImage-Enhanced/releases/download/${emulatorVersions.rosaliesMupenGui}-1%402026-08-01_1785586196/RMG-${emulatorVersions.rosaliesMupenGui}-1-anylinux-x86_64.AppImage`,
      hash: "d695e1006478d6655d9d7e273b5d7ecca319bc155bf0ff716286a6cf3b4a3539",
    },
    Windows: {
      url: `https://github.com/Rosalie241/RMG/releases/download/v${emulatorVersions.rosaliesMupenGui}/RMG-Portable-Windows64-v${emulatorVersions.rosaliesMupenGui}.zip`,
      hash: "f81640a0ae7474c0915f263d1acac20cf816ac8666f897cbf3710cd485a9027d",
    },
  },
  rpcs3: {
    Linux: {
      url: `https://github.com/RPCS3/rpcs3-binaries-linux/releases/download/build-daa437904edaddc746a466d7a3c76e415bba5c00/rpcs3-v${emulatorVersions.rpcs3}-19689-daa43790_linux64.AppImage`,
      hash: "31282b3cb265b0d61028ea66c32d38b208dadcff7baf8129be3659b0909e52f0",
    },
    Windows: {
      url: `https://github.com/RPCS3/rpcs3-binaries-win/releases/download/build-daa437904edaddc746a466d7a3c76e415bba5c00/rpcs3-v${emulatorVersions.rpcs3}-19689-daa43790_win64_msvc.7z`,
      hash: "767130296a50af40a465af8393f5db92df799f96af8cc7b59191fa0767926fa5",
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
      hash: "7f80981cfa7e1956b83a6abb3c8aff1cade0fddef834b1bcb43804be6f80fa1f",
    },
    Windows: {
      url: `https://downloads.scummvm.org/frs/scummvm/${emulatorVersions.scummvm}/scummvm-${emulatorVersions.scummvm}-win32-x86_64.zip`,
      hash: "ba0af3fd6cf0d281c623d48b23c77a4b4775860d496195155e6ceb281e0fff95",
    },
  },
  xemu: {
    Linux: {
      url: `https://github.com/xemu-project/xemu/releases/download/v${emulatorVersions.xemu}/xemu-${emulatorVersions.xemu}-x86_64.AppImage`,
      hash: "ac77363a599109194ba2af3caa695348d199f515cf1d0fde091beb629e0c3103",
    },
    Windows: {
      url: `https://github.com/xemu-project/xemu/releases/download/v${emulatorVersions.xemu}/xemu-win-x86_64-release.zip`,
      hash: "b25a6c24a2c2c36a0843a153cd9ee59ca6833ef87bdcd855ba0824930e4ddd1d",
    },
  },
} satisfies Partial<EmulatorDownloads>;
