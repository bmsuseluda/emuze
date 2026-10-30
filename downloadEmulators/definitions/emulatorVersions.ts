import { ApplicationId } from "../../app/server/applicationsDB.server/applicationId.js";

export const emulatorVersions = {
  ares: "148",
  azahar: "2126.1.2",
  cemu: "2.6",
  dolphin: "2609a",
  dosboxpure: "1.0-preview7",
  duckstation: "0.1-7371",
  eden: "0.2.1",
  flycast: "2.7",
  mame: "0.289",
  mednafen: "1.32.1",
  melonds: "1.1",
  pcsx2: "2.8.2",
  ppsspp: "1.20.4",
  rosaliesMupenGui: "0.9.0",
  rpcs3: "0.0.43",
  ryujinx: "1.3.3",
  scummvm: "2026.4.0",
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
      url: `https://github.com/pkgforge-dev/Azahar-AppImage-Enhanced/releases/download/${emulatorVersions.azahar}%402026-10-01_1790876552/Azahar-${emulatorVersions.azahar}-anylinux-x86_64.AppImage`,
      hash: "619e58b942e3ec9e0c618d70d062fa28d7f3c08cae621352e8eeaa65dc23f677",
    },
    Windows: {
      url: `https://github.com/azahar-emu/azahar/releases/download/${emulatorVersions.azahar}/azahar-windows-msys2-${emulatorVersions.azahar}.zip`,
      hash: "e18a162e2e992cef406eccaa9de85d1940f93b460d670070c4235e91baa98249",
    },
  },
  cemu: {
    Linux: {
      url: `https://github.com/pkgforge-dev/Cemu-AppImage-Enhanced/releases/download/2.6-4%402026-02-01_1769935971/Cemu-2.6-4-anylinux-x86_64.AppImage`,
      hash: "4b9276df7fb56198c6a54dfaa3afba6b69f0fb33b09ddbbbd2db10508e311f04",
    },
    Windows: {
      url: `https://github.com/cemu-project/Cemu/releases/download/v${emulatorVersions.cemu}/cemu-${emulatorVersions.cemu}-windows-x64.zip`,
      hash: "a6bcc2bc42a362d10213819948f3152fae7d47f70067f25939b51d3ddcfb0896",
    },
  },
  dolphin: {
    Linux: {
      url: `https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/${emulatorVersions.dolphin}%402026-10-22_1792688909/Dolphin_Emulator-${emulatorVersions.dolphin}-anylinux-x86_64.AppImage`,
      hash: "46f94dfea10e8a480e98ac128276a6ce2761cf0308e67f66b11be80fc48565df",
    },
    Windows: {
      url: `https://dl.dolphin-emu.org/releases/${emulatorVersions.dolphin}/dolphin-${emulatorVersions.dolphin}-x64.7z`,
      hash: "bbfd13bf9e6d2a4164a15c392b1f32a9b18150e5136746b388704608fbb60f76",
    },
  },
  dosboxpure: {
    Linux: {
      url: `https://github.com/pkgforge-dev/DOSBox-Pure-Unleashed-AppImage/releases/download/f0453b42b%402026-10-01_1790868062/DOSBox_Pure_Unleashed-f0453b42b-anylinux-x86_64.AppImage`,
      hash: "c954eb201980bdbe866a2a0b5196127b8131f6ed99a41eb4a8927dcdd0cea462",
    },
    Windows: {
      url: `https://codeberg.org/schelling/dosbox-pure-unleashed/releases/download/${emulatorVersions.dosboxpure}/dosbox_pure_unleashed-windows-64bit-${emulatorVersions.dosboxpure}.zip`,
      hash: "84985ae6ae3163dd3b94432e549b163e35add07276315f0f70bc6e87e845644a",
    },
  },
  duckstation: {
    Linux: {
      url: `https://github.com/pkgforge-dev/DuckStation-GPL-AppImage-Enhanced/releases/download/0.1.7465-7%402026-05-01_1777674496/DuckStation-0.1.7465-7-anylinux-x86_64.AppImage`,
      hash: "3902115dbff11cdd44133b34c24c2dfbcac35cda092bab9c8e61604158304b2b",
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
      url: `https://github.com/pkgforge-dev/Flycast-AppImage-Enhanced/releases/download/${emulatorVersions.flycast}%402026-10-01_1790875174/Flycast-${emulatorVersions.flycast}-anylinux-x86_64.AppImage`,
      hash: "56407473faef14cf2a34d61c06419dbdca11fe1acebe729cdea4b70f8b169ecb",
    },
    Windows: {
      url: `https://github.com/flyinghead/flycast/releases/download/v${emulatorVersions.flycast}/flycast-win64-${emulatorVersions.flycast}.zip`,
      hash: "7edf489ba6b3053703a18ce8233767eb71a2d89e4bda0421b312c2167a739161",
    },
  },
  mame: {
    Linux: {
      url: `https://github.com/pkgforge-dev/MAME-AppImage/releases/download/0.289-1%402026-09-01_1788278259/MAME-0.289-1-anylinux-x86_64.AppImage`,
      hash: "af7595453acdab0d290c90699ce3f999d653f1fa2820182ef628eb7dd2111b51",
    },
    Windows: {
      url: `https://github.com/mamedev/mame/releases/download/mame0289/mame0289b_x64.exe`,
      hash: "a1aa7912168c9d1b05e611906bc21b8b9be3935822aead36d12a1da363150b7d",
    },
  },
  mednafen: {
    Linux: {
      url: `https://github.com/bmsuseluda/mednafen-sdl3/releases/download/v${emulatorVersions.mednafen}-1/mednafen-${emulatorVersions.mednafen}-1-x86_64.AppImage`,
      hash: "7c5a0e2d4616d7166d9bc0ec831500e6e0a88c58a0eb5023cbc3cbc25ab6c4f2",
    },
    Windows: {
      url: `https://github.com/bmsuseluda/mednafen-sdl3/releases/download/v${emulatorVersions.mednafen}-1/mednafen-${emulatorVersions.mednafen}-1-x86_64.zip`,
      hash: "6bfcafae7699ae2bf6f2d88b5f0038e2c68cd2549429a1e8518a4e6e1cc2a039",
    },
  },
  melonds: {
    Linux: {
      url: `https://github.com/pkgforge-dev/melonDS-AppImage-Enhanced/releases/download/1.1-2%402026-10-01_1790875607/melonDS-1.1-2-anylinux-x86_64.AppImage`,
      hash: "41915deccde84e0dc65fdee3f45980e17249145a410497b68ecfa7b20d057eed",
    },
    Windows: {
      url: `https://github.com/melonDS-emu/melonDS/releases/download/${emulatorVersions.melonds}/melonDS-${emulatorVersions.melonds}-windows-x86_64.zip`,
      hash: "9f3f8a244103be20b5b657af5b0ed1b2a66bb20a7181476a6d294c9a53d4f8c8",
    },
  },
  pcsx2: {
    Linux: {
      url: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions.pcsx2}/pcsx2-v${emulatorVersions.pcsx2}-linux-appimage-x64-Qt.AppImage`,
      hash: "0c46bb6a88aa2782b10853a7b07cf3387ba99cbef2b966372cd2315b8571abea",
    },
    Windows: {
      url: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions.pcsx2}/pcsx2-v${emulatorVersions.pcsx2}-windows-x64-Qt.7z`,
      hash: "7dfc829ca1994cc1045ac49f05e39b6cf968b72e6a374c40e05c2a2b4ac200b4",
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
      url: `https://github.com/RPCS3/rpcs3-binaries-linux/releases/download/build-1b1b7dea308e8385a636ddf208c77498b01bc061/rpcs3-v${emulatorVersions.rpcs3}-20337-1b1b7dea_linux64.AppImage`,
      hash: "541649AED66A70600B14B33BBB343F3C57A3BBE1FA08CFD62101CAC91C672A71",
    },
    Windows: {
      url: `https://github.com/RPCS3/rpcs3-binaries-win/releases/download/build-1b1b7dea308e8385a636ddf208c77498b01bc061/rpcs3-v${emulatorVersions.rpcs3}-20337-1b1b7dea_win64_msvc.7z`,
      hash: "30F6D961875BDD24E7D9C360B6AC2AEABB08CE94CF2A2F4C706CF894CF8A5CE0",
    },
  },
  ryujinx: {
    Linux: {
      url: `https://git.ryujinx.app/projects/Ryubing/releases/download/${emulatorVersions.ryujinx}/ryujinx-${emulatorVersions.ryujinx}-x64.AppImage`,
      hash: "b4511f46612276bb8490d7c30a017622854be75a06c1ca7a9728b71862d4822a",
    },
    Windows: {
      url: `https://git.ryujinx.app/projects/Ryubing/releases/download/${emulatorVersions.ryujinx}/ryujinx-${emulatorVersions.ryujinx}-win_x64.zip`,
      hash: "50556677d4dd1b201d4dea4cf7d5586b5d83bf798402b704c5292e19e772a6de",
    },
  },
  scummvm: {
    Linux: {
      url: `https://github.com/pkgforge-dev/ScummVM-AppImage/releases/download/${emulatorVersions.scummvm}-1%402026-10-22_1792688032/ScummVM-${emulatorVersions.scummvm}-1-anylinux-x86_64.AppImage`,
      hash: "650e40d4c5143eee19461d3f0bc450e527899944cfd1e3560b7873e235dc0bac",
    },
    Windows: {
      url: `https://downloads.scummvm.org/frs/scummvm/${emulatorVersions.scummvm}/scummvm-${emulatorVersions.scummvm}-win32-x86_64.zip`,
      hash: "fb60cfc0828ed86ef24a60c04b9390676493ab85892d81c56d1de90367d56736",
    },
  },
  xemu: {
    Linux: {
      url: `https://github.com/pkgforge-dev/xemu-AppImage-Enhanced/releases/download/${emulatorVersions.xemu}%402026-10-01_1790871942/xemu-${emulatorVersions.xemu}-anylinux-x86_64.AppImage`,
      hash: "0c20629575d007ca666dad4e0a24ef93b5c521dcf19363574706ab0784110d12",
    },
    Windows: {
      url: `https://github.com/xemu-project/xemu/releases/download/v${emulatorVersions.xemu}/xemu-win-x86_64-release.zip`,
      hash: "b25a6c24a2c2c36a0843a153cd9ee59ca6833ef87bdcd855ba0824930e4ddd1d",
    },
  },
} satisfies Partial<EmulatorDownloads>;
