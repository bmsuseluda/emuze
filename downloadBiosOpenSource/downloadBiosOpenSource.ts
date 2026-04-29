import { join, basename } from "node:path";
import {
  downloadAndExtract,
  downloadFile,
} from "../downloadEmulators/downloadFile.js";
import { copy, removeFile } from "../app/server/readWriteData.server.js";
import { existsSync } from "node:fs";

interface BiosDownloadDefinition {
  path: string;
  /** only necessary if path points to archive */
  subPath?: string;
}

const emulatorsBios: BiosDownloadDefinition[] = [
  {
    path: "https://github.com/neogeo-projects/neogeo-bios/releases/download/v0.0.2/neogeo-bios-mvs-us-v0.0.2.bin",
  },
  {
    path: "https://github.com/ez-me/gba-bios/releases/download/1.0/gba_bios.bin",
  },
  {
    path: "https://distrib.app/storage/assets/77b/d4f/d19/3c97129607573203202183c377b103b0131b23ad707ec4adc9cb33f/pcsx-redux-nightly-23726.20260420.7-x64.zip",
    subPath: "openbios.bin",
  },
];

const __dirname = import.meta.dirname;

const biosFolderPath = join(__dirname, "..", "biosOpenSource");

const exitOnResponseCodeError = () => {
  process.exit(1);
};

const downloadBios = (url: string, fileToCheck: string) => {
  if (!existsSync(fileToCheck)) {
    downloadFile(
      url,
      fileToCheck,
      () => {},
      () => {
        exitOnResponseCodeError();
      },
    );
  }
};

const getTempFolderPath = (name: string) => join(biosFolderPath, "temp", name);

const copyFileAndRemoveTempFolder = (
  tempFolderPath: string,
  fileToCheck: string,
) => {
  copy(join(tempFolderPath, basename(fileToCheck)), fileToCheck);
  removeFile(tempFolderPath);
};

const downloadAndExtractBios = (url: string, subPath: string) => {
  const fileToCheck = join(biosFolderPath, basename(subPath));
  const tempFolderPath = getTempFolderPath("");

  if (!existsSync(fileToCheck)) {
    downloadAndExtract(
      url,
      tempFolderPath,
      fileToCheck,
      () => copyFileAndRemoveTempFolder(tempFolderPath, fileToCheck),
      exitOnResponseCodeError,
    );
  }
};

const downloadBiosOpenSource = () => {
  emulatorsBios.forEach(({ path, subPath }) => {
    if (subPath) {
      downloadAndExtractBios(path, subPath);
    } else {
      downloadBios(path, join(biosFolderPath, basename(path)));
    }
  });
};

downloadBiosOpenSource();
