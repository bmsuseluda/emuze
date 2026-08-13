import nodepath from "node:path";
import type { TestName } from "../ports.js";

const __dirname = import.meta.dirname;

export const configFolderPath = nodepath.join(
  __dirname,
  "wrongRomsPathWindowsConfig",
);
export const e2ePath = nodepath.join(__dirname, "..", "..");
export const testName: TestName = "wrongRomsPathWindows";
