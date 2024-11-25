import { ApplicationId } from "../app/server/applicationsDB.server/applicationId";
import { join } from "node:path";
import { https } from "follow-redirects";
import decompress from "decompress";
import { applications } from "../app/server/applicationsDB.server";
import { chmodSync, createWriteStream, existsSync, mkdirSync } from "node:fs";

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

    if (downloadLink.toLowerCase().endsWith("appimage")) {
      downloadExecutable(downloadLink, bundledPath);
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

const downloadExecutable = (url: string, fileToCheck: string) => {
  const file = createWriteStream(fileToCheck);

  https
    .get(url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`Download of ${url} complete`);
        makeFileExecutableLinux(fileToCheck);
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading the file: ${err.message}`);
      process.exit(1);
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
