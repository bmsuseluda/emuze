import { configFolderPath, testName } from "./config";
import { startRemix } from "../start";

process.env.EMUZE_CONFIG_PATH = configFolderPath;
process.env.EMUZE_TEST_ROMS_PATH = "This path does not exist";

startRemix(testName);
