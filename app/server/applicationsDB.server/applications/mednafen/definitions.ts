import nodepath from "node:path";
import type { ApplicationId } from "../../applicationId.js";
import { isWindows } from "../../../operationsystem.server.js";

export const applicationId: ApplicationId = "mednafen";
export const flatpakId = "com.github.AmatCoder.mednaffe";

export const bundledPath = isWindows()
  ? nodepath.join(applicationId, "mednafen.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);
