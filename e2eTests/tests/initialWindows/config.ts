import nodepath from "node:path";
import path from "node:path";
import {TestName} from "../ports.js";

import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const configFolderPath = nodepath.join(__dirname, "emptyWindowsConfig");

export const e2ePath = nodepath.join(__dirname, "..", "..");
export const testName: TestName = "initialWindows";
