import nodepath from "node:path";
import { homeDirectory } from "./homeDirectory.server.js";

export const logFileName = "emuze.log";
export const getLogFilePath = () => nodepath.join(homeDirectory, logFileName);
