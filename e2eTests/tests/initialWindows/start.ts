import { configFolderPath, testName } from "./config.js";
import { startReactRouter } from "../start.js";

process.env.EMUZE_CONFIG_PATH = configFolderPath;
process.env.EMUZE_IS_WINDOWS = "true";

startReactRouter(testName);
