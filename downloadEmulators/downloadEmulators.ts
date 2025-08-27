import type { ApplicationId } from "../app/server/applicationsDB.server/applicationId.js";
import nodepath, { basename, join } from "node:path";
import followRedirects from "follow-redirects";
import decompress from "decompress";
import { applications } from "../app/server/applicationsDB.server/index.js";
import {
  chmodSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import _7z from "7zip-min";
import { moveSync } from "fs-extra/esm";

import { fileURLToPath } from "node:url";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));

type OperatingSystem = "Windows" | "Linux";
type EmulatorDownloads = Record<ApplicationId, Record<OperatingSystem, string>>;

export const emulatorVersions = {
  ares: "146",
  azahar: "2123.1",
  dolphin: "2506a",
  duckstation: "0.1-7371",
  flycast: "2.5",
  pcsx2: "2.4.0",
  ppsspp: "1.19.3",
  rpcs3: "0.0.37",
  ryujinx: "1.3.2",
  xemu: "0.8.96",
} satisfies Partial<Record<ApplicationId, string>>;

const emulatorDownloads = {
  ares: {
    Linux: `https://github.com/pkgforge-dev/ares-emu-appimage/releases/download/v${emulatorVersions["ares"]}%402025-08-26_1756238563/ares-v${emulatorVersions["ares"]}-anylinux-x86_64.AppImage`,
    Windows: `https://github.com/ares-emulator/ares/releases/download/v${emulatorVersions["ares"]}/ares-windows-x64.zip`,
  },
  azahar: {
    Linux: `https://github.com/pkgforge-dev/Azahar-AppImage-Enhanced/releases/download/${emulatorVersions["azahar"]}%402025-08-23_1755946836/Azahar-Enhanced-${emulatorVersions["azahar"]}-anylinux-x86_64.AppImage`,
    Windows: `https://github.com/azahar-emu/azahar/releases/download/${emulatorVersions["azahar"]}/azahar-${emulatorVersions["azahar"]}-windows-msys2.zip`,
  },
  dolphin: {
    Linux: `https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/${emulatorVersions["dolphin"]}%402025-08-25_1756159991/Dolphin_Emulator-${emulatorVersions["dolphin"]}-anylinux.dwarfs-x86_64.AppImage`,
    Windows: `https://dl.dolphin-emu.org/releases/${emulatorVersions["dolphin"]}/dolphin-${emulatorVersions["dolphin"]}-x64.7z`,
  },
  duckstation: {
    Linux: `https://github.com/stenzek/duckstation/releases/download/v${emulatorVersions["duckstation"]}/DuckStation-x64.AppImage`,
    Windows: `https://github.com/stenzek/duckstation/releases/download/v${emulatorVersions["duckstation"]}/duckstation-windows-x64-release.zip`,
  },
  flycast: {
    Linux: `https://github.com/flyinghead/flycast/releases/download/v${emulatorVersions["flycast"]}/flycast-x86_64.AppImage`,
    Windows: `https://github.com/flyinghead/flycast/releases/download/v${emulatorVersions["flycast"]}/flycast-win64-${emulatorVersions["flycast"]}.zip`,
  },
  pcsx2: {
    Linux: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions["pcsx2"]}/pcsx2-v${emulatorVersions["pcsx2"]}-linux-appimage-x64-Qt.AppImage`,
    Windows: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions["pcsx2"]}/pcsx2-v${emulatorVersions["pcsx2"]}-windows-x64-Qt.7z`,
  },
  ppsspp: {
    Linux: `https://github.com/hrydgard/ppsspp/releases/download/v${emulatorVersions["ppsspp"]}/PPSSPP-v${emulatorVersions["ppsspp"]}-anylinux-x86_64.AppImage`,
    Windows: `https://www.ppsspp.org/files/${emulatorVersions["ppsspp"].replaceAll(".", "_")}/ppsspp_win.zip`,
  },
  rpcs3: {
    Linux: `https://github.com/RPCS3/rpcs3-binaries-linux/releases/download/build-b90bacba4870534dfc501a51119b5913337a5e95/rpcs3-v${emulatorVersions["rpcs3"]}-18087-b90bacba_linux64.AppImage`,
    Windows: `https://github.com/RPCS3/rpcs3-binaries-win/releases/download/build-9c93ec0bc31bbc94ca4dce2a76ceea80da6f6554/rpcs3-v${emulatorVersions["rpcs3"]}-18022-9c93ec0b_win64_msvc.7z`,
  },
  ryujinx: {
    Linux: `https://git.ryujinx.app/api/v4/projects/1/packages/generic/Ryubing/${emulatorVersions["ryujinx"]}/ryujinx-${emulatorVersions["ryujinx"]}-x64.AppImage`,
    Windows: `https://git.ryujinx.app/api/v4/projects/1/packages/generic/Ryubing/${emulatorVersions["ryujinx"]}/ryujinx-${emulatorVersions["ryujinx"]}-win_x64.zip`,
  },
  xemu: {
    Linux: `https://github.com/xemu-project/xemu/releases/download/v${emulatorVersions["xemu"]}/xemu-v${emulatorVersions["xemu"]}-x86_64.AppImage`,
    Windows: `https://github.com/xemu-project/xemu/releases/download/v${emulatorVersions["xemu"]}/xemu-win-x86_64-release.zip`,
  },
} satisfies Partial<EmulatorDownloads>;

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
  const zipFilePath = join(outputFolder, url.split("/").at(-1) || "");

  downloadFile(url, zipFilePath, () => {
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

  followRedirects.https
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
    const fileStats = statSync(join(folder, files[0]));
    if (fileStats.isDirectory()) {
      const tempFolder = join(folder, "..", `${basename(folder)}TempFolder`);

      // rename target folder to temp folder
      renameSync(folder, tempFolder);

      // move and rename root folder to target folder
      const rootFolder = join(tempFolder, files[0]);
      moveSync(rootFolder, folder);

      // remove temp folder
      rmSync(tempFolder, { recursive: true, force: true });
    }
  }
};

const downloadAndExtract = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
) => {
  console.log(`Download of ${url} started`);
  followRedirects.https
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
