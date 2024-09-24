import { configFolderPath, testName } from "./config";
import { startRemix } from "../start";

process.env.EMUZE_CONFIG_PATH = configFolderPath;
process.env.EMUZE_IS_WINDOWS = "true";

startRemix(testName);
