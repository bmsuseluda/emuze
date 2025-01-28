import { categories } from "../app/server/categoriesDB.server";
import type { ApplicationId } from "../app/server/applicationsDB.server/applicationId";
import type { SystemId } from "../app/server/categoriesDB.server/systemId";

const preConfigured: ApplicationId[] = [
  "ares",
  "aresMegaDrive",
  "aresSega32x",
  "aresSegaCd",
  "aresSuperNintendo",
  "scummvm",
  "duckstation",
  "pcsx2",
  "ryujinx",
  "dolphin",
];

const bundled: ApplicationId[] = [
  "ares",
  "aresMegaDrive",
  "aresSega32x",
  "aresSegaCd",
  "aresSuperNintendo",
  "ryujinx",
  "dolphin",
];

const biosNeeded: SystemId[] = [
  "sonyplaystation",
  "sonyplaystation2",
  "sonyplaystation3",
  "segacd",
  "sega32x",
  "segasaturn",
  "pcenginecd",
  "pcenginesupergrafx",
  "neogeopocket",
  "neogeopocketcolor",
  "nintendowiiu",
  "nintendoswitch",
];

const homepages: Record<ApplicationId, string> = {
  ares: "https://github.com/ares-emulator/ares",
  aresMegaDrive: "https://github.com/ares-emulator/ares",
  aresSega32x: "https://github.com/ares-emulator/ares",
  aresSegaCd: "https://github.com/ares-emulator/ares",
  aresSuperNintendo: "https://github.com/ares-emulator/ares",
  cemu: "https://github.com/cemu-project/Cemu",
  dolphin: "https://github.com/dolphin-emu/dolphin",
  dosboxstaging: "https://github.com/dosbox-staging/dosbox-staging",
  duckstation: "https://github.com/stenzek/duckstation",
  flycast: "https://github.com/flyinghead/flycast",
  lime3ds: "https://github.com/Lime3DS/Lime3DS",
  mame: "https://github.com/mamedev/mame",
  mameNeoGeo: "https://github.com/mamedev/mame",
  mameNeoGeoCD: "https://github.com/mamedev/mame",
  mednafen: "https://mednafen.github.io/",
  mednafenSaturn: "https://mednafen.github.io/",
  mednafenPcEngineCD: "https://mednafen.github.io/",
  mednafenPcEngineSuperGrafx: "https://mednafen.github.io/",
  melonds: "https://github.com/melonDS-emu/melonDS",
  mgba: "https://github.com/mgba-emu/mgba",
  pcsx2: "https://github.com/PCSX2/pcsx2",
  ppsspp: "https://github.com/hrydgard/ppsspp",
  rosaliesMupenGui: "https://github.com/Rosalie241/RMG",
  rpcs3: "https://github.com/RPCS3/rpcs3",
  ryujinx: "https://github.com/GreemDev/Ryujinx",
  scummvm: "https://github.com/scummvm/scummvm",
};

const nameOverwrites: Partial<Record<SystemId, string>> = {
  dos: "Dos ([Supported Games](https://github.com/bmsuseluda/emuze/blob/main/app/server/applicationsDB.server/applications/dosbox/nameMapping/dos.json))",
};

export const createSystemsTable = () =>
  Object.values(categories)
    .map((category) => {
      if (category.id === "lastPlayed") {
        return null;
      }
      const systemName = nameOverwrites[category.id] || category.names[0];
      const emulatorName = `[${category.application.name}](${homepages[category.application.id]})`;
      const isPreConfigured = preConfigured.includes(category.application.id)
        ? "Yes"
        : "No";
      const isBundled = bundled.includes(category.application.id)
        ? "Yes"
        : "No";
      const isBiosNeeded = biosNeeded.includes(category.id) ? "Yes" : "No";

      return `| ${systemName} | ${emulatorName} | ${isPreConfigured} | ${isBundled} | ${isBiosNeeded} | `;
    })
    .filter(Boolean)
    .join("\n");

const windowsDownloadFileName = `emuze-Setup-${process.env.npm_package_version}.exe`;
const linuxDownloadFileName = `emuze-${process.env.npm_package_version}.AppImage`;

const getDownloadLink = (fileName: string) =>
  `https://github.com/bmsuseluda/emuze/releases/download/v${process.env.npm_package_version}/${fileName}`;

export const getWindowsDownloadLink = () =>
  `[Download](${getDownloadLink(
    windowsDownloadFileName,
  )}) the latest Version of emuze and install it.`;

export const getLinuxDownloadLink = (prefix?: string) =>
  `${prefix}[Download](${getDownloadLink(
    linuxDownloadFileName,
  )}) the latest Version of emuze`;
