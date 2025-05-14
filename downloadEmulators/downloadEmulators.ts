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
  renameSync,
  rmSync,
} from "node:fs";
import _7z from "7zip-min";
import nodepath from "path";
import { readdirSync } from "fs";
import { moveSync } from "fs-extra";

type OperatingSystem = "Windows" | "Linux";
type EmulatorDownloads = Record<ApplicationId, Record<OperatingSystem, string>>;

const emulatorDownloads: Partial<EmulatorDownloads> = {
  ares: {
    Linux:
      "https://github.com/pkgforge-dev/ares-emu-appimage/releases/download/v144/ares-v144-anylinux-x86_64.AppImage",
    Windows:
      "https://github.com/ares-emulator/ares/releases/download/v144/ares-windows-x64.zip",
  },
  azahar: {
    Linux:
      "https://github.com/pkgforge-dev/Azahar-AppImage-Enhanced/releases/download/2121.1/Azahar-Enhanced-2121.1-anylinux-x86_64.AppImage",
    Windows:
      "https://github.com/azahar-emu/azahar/releases/download/2121.1/azahar-2121.1-windows-msys2.zip",
  },
  duckstation: {
    Linux:
      "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/DuckStation-x64.AppImage",
    Windows:
      "https://github.com/stenzek/duckstation/releases/download/v0.1-7371/duckstation-windows-x64-release.zip",
  },
  dolphin: {
    Linux:
      "https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/2503a-316/Dolphin_Emulator-2503a-316-anylinux.dwarfs-x86_64.AppImage",
    Windows: "https://dl.dolphin-emu.org/releases/2503a/dolphin-2503a-x64.7z",
  },
  pcsx2: {
    Linux:
      "https://github.com/PCSX2/pcsx2/releases/download/v2.2.0/pcsx2-v2.2.0-linux-appimage-x64-Qt.AppImage",
    Windows:
      "https://github.com/PCSX2/pcsx2/releases/download/v2.2.0/pcsx2-v2.2.0-windows-x64-Qt.7z",
  },
  ryujinx: {
    Linux:
      "https://github.com/Ryubing/Stable-Releases/releases/download/1.3.1/ryujinx-1.3.1-x64.AppImage",
    Windows:
      "https://github.com/Ryubing/Stable-Releases/releases/download/1.3.1/ryujinx-1.3.1-win_x64.zip",
  },
};

const emulatorsFolderPath = join(__dirname, "..", "emulators");

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

export const downloadEmulators = (os: OperatingSystem) => {
  Object.entries(emulatorDownloads).forEach(([emulatorId, downloadLink]) => {
    downloadEmulator(emulatorId as ApplicationId, downloadLink[os], os);
  });
};

const downloadAndExtract7z = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
) => {
  const zipFilePath = nodepath.join(outputFolder, url.split("/").at(-1) || "");

  downloadFile(url, zipFilePath, () => {
    _7z.unpack(zipFilePath, outputFolder, (error) => {
      if (!error) {
        rmSync(zipFilePath, { recursive: true, force: true });
        removeRootFolderIfNecessary(outputFolder);
        console.log(`${url} extracted`);
      } else if (!existsSync(fileToCheck)) {
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

const removeRootFolderIfNecessary = (folder: string) => {
  const files = readdirSync(folder);

  if (files.length === 1) {
    const tempFolder = nodepath.join(
      folder,
      "..",
      `${nodepath.basename(folder)}TempFolder`,
    );

    // rename target folder to temp folder
    renameSync(folder, tempFolder);

    // move and rename root folder to target folder
    const rootFolder = nodepath.join(tempFolder, files[0]);
    moveSync(rootFolder, folder);

    // remove temp folder
    rmSync(tempFolder, { recursive: true, force: true });
  }
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
          await decompress(buffer, outputFolder, {
            filter: (file) => !file.path.endsWith("/"),
          });
          console.log(`Download of ${url} complete`);
          console.log(`${url} extracted`);
          removeRootFolderIfNecessary(outputFolder);

          if (!existsSync(fileToCheck)) {
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
