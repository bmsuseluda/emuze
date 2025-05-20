import nodepath from "node:path";
import { TestName } from "../ports.js";

import { fileURLToPath } from "node:url";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));

export const configFolderPath = nodepath.join(
  __dirname,
  "wrongEmulatorsPathWindowsConfig",
);
export const e2ePath = nodepath.join(__dirname, "..", "..");
export const testName: TestName = "wrongEmulatorsPath";
