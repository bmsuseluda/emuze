import { chmodSync, renameSync, writeFileSync } from "node:fs";
import type { AfterPackContext } from "app-builder-lib";
import nodepath from "node:path";
import type { LinuxPackager } from "app-builder-lib/out/linuxPackager.js";

/**
 * Thanks to https://github.com/gergof/electron-builder-sandbox-fix for inspiration
 */
export default (context: AfterPackContext) => {
  if (context.electronPlatformName === "linux") {
    const executableName = (context.packager as LinuxPackager).executableName;
    const executable = nodepath.join(context.appOutDir, executableName);

    const loaderScript = `#!/usr/bin/env bash
set -u

SCRIPT_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
if [ "$SCRIPT_DIR" == "/usr/bin" ]; then
  SCRIPT_DIR="/opt/${context.packager.appInfo.productName}"
fi

if pgrep -x "steam" > /dev/null; then
  exec "$SCRIPT_DIR/${executableName}.bin" --no-sandbox "$@"
else
  exec "$SCRIPT_DIR/${executableName}.bin" "$@"
fi
`;

    renameSync(executable, executable + ".bin");
    writeFileSync(executable, loaderScript, "utf8");
    chmodSync(executable, 0o755);
  }
};
