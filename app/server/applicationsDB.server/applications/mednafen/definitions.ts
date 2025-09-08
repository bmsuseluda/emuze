import nodepath from "node:path";
import type { ApplicationId } from "../../applicationId.js";

export const applicationId: ApplicationId = "mednafen";
export const flatpakId = "com.github.AmatCoder.mednaffe";

export const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
export const bundledPathWindows = nodepath.join(applicationId, "mednafen.exe");
