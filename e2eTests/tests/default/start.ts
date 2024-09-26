import { configFolderPath, e2ePath, testName } from "./config";
import nodepath from "path";
import { startRemix } from "../start";

process.env.EMUZE_CONFIG_PATH = configFolderPath;
process.env.EMUZE_TEST_ROMS_PATH = nodepath.join(e2ePath, "testRoms");

startRemix(testName);
