import nodepath from "node:path";
import { execFileSync } from "child_process";

import { fileURLToPath } from "node:url";
import {
  readFilenames,
  removeFile,
} from "../app/server/readWriteData.server.js";
import { writeFileSync } from "node:fs";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));
const distFolderPath = nodepath.join(__dirname, "..", "dist");

const extractAppImage = (appImagePath: string) => {
  console.log("extract appImage", appImagePath);
  execFileSync(appImagePath, ["--appimage-extract"], {
    stdio: "inherit",
    encoding: "utf8",
    cwd: nodepath.dirname(appImagePath),
  });
  console.log("extract appImage successfull", appImagePath);
};

const wrapperScript = `#!/bin/sh

HERE=$(cd "\${0%/*}" && echo "$PWD")
export APPIMAGE=$(readlink -f "$0")
export ARGV0=$0

if [ -f "$HERE"/AppDir/AppRun ]; then
  export APPDIR="$HERE"/AppDir
  export SHARUN_DIR="$HERE"/AppDir
  exec "$HERE"/AppDir/AppRun "$@"
else
  export APPDIR="$HERE"/AppDir/squashfs-root
  export SHARUN_DIR="$HERE"/AppDir/squashfs-root
  exec "$HERE"/squashfs-root/AppRun "$@"
fi`;

const createWrapperScript = (appImagePath: string) => {
  writeFileSync(appImagePath, wrapperScript, { mode: 0o755 });
};

const shrinkEmulatorSize = (appImagePath: string) => {
  extractAppImage(appImagePath);
  removeFile(appImagePath);
  createWrapperScript(appImagePath);
};

const shrinkBundleSize = () => {
  const emulatorsPath = nodepath.join(
    distFolderPath,
    "linux-unpacked",
    "emulators",
  );

  readFilenames({ path: emulatorsPath, fileExtensions: [".AppImage"] }).forEach(
    shrinkEmulatorSize,
  );
};

shrinkBundleSize();
