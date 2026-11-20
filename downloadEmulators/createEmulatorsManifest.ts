import { join } from "node:path";
import { ApplicationId } from "../app/server/applicationsDB.server/applicationId.js";
import { handleOperatingSystem } from "../app/server/operationsystem.server.js";
import { executeWithLogs } from "./utils/executeWithLogs.js";
import {
  emulatorsManifestLinuxPath,
  emulatorsManifestMacPath,
  emulatorsManifestWindowsPath,
} from "../app/server/bundledEmulatorsPath.server.js";
import { writeFileSync } from "node:fs";
import {
  Download,
  emulatorDownloads,
  getOperatingsSystem,
} from "./definitions/emulatorVersions.js";

const __dirname = import.meta.dirname;

const projectPath = join(__dirname, "..");

const absoluteEmulatorsManifestPathLinux = join(
  projectPath,
  emulatorsManifestLinuxPath,
);
const absoluteEmulatorsManifestPathMac = join(
  projectPath,
  emulatorsManifestMacPath,
);
const absoluteEmulatorsManifestPathWindows = join(
  projectPath,
  emulatorsManifestWindowsPath,
);

type EmulatorsManifestFile = Record<ApplicationId, Download>;

export const createEmulatorsManifestFile = () => {
  const emulatorsManifestFile: EmulatorsManifestFile = Object.entries(
    emulatorDownloads,
  ).reduce<EmulatorsManifestFile>(
    (accumulator, [emulatorId, emulatorDownload]) => {
      const donwloadManifest = emulatorDownload[getOperatingsSystem()];
      if (donwloadManifest) {
        const { url, hash } = donwloadManifest;

        accumulator[emulatorId as ApplicationId] = {
          url,
          hash,
        };
      }
      return accumulator;
    },
    {} as EmulatorsManifestFile,
  );

  const path = handleOperatingSystem({
    windows: absoluteEmulatorsManifestPathWindows,
    mac: absoluteEmulatorsManifestPathMac,
    linux: absoluteEmulatorsManifestPathLinux,
  });

  writeFileSync(path, JSON.stringify(emulatorsManifestFile));
  const output = executeWithLogs("yarn", [
    "prettier",
    ...["--ignore-path", ".prettierignore"],
    ...["--write", path],
  ]);
  console.log(output);
};
