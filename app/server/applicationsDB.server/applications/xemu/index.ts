import nodepath from "node:path";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";

const flatpakId = "app.xemu.xemu";
const applicationId: ApplicationId = "xemu";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "xemu.exe");

export const xemu: Application = {
  id: applicationId,
  name: "xemu",
  fileExtensions: [".iso"],
  flatpakId,
  omitAbsoluteEntryPathAsLastParam: true,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-full-screen");
    }
    optionParams.push(`-dvd_path ${absoluteEntryPath}`);
    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};
