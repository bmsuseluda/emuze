import { configFolderPath, testName } from "./config.js";
import { startRemix } from "../start.js";

process.env.EMUZE_CONFIG_PATH = configFolderPath;

startRemix(testName);
