import { ApplicationId } from "../app/server/applicationsDB.server/applicationId";
import nodepath from "path";
import { https } from "follow-redirects";
import decompress from "decompress";
import { existsSync, mkdirSync } from "fs";
import { applications } from "../app/server/applicationsDB.server";

const emulatorsFolderPath = nodepath.join(__dirname, "..", "emulators");

export type EmulatorDownloads = Record<ApplicationId, string>;
type OperatingSystem = "Windows" | "Linux";

const downloadEmulator = (
  emulatorId: ApplicationId,
  downloadLink: string,
  os: OperatingSystem,
) => {
  const bundledPathRelative = applications[emulatorId][`bundledPath${os}`]!;
  const bundledPath = nodepath.join(emulatorsFolderPath, bundledPathRelative);
  const bundledPathExists = existsSync(bundledPath);
  if (!bundledPathExists) {
    const emulatorFolderPath = nodepath.join(emulatorsFolderPath, emulatorId);
    if (!existsSync(emulatorFolderPath)) {
      mkdirSync(emulatorFolderPath, { recursive: true });
    }

    downloadAndExtract(
      downloadLink,
      nodepath.join(emulatorsFolderPath, emulatorId),
      bundledPath,
    );
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

const downloadAndExtract = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
) => {
  https
    .get(url, (response) => {
      const chunks: Buffer[] = [];

      response.on("data", (chunk) => {
        chunks.push(chunk);
      });

      response.on("end", async () => {
        const buffer = Buffer.concat(chunks);
        try {
          await decompress(buffer, outputFolder);
          if (existsSync(fileToCheck)) {
            console.log("Extraction complete");
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
