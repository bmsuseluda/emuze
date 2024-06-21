import { app } from "electron";
import { homeDirectory } from "./readWriteData.server";
import nodepath from "path";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";

export const isDebug = () =>
  app?.commandLine.hasSwitch("debugEmuze") ||
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
    //   TODO: Check which file type would be best
    texts.forEach((text) => {
      if (typeof text === "object") {
        appendLogFile(type, JSON.stringify(text));
      } else {
        appendLogFile(type, text);
      }
    });
    console.log(type, texts);
  }
};
