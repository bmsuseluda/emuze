import { cpSync, existsSync, mkdirSync } from "node:fs";
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

const getLatestReleaseId = async (): Promise<string> => {
  const response = await fetch(
    "https://github.com/bmsuseluda/emuze/releases/latest",
    {
      method: "HEAD",
      redirect: "manual",
    },
  );

  const location = response.headers.get("location");
  const tagMatch = location?.match(/\/releases\/tag\/v?([^/?#]+)/);

  if (!tagMatch?.[1]) {
    throw new Error(
      `Failed to determine the latest release ID from GitHub. (Status: ${response.status}, Location: ${location})`,
    );
  }

  return tagMatch[1];
};

const getEmulatorsFromLatestArtifactWindows = (
  latestReleaseId: string,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const latestArtifactWindows = `https://github.com/bmsuseluda/emuze/releases/download/v${latestReleaseId}/emuze-Setup-${latestReleaseId}.exe`;
    const outputFilePath = join(
      latestEmulatorsPath,
      latestArtifactWindows.split("/").at(-1) || "",
    );

    downloadFile(
      latestArtifactWindows,
      outputFilePath,
      () => {
        const artifactExtractedPath = join(
          latestEmulatorsPath,
          "artifactExtracted",
        );
        _7z.unpack(outputFilePath, artifactExtractedPath, (error) => {
          if (!error) {
            try {
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
              resolve();
            } catch (err) {
              console.error(err);
              reject(err);
            }
          } else {
            console.error(error);
            reject(error);
            process.exit(1);
          }
        });
      },
      () => {
        reject(new Error(`Failed to download ${latestArtifactWindows}`));
      },
    );
  });

const getEmulatorsFromLatestArtifactLinux = (
  latestReleaseId: string,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const latestArtifactLinux = `https://github.com/bmsuseluda/emuze/releases/download/v${latestReleaseId}/emuze-${latestReleaseId}.AppImage`;
    const outputFilePath = join(
      latestEmulatorsPath,
      latestArtifactLinux.split("/").at(-1) || "",
    );

    downloadFile(
      latestArtifactLinux,
      outputFilePath,
      () => {
        try {
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
          resolve();
        } catch (err) {
          console.error(err);
          reject(err);
        }
      },
      () => {
        reject(new Error(`Failed to download ${latestArtifactLinux}`));
      },
    );
  });

export const getEmulatorsFromLatestArtifact = async () => {
  if (!existsSync(latestEmulatorsPath)) {
    mkdirSync(latestEmulatorsPath, { recursive: true });
    const latestReleaseId = await getLatestReleaseId();

    if (isWindows()) {
      await getEmulatorsFromLatestArtifactWindows(latestReleaseId);
    } else {
      await getEmulatorsFromLatestArtifactLinux(latestReleaseId);
    }
  }
};
