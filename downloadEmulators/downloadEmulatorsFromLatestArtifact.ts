import { cpSync, mkdirSync } from "node:fs";
import _7z from "7zip-min";
import { isWindows } from "../app/server/operationsystem.server.js";
import { downloadFile } from "./utils/downloadFile.js";
import { executeWithLogs } from "./utils/executeWithLogs.js";
import { join } from "node:path";
import { makeFileExecutableLinux } from "./utils/makeFileExecutableLinux.js";
import { removeSync } from "fs-extra/esm";

const __dirname = import.meta.dirname;
const projectPath = join(__dirname, "..");

export const latestEmulatorsPath = join(projectPath, "latestEmulators");

// TODO: How to get it automatically
const getLatestReleaseId = () => "0.59.0";

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
              cpSync(
                join(artifactExtractedPath, "emulators"),
                latestEmulatorsPath,
                {
                  recursive: true,
                  force: true,
                  preserveTimestamps: true,
                },
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

const getEmulatorsFromLatestArtifactLinux = (latestReleaseId: string) => {
  const latestArtifactLinux = `https://github.com/bmsuseluda/emuze/releases/download/v${latestReleaseId}/emuze-${latestReleaseId}.AppImage`;
  const outputFilePath = join(
    latestEmulatorsPath,
    latestArtifactLinux.split("/").at(-1) || "",
  );

  downloadFile(latestArtifactLinux, outputFilePath, () => {
    makeFileExecutableLinux(outputFilePath);
    const output = executeWithLogs(
      outputFilePath,
      ["--appimage-extract"],
      latestEmulatorsPath,
    );
    console.log(output);

    const squashfsPath = join(latestEmulatorsPath, "squashfs-root");

    cpSync(join(squashfsPath, "emulators"), latestEmulatorsPath, {
      recursive: true,
      force: true,
      preserveTimestamps: true,
    });

    removeSync(squashfsPath);
    removeSync(outputFilePath);
  });
};

export const getEmulatorsFromLatestArtifact = () => {
  // if (!existsSync(latestEmulatorsPath)) {
  mkdirSync(latestEmulatorsPath, { recursive: true });
  const latestReleaseId = getLatestReleaseId();

  if (isWindows()) {
    getEmulatorsFromLatestArtifactWindows(latestReleaseId);
  } else {
    getEmulatorsFromLatestArtifactLinux(latestReleaseId);
  }
  // }
};
