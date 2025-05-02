import nodepath from "path";
import envPaths from "env-paths";

const { data } = envPaths("emuze", { suffix: "" });

export const homeDirectory = process.env.EMUZE_CONFIG_PATH
  ? nodepath.join(process.env.EMUZE_CONFIG_PATH, ".emuze")
  : data;

export const emulatorsDirectory = nodepath.join(homeDirectory, "emulators");
