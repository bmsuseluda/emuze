import electron from "electron";
import nodepath from "path";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { homeDirectory } from "./homeDirectory.server";
import { commandLineOptions } from "./commandLine.server";

export const isDebug = () =>
  electron?.app?.commandLine.hasSwitch(commandLineOptions.debugEmuze.id) ||
  process.env.EMUZE_DEBUG === "true";

const logFileName = "emuze.log";

export const appendFile = (text: string, path: string) => {
  // TODO: add success message, validation ...
  const dirname = nodepath.dirname(path);
  if (!existsSync(dirname)) {
    mkdirSync(dirname, { recursive: true });
  }
  appendFileSync(path, text);
};

export const appendFileHome = (text: string, path: string) => {
  const pathInHome = nodepath.join(homeDirectory, path);
  appendFile(text, pathInHome);
};

export const createLogFile = () => {
  const path = nodepath.join(homeDirectory, logFileName);
  const dirname = nodepath.dirname(path);
  if (!existsSync(dirname)) {
    mkdirSync(dirname, { recursive: true });
  }
  writeFileSync(path, "");
};

const appendLogFile = (type: LogType, text: string | number | unknown) => {
  const timestamp = new Date().toLocaleString();
  appendFileHome(`${timestamp} - ${type} - ${text}\n`, logFileName);
};

type LogType = "error" | "debug" | "warning" | "info";

// TODO: use logger library?
// TODO: Check when the log file should be reseted
export const log = (
  type: LogType,
  ...texts: (object | string | number | unknown)[]
) => {
  if (isDebug()) {
    try {
      //   TODO: Check which file type would be best
      texts.forEach((text) => {
        if (typeof text === "object" && type !== "error") {
          appendLogFile(type, JSON.stringify(text));
        } else {
          appendLogFile(type, text);
        }
      });
      console.log(type, texts);
    } catch (e) {
      appendLogFile("error", "There was an unexpected error while logging");
    }
  }
};
