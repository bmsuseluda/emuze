import type { ApplicationId } from "../app/server/applicationsDB.server/applicationId.js";
import { basename, join } from "node:path";

import { emulatorDownloads } from "./definitions/emulatorVersions.js";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import _7z from "7zip-min";
import { moveSync } from "fs-extra/esm";

import { isWindows } from "../app/server/operationsystem.server.js";
import { downloadAndExtract, downloadFile } from "./utils/downloadFile.js";
import { removeFile } from "../app/server/readWriteData.server.js";
import { applications } from "./definitions/applications.js";
import { executeWithLogs } from "./utils/executeWithLogs.js";
import { makeFileExecutableLinux } from "./utils/makeFileExecutableLinux.js";

const __dirname = import.meta.dirname;
const projectPath = join(__dirname, "..");

const emulatorsFolderPath = join(projectPath, "emulators");
export const latestEmulatorsPath = join(projectPath, "latestEmulators");

const downloadEmulator = (emulatorId: ApplicationId, downloadLink: string) => {
  const bundledPathRelative = applications[emulatorId].bundledPath;
  const bundledPath = join(emulatorsFolderPath, bundledPathRelative);

  if (!existsSync(bundledPath)) {
    const emulatorFolderPath = join(emulatorsFolderPath, emulatorId);

    if (!existsSync(bundledPath)) {
      mkdirSync(emulatorFolderPath, { recursive: true });

      if (downloadLink.toLowerCase().endsWith(".appimage")) {
        downloadAppImage(downloadLink, bundledPath);
      } else if (downloadLink.toLowerCase().endsWith(".7z")) {
        downloadAndExtract7z(downloadLink, emulatorFolderPath, bundledPath);
      } else if (downloadLink.toLowerCase().endsWith(".exe")) {
        downloadExe(downloadLink, emulatorFolderPath, bundledPath);
      } else {
        downloadAndExtract(
          downloadLink,
          emulatorFolderPath,
          bundledPath,
          () => removeRootFolderIfNecessary(emulatorFolderPath),
          exitOnResponseCodeError,
        );
      }
    }
  }
};

export const downloadEmulators = () => {
  if (existsSync(latestEmulatorsPath)) {
    cpSync(latestEmulatorsPath, emulatorsFolderPath);
  } else {
    Object.entries(emulatorDownloads).forEach(
      ([emulatorId, emulatorDownload]) => {
        const { url } = emulatorDownload[isWindows() ? "Windows" : "Linux"];

        downloadEmulator(emulatorId as ApplicationId, url);
      },
    );
  }
};

const downloadAndExtract7z = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
) => {
  const zipFilePath = join(outputFolder, url.split("/").at(-1) || "");

  downloadFile(
    url,
    zipFilePath,
    () => {
      _7z.unpack(zipFilePath, outputFolder, (error) => {
        if (!error) {
          rmSync(zipFilePath, { recursive: true, force: true });
          removeRootFolderIfNecessary(outputFolder);
          if (!existsSync(fileToCheck)) {
            console.error(`${fileToCheck} does not exist`);
            process.exit(1);
          }
          console.log(`${url} extracted`);
        }
      });
    },
    () => {
      exitOnResponseCodeError();
    },
  );
};

const exitOnResponseCodeError = () => {
  rmSync(emulatorsFolderPath, { recursive: true, force: true });
  process.exit(1);
};

const downloadAppImage = (url: string, fileToCheck: string) => {
  downloadFile(
    url,
    fileToCheck,
    () => {
      makeFileExecutableLinux(fileToCheck);
    },
    () => {
      exitOnResponseCodeError();
    },
  );
};

const downloadExe = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
) => {
  const exeFilePath = join(outputFolder, url.split("/").at(-1) || "");

  downloadFile(
    url,
    exeFilePath,
    () => {
      setTimeout(() => {
        const output = executeWithLogs("start", [
          "/b",
          "/wait",
          exeFilePath,
          `-o"${outputFolder}"`,
          "-y",
        ]);
        console.log(output);
        console.log(outputFolder);
        console.log(exeFilePath);
        console.log(fileToCheck);
        rmSync(exeFilePath, { recursive: true, force: true });
        if (!existsSync(fileToCheck)) {
          console.error(`${fileToCheck} does not exist`);
          process.exit(1);
        }
        console.log(`${url} extracted`);
      }, 2000);
    },
    () => {
      exitOnResponseCodeError();
    },
  );
};

const removeRootFolderIfNecessary = (folder: string) => {
  const files = readdirSync(folder);

  if (files.length === 1) {
    const fileStats = statSync(join(folder, files[0]));
    if (fileStats.isDirectory()) {
      const tempFolder = join(folder, "..", `${basename(folder)}TempFolder`);

      // rename target folder to temp folder
      renameSync(folder, tempFolder);

      // move and rename root folder to target folder
      const rootFolder = join(tempFolder, files[0]);
      moveSync(rootFolder, folder);

      removeFile(tempFolder);
    }
  }
};
