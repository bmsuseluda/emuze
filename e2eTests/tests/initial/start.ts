import { configFolderPath, testName } from "./config";
import { startRemix } from "../start";

process.env.EMUZE_CONFIG_PATH = configFolderPath;

startRemix(testName);
