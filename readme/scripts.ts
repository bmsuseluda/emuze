import { categories } from "../app/server/categoriesDB.server/index.js";
import type { ApplicationId } from "../app/server/applicationsDB.server/applicationId.js";
import type { SystemId } from "../app/server/categoriesDB.server/systemId.js";
import { commandLineOptionsString } from "../app/server/commandLine.server.js";
import { emulatorVersions } from "../downloadEmulators/downloadEmulators.js";
import { keyboardMapping } from "../app/types/gamepad.js";

const preConfigured: ApplicationId[] = [
  "ares",
  "azahar",
  "dolphin",
  "duckstation",
  "flycast",
  "mednafen",
  "pcsx2",
  "ppsspp",
  "scummvm",
  "rpcs3",
  "ryujinx",
  "xemu",
];

const bundled: Partial<Record<ApplicationId, string>> = {
  ares: emulatorVersions.ares,
  azahar: emulatorVersions.azahar,
  dolphin: emulatorVersions.dolphin,
  duckstation: emulatorVersions.duckstation,
  flycast: emulatorVersions.flycast,
  mame: emulatorVersions.mame,
  mednafen: emulatorVersions.mednafen,
  pcsx2: emulatorVersions.pcsx2,
  ppsspp: emulatorVersions.ppsspp,
  rpcs3: emulatorVersions.rpcs3,
  ryujinx: emulatorVersions.ryujinx,
  xemu: emulatorVersions.xemu,
};

const biosNeeded: SystemId[] = [
  "sonyplaystation",
  "sonyplaystation2",
  "sonyplaystation3",
  "segacd",
  "segamegald",
  "sega32x",
  "segasaturn",
  "pcenginecd",
  "pcenginesupergrafx",
  "neogeopocket",
  "neogeopocketcolor",
  "nintendogameboyadvance",
  "nintendowiiu",
  "nintendoswitch",
  "xbox",
];

const homepages: Record<ApplicationId, string> = {
  ares: "https://github.com/ares-emulator/ares",
  cemu: "https://github.com/cemu-project/Cemu",
  dolphin: "https://github.com/dolphin-emu/dolphin",
  dosboxstaging: "https://github.com/dosbox-staging/dosbox-staging",
  duckstation: "https://github.com/stenzek/duckstation",
  flycast: "https://github.com/flyinghead/flycast",
  azahar: "https://github.com/azahar-emu/azahar",
  mame: "https://github.com/mamedev/mame",
  mednafen: "https://mednafen.github.io/",
  melonds: "https://github.com/melonDS-emu/melonDS",
  pcsx2: "https://github.com/PCSX2/pcsx2",
  ppsspp: "https://github.com/hrydgard/ppsspp",
  rpcs3: "https://github.com/RPCS3/rpcs3",
  ryujinx: "https://git.ryujinx.app/ryubing/ryujinx",
  rosaliesMupenGui: "https://github.com/Rosalie241/RMG",
  scummvm: "https://github.com/scummvm/scummvm",
  xemu: "https://github.com/xemu-project/xemu",
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
      const isBundled = bundled[category.application.id]
        ? `v${bundled[category.application.id]}`
        : "-";
      const isBiosNeeded = biosNeeded.includes(category.id) ? "Yes" : "No";

      return `| ${systemName} | ${emulatorName} | ${isPreConfigured} | ${isBundled} | ${isBiosNeeded} | `;
    })
    .filter(Boolean)
    .join("\n");

export const createSystemsTableExpert = () =>
  Object.values(categories)
    .map((category) => {
      if (category.id === "lastPlayed") {
        return null;
      }
      const systemName = category.names[0];
      const systemNames = category.names.join(", ");
      const fileExtensions = category.application.fileExtensions
        ?.map((fileExtension) => `\`${fileExtension}\``)
        .join(", ");
      const entryAsDirectory = category.application.entryAsDirectory;

      return `| ${systemName} | ${systemNames} | ${entryAsDirectory ? "Folder" : fileExtensions} | `;
    })
    .filter(Boolean)
    .join("\n");

export const createKeyboardMapping = () =>
  Object.entries(keyboardMapping)
    .map(([buttonId, keyboardKey]) => `| ${buttonId} | ${keyboardKey} | `)
    .join("\n");

const windowsDownloadFileName = `emuze-Setup-${process.env.npm_package_version}.exe`;
const linuxDownloadFileName = `emuze-${process.env.npm_package_version}.AppImage`;

const getDownloadLink = (fileName: string) =>
  `https://github.com/bmsuseluda/emuze/releases/download/v${process.env.npm_package_version}/${fileName}`;

export const getWindowsDownloadLink = (prefix?: string) =>
  `${prefix}[Download](${getDownloadLink(
    windowsDownloadFileName,
  )}) the latest Version of emuze and install it`;

export const getLinuxDownloadLink = (prefix?: string) =>
  `${prefix}[Download](${getDownloadLink(
    linuxDownloadFileName,
  )}) the latest Version of emuze`;

export const getCommandLineOptions = () => `\`\`\`
${commandLineOptionsString}
\`\`\``;
