import { join } from "node:path";
import { downloadFile } from "../downloadEmulators/utils/downloadFile.js";
import { ApplicationId } from "../app/server/applicationsDB.server/applicationId.js";

export const licenseUrls: Record<ApplicationId, string> = {
  ares: "https://raw.githubusercontent.com/ares-emulator/ares/refs/heads/master/LICENSE",
  cemu: "https://raw.githubusercontent.com/cemu-project/Cemu/refs/heads/main/LICENSE.txt",
  dolphin:
    "https://raw.githubusercontent.com/dolphin-emu/dolphin/refs/heads/master/COPYING",
  dosboxpure:
    "https://codeberg.org/schelling/dosbox-pure-unleashed/raw/branch/main/LICENSE",
  duckstation:
    "https://raw.githubusercontent.com/Kyuyrii/Duckstation-GPL/refs/heads/main/LICENSE",
  eden: "https://git.eden-emu.dev/eden-emu/eden/raw/branch/master/LICENSE.txt",
  flycast:
    "https://raw.githubusercontent.com/flyinghead/flycast/refs/heads/master/LICENSE",
  azahar:
    "https://raw.githubusercontent.com/azahar-emu/azahar/refs/heads/master/LICENSE.txt",
  mame: "https://raw.githubusercontent.com/mamedev/mame/refs/heads/master/COPYING",
  mednafen:
    "https://raw.githubusercontent.com/bmsuseluda/mednafen-sdl3/refs/heads/master/COPYING",
  melonds:
    "https://raw.githubusercontent.com/melonDS-emu/melonDS/refs/heads/master/LICENSE",
  pcsx2:
    "https://raw.githubusercontent.com/PCSX2/pcsx2/refs/heads/master/COPYING.GPLv3",
  ppsspp:
    "https://raw.githubusercontent.com/hrydgard/ppsspp/refs/heads/master/LICENSE.TXT",
  rpcs3:
    "https://raw.githubusercontent.com/RPCS3/rpcs3/refs/heads/master/LICENSE",
  ryujinx:
    "https://git.ryujinx.app/projects/Ryubing/raw/branch/master/LICENSE.txt",
  rosaliesMupenGui:
    "https://raw.githubusercontent.com/Rosalie241/RMG/refs/heads/master/LICENSE",
  scummvm:
    "https://raw.githubusercontent.com/scummvm/scummvm/refs/heads/master/COPYING",
  xemu: "https://raw.githubusercontent.com/xemu-project/xemu/refs/heads/master/COPYING",
};

const __dirname = import.meta.dirname;
const projectPath = join(__dirname, "..");

const licensesFolderPath = join(projectPath, "LICENSES");

export const createThirdPartyLicensesFile = () => {
  Object.entries(licenseUrls).forEach(([applicationId, licenseUrl]) => {
    downloadFile(licenseUrl, join(licensesFolderPath, applicationId));
  });
};

createThirdPartyLicensesFile();
