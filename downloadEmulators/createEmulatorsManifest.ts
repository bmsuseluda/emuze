import { join } from "node:path";
import { ApplicationId } from "../app/server/applicationsDB.server/applicationId.js";
import { isWindows } from "../app/server/operationsystem.server.js";
import { executeWithLogs } from "./utils/executeWithLogs.js";
import {
  emulatorsManifestLinuxPath,
  emulatorsManifestWindowsPath,
} from "../app/server/bundledEmulatorsPath.server.js";
import { writeFileSync } from "node:fs";
import { Download, emulatorDownloads } from "./definitions/emulatorVersions.js";

const __dirname = import.meta.dirname;

const projectPath = join(__dirname, "..");

const absoluteEmulatorsManifestPathLinux = join(
  projectPath,
  emulatorsManifestLinuxPath,
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
      const { url, hash } = emulatorDownload[isWindows() ? "Windows" : "Linux"];

      accumulator[emulatorId as ApplicationId] = {
        url,
        hash,
      };
      return accumulator;
    },
    {} as EmulatorsManifestFile,
  );

  const path = isWindows()
    ? absoluteEmulatorsManifestPathWindows
    : absoluteEmulatorsManifestPathLinux;

  writeFileSync(path, JSON.stringify(emulatorsManifestFile));
  const output = executeWithLogs("yarn", [
    "prettier",
    ...["--ignore-path", ".prettierignore"],
    ...["--write", path],
  ]);
  console.log(output);
};
