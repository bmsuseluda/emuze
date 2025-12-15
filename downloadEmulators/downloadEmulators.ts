import type { ApplicationId } from "../app/server/applicationsDB.server/applicationId.js";
import nodepath, { basename, join } from "node:path";
import followRedirects from "follow-redirects";
import decompress from "decompress";
import { applications, emulatorVersions } from "./applications.js";
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
import { spawnSync } from "node:child_process";
import { isWindows } from "../app/server/operationsystem.server.js";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));

type OperatingSystem = "Windows" | "Linux";
type EmulatorDownloads = Record<ApplicationId, Record<OperatingSystem, string>>;

const emulatorDownloads = {
  ares: {
    Linux: `https://github.com/pkgforge-dev/ares-emu-appimage/releases/download/v${emulatorVersions.ares}%402025-10-10_1760076331/ares-v${emulatorVersions.ares}-anylinux-x86_64.AppImage`,
    Windows: `https://github.com/ares-emulator/ares/releases/download/v${emulatorVersions.ares}/ares-windows-x64.zip`,
  },
  azahar: {
    Linux: `https://github.com/pkgforge-dev/Azahar-AppImage-Enhanced/releases/download/${emulatorVersions.azahar}%402025-10-01_1759305782/Azahar-Enhanced-${emulatorVersions.azahar}-anylinux-x86_64.AppImage`,
    Windows: `https://github.com/azahar-emu/azahar/releases/download/${emulatorVersions.azahar}/azahar-${emulatorVersions.azahar}-windows-msys2.zip`,
  },
  cemu: {
    Linux: `https://github.com/pkgforge-dev/Cemu-AppImage-Enhanced/releases/download/${emulatorVersions.cemu}-4%402025-12-01_1764576866/Cemu-${emulatorVersions.cemu}-4-anylinux-x86_64.AppImage`,
    Windows: `https://github.com/cemu-project/Cemu/releases/download/v${emulatorVersions.cemu}/Cemu-${emulatorVersions.cemu}-x86_64.AppImage`,
  },
  dolphin: {
    Linux: `https://github.com/pkgforge-dev/Dolphin-emu-AppImage/releases/download/${emulatorVersions.dolphin}%402025-10-01_1759304685/Dolphin_Emulator-${emulatorVersions.dolphin}-anylinux.dwarfs-x86_64.AppImage`,
    Windows: `https://dl.dolphin-emu.org/releases/${emulatorVersions.dolphin}/dolphin-${emulatorVersions.dolphin}-x64.7z`,
  },
  duckstation: {
    Linux: `https://github.com/Kyuyrii/Duckstation-GPL3/releases/download/v${emulatorVersions.duckstation}/DuckStation-x64.AppImage`,
    Windows: `https://github.com/Kyuyrii/Duckstation-GPL3/releases/download/v${emulatorVersions.duckstation}/duckstation-windows-x64-release.zip`,
  },
  flycast: {
    Linux: `https://github.com/flyinghead/flycast/releases/download/v${emulatorVersions.flycast}/flycast-x86_64.AppImage`,
    Windows: `https://github.com/flyinghead/flycast/releases/download/v${emulatorVersions.flycast}/flycast-win64-${emulatorVersions.flycast}.zip`,
  },
  mame: {
    Linux: `https://github.com/pkgforge-dev/MAME-AppImage/releases/download/0.281-1%402025-10-08_1759937007/MAME-0.281-1-anylinux-x86_64.AppImage`,
    Windows: `https://github.com/mamedev/mame/releases/download/mame0281/mame0281b_x64.exe`,
  },
  mednafen: {
    Linux: `https://github.com/pkgforge-dev/mednafen-appimage/releases/download/${emulatorVersions.mednafen}%402025-09-08_1757361413/mednafen-${emulatorVersions.mednafen}-anylinux-x86_64.AppImage`,
    Windows: `https://mednafen.github.io/releases/files/mednafen-${emulatorVersions.mednafen}-win64.zip`,
  },
  melonds: {
    Linux: `https://github.com/melonDS-emu/melonDS/releases/download/${emulatorVersions.melonds}/melonDS-appimage-x86_64.zip`,
    Windows: `https://github.com/melonDS-emu/melonDS/releases/download/${emulatorVersions.melonds}/melonDS-windows-x86_64.zip`,
  },
  pcsx2: {
    Linux: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions.pcsx2}/pcsx2-v${emulatorVersions.pcsx2}-linux-appimage-x64-Qt.AppImage`,
    Windows: `https://github.com/PCSX2/pcsx2/releases/download/v${emulatorVersions.pcsx2}/pcsx2-v${emulatorVersions.pcsx2}-windows-x64-Qt.7z`,
  },
  ppsspp: {
    Linux: `https://github.com/hrydgard/ppsspp/releases/download/v${emulatorVersions.ppsspp}/PPSSPP-v${emulatorVersions.ppsspp}-anylinux-x86_64.AppImage`,
    Windows: `https://www.ppsspp.org/files/${emulatorVersions.ppsspp.replaceAll(".", "_")}/ppsspp_win.zip`,
  },
  rosaliesMupenGui: {
    Linux: `https://github.com/pkgforge-dev/RMG-AppImage-Enhanced/releases/download/${emulatorVersions.rosaliesMupenGui}-1%402025-11-22_1763800010/RMG-${emulatorVersions.rosaliesMupenGui}-1-anylinux-x86_64.AppImage`,
    Windows: `https://github.com/Rosalie241/RMG/releases/download/v${emulatorVersions.rosaliesMupenGui}/RMG-Portable-Windows64-v${emulatorVersions.rosaliesMupenGui}.zip`,
  },
  rpcs3: {
    Linux: `https://github.com/RPCS3/rpcs3-binaries-linux/releases/download/build-5a9083e4fc0bfb73b09c4c436d8f5e78f8c2702a/rpcs3-v${emulatorVersions.rpcs3}-18397-5a9083e4_linux64.AppImage`,
    Windows: `https://github.com/RPCS3/rpcs3-binaries-win/releases/download/build-5a9083e4fc0bfb73b09c4c436d8f5e78f8c2702a/rpcs3-v${emulatorVersions.rpcs3}-18397-5a9083e4_win64_msvc.7z`,
  },
  ryujinx: {
    Linux: `https://git.ryujinx.app/api/v4/projects/1/packages/generic/Ryubing/${emulatorVersions.ryujinx}/ryujinx-${emulatorVersions.ryujinx}-x64.AppImage`,
    Windows: `https://git.ryujinx.app/api/v4/projects/1/packages/generic/Ryubing/${emulatorVersions.ryujinx}/ryujinx-${emulatorVersions.ryujinx}-win_x64.zip`,
  },
  xemu: {
    Linux: `https://github.com/xemu-project/xemu/releases/download/v${emulatorVersions.xemu}/xemu-v${emulatorVersions.xemu}-x86_64.AppImage`,
    Windows: `https://github.com/xemu-project/xemu/releases/download/v${emulatorVersions.xemu}/xemu-win-x86_64-release.zip`,
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

const downloadEmulator = (emulatorId: ApplicationId, downloadLink: string) => {
  const bundledPathRelative = applications[emulatorId].bundledPath!;
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
      downloadAndExtract7z(downloadLink, emulatorFolderPath, bundledPath);
    } else if (downloadLink.toLowerCase().endsWith(".exe")) {
      downloadExe(downloadLink, emulatorFolderPath, bundledPath);
    } else {
      downloadAndExtract(downloadLink, emulatorFolderPath, bundledPath);
    }
  }
};

export const downloadEmulators = () => {
  Object.entries(emulatorDownloads).forEach(([emulatorId, downloadLink]) => {
    downloadEmulator(
      emulatorId as ApplicationId,
      downloadLink[isWindows() ? "Windows" : "Linux"],
    );
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

const executeWithLogs = (applicationPath: string, args: string[]): string => {
  const result = spawnSync(applicationPath, args, {
    stdio: ["inherit", "pipe", "inherit"],
    shell: true,
    encoding: "utf8",
  });

  return result.stdout || "";
};

const downloadExe = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
) => {
  const exeFilePath = join(outputFolder, url.split("/").at(-1) || "");

  downloadFile(url, exeFilePath, () => {
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

downloadEmulators();
