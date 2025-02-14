import type { ApplicationId } from "../app/server/applicationsDB.server/applicationId";
import { join } from "node:path";
import { https } from "follow-redirects";
import decompress from "decompress";
import { applications } from "../app/server/applicationsDB.server";
import {
  chmodSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import _7z from "7zip-min";
import nodepath from "path";

const emulatorsFolderPath = join(__dirname, "..", "emulators");

export type EmulatorDownloads = Record<ApplicationId, string>;
type OperatingSystem = "Windows" | "Linux";

const makeFileExecutableLinux = (filePath: string) => {
  try {
    chmodSync(filePath, "755");
    console.log(`${filePath} is now executable`);
  } catch (error) {
    console.error(`Error making ${filePath} executable: ${error}`);
    process.exit(1);
  }
};

const downloadEmulator = (
  emulatorId: ApplicationId,
  downloadLink: string,
  os: OperatingSystem,
) => {
  const bundledPathRelative = applications[emulatorId][`bundledPath${os}`]!;
  const bundledPath = join(emulatorsFolderPath, bundledPathRelative);
  const bundledPathExists = existsSync(bundledPath);

  if (!bundledPathExists) {
    const emulatorFolderPath = join(emulatorsFolderPath, emulatorId);
    if (!existsSync(emulatorFolderPath)) {
      mkdirSync(emulatorFolderPath, { recursive: true });
    }

    if (downloadLink.toLowerCase().endsWith(".appimage")) {
      downloadAppImage(downloadLink, bundledPath);
    } else if (downloadLink.toLowerCase().endsWith(".7z")) {
      downloadAndExtract7z(
        downloadLink,
        join(emulatorsFolderPath, emulatorId),
        bundledPath,
      );
    } else {
      downloadAndExtract(
        downloadLink,
        join(emulatorsFolderPath, emulatorId),
        bundledPath,
      );
    }
  }
};

export const downloadEmulators = (
  emulatorDownloads: Partial<EmulatorDownloads>,
  os: OperatingSystem,
) => {
  // TODO: run in parallel
  Object.entries(emulatorDownloads).forEach(([emulatorId, downloadLink]) => {
    downloadEmulator(emulatorId as ApplicationId, downloadLink, os);
  });
};

const downloadAndExtract7z = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
) => {
  const zipFilePath = nodepath.join(outputFolder, url.split("/").at(-1) || "");

  downloadFile(url, zipFilePath, () => {
    _7z.unpack(zipFilePath, outputFolder, () => {
      if (existsSync(fileToCheck)) {
        console.log(`Download of ${url} complete`);
      } else {
        console.error(`${fileToCheck} does not exist`);
        process.exit(1);
      }
    });
  });
};

const exitOnResponseCodeError = (url: string, statusCode?: number) => {
  if (statusCode !== 200) {
    console.error(`Failed to download ${url}. Status code: ${statusCode}`);
    rmSync(emulatorsFolderPath, { recursive: true, force: true });
    process.exit(1);
  }
};

const downloadFile = (
  url: string,
  fileToCheck: string,
  onFinish?: () => void,
) => {
  const file = createWriteStream(fileToCheck);
  console.log(`Download of ${url} started`);

  https
    .get(url, (response) => {
      exitOnResponseCodeError(url, response.statusCode);

      response.pipe(file);

      file.on("finish", () => {
        file.close();

        console.log(`Download of ${url} complete`);
        onFinish?.();
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading the file: ${err.message}`);
      process.exit(1);
    });
};

const downloadAppImage = (url: string, fileToCheck: string) => {
  downloadFile(url, fileToCheck, () => {
    makeFileExecutableLinux(fileToCheck);
  });
};

const downloadAndExtract = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
) => {
  console.log(`Download of ${url} started`);
  https
    .get(url, (response) => {
      exitOnResponseCodeError(url, response.statusCode);

      const chunks: Buffer[] = [];

      response.on("data", (chunk) => {
        chunks.push(chunk);
      });

      response.on("end", async () => {
        const buffer = Buffer.concat(chunks);
        try {
          await decompress(buffer, outputFolder);
          if (existsSync(fileToCheck)) {
            console.log(`Download of ${url} complete`);
          } else {
            console.error(`${fileToCheck} does not exist`);
            process.exit(1);
          }
        } catch (err) {
          console.error(`Error during extraction: ${err}`);
          process.exit(1);
        }
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading the file: ${err.message}`);
      process.exit(1);
    });
};
