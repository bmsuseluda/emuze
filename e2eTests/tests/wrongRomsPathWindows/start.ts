import { configFolderPath, e2ePath, testName } from "./config.js";
import nodepath from "node:path";
import { startRemix } from "../start.js";

process.env.EMUZE_CONFIG_PATH = configFolderPath;
process.env.EMUZE_TEST_ROMS_PATH = "This path does not exist";
process.env.EMUZE_TEST_EMULATORS_PATH = nodepath.join(e2ePath, "testEmulators");
process.env.EMUZE_IS_WINDOWS = "true";

startRemix(testName);
