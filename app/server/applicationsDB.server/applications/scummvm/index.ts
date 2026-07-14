import nodepath from "node:path";

import { isWindows } from "../../../operationsystem.server.js";
import type { Application } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const applicationId: ApplicationId = "scummvm";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "scummvm.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

export const scummvm: Application = {
  id: applicationId,
  name: "ScummVM",
  entryAsDirectory: true,
  omitAbsoluteEntryPathAsLastParam: true,
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push(`--path=${absoluteEntryPath}`);
    optionParams.push("--auto-detect");
    return optionParams;
  },
  bundledPath,
};
