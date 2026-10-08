import { existsSync, mkdirSync } from "node:fs";
import _7z from "7zip-min";
import { isWindows } from "../app/server/operationsystem.server.js";
import { downloadFile } from "./utils/downloadFile.js";
import { executeWithLogs } from "./utils/executeWithLogs.js";
import { join } from "node:path";
import { makeFileExecutableLinux } from "./utils/makeFileExecutableLinux.js";
import { moveSync, removeSync } from "fs-extra";

const __dirname = import.meta.dirname;
const projectPath = join(__dirname, "..");

export const latestEmulatorsPath = join(projectPath, "latestEmulators");

const getLatestReleaseId = () =>
  executeWithLogs("curl", [
    "-s",
    "https://api.github.com/repos/bmsuseluda/emuze/releases/latest",
    "|",
    "jq",
    "-r",
    "'.name'",
  ]).trimEnd();

const getEmulatorsFromLatestArtifactWindows = (latestReleaseId: string) => {
  const latestArtifactWindows = `https://github.com/bmsuseluda/emuze/releases/download/v${latestReleaseId}/emuze-Setup-${latestReleaseId}.exe`;
  const outputFilePath = join(
    latestEmulatorsPath,
    latestArtifactWindows.split("/").at(-1) || "",
  );

  downloadFile(latestArtifactWindows, outputFilePath, () => {
    const artifactExtractedPath = join(
      latestEmulatorsPath,
      "artifactExtracted",
    );
    _7z.unpack(outputFilePath, artifactExtractedPath, (error) => {
      if (!error) {
        _7z.unpack(
          join(artifactExtractedPath, "app-64.7z"),
          artifactExtractedPath,
          (error) => {
            if (!error) {
              moveSync(
                join(artifactExtractedPath, "emulators"),
                latestEmulatorsPath,
              );

              removeSync(outputFilePath);
              removeSync(artifactExtractedPath);
            }
          },
        );
      }
    });
  });
};

/**
 * TODO: exactly like the emulators folder the emulators from the latest release should be in latestEmulatorsPath
 * TODO: artifact and extracted folders are removed
 */
const getEmulatorsFromLatestArtifactLinux = (latestReleaseId: string) => {
  const latestArtifactLinux = `https://github.com/bmsuseluda/emuze/releases/download/v${latestReleaseId}/emuze-${latestReleaseId}.AppImage`;
  const outputFilePath = join(
    latestEmulatorsPath,
    latestArtifactLinux.split("/").at(-1) || "",
  );

  downloadFile(latestArtifactLinux, outputFilePath, () => {
    makeFileExecutableLinux(outputFilePath);
    executeWithLogs(outputFilePath, ["--appimage-extract"]);
  });
};

export const getEmulatorsFromLatestArtifact = () => {
  if (!existsSync(latestEmulatorsPath)) {
    mkdirSync(latestEmulatorsPath, { recursive: true });
    const latestReleaseId = getLatestReleaseId();

    if (isWindows()) {
      getEmulatorsFromLatestArtifactWindows(latestReleaseId);
    } else {
      getEmulatorsFromLatestArtifactLinux(latestReleaseId);
    }
  }
};
