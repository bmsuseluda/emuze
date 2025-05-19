import { configFolderPath, testName } from "./config.js";
import { startRemix } from "../start.js";

process.env.EMUZE_CONFIG_PATH = configFolderPath;
process.env.EMUZE_TEST_ROMS_PATH = "This path does not exist";

startRemix(testName);
