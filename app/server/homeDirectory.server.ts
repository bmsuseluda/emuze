import nodepath from "node:path";
import { envPaths } from "./envPaths.server.js";

const { data } = envPaths("emuze", { suffix: "" });

export const homeDirectory = process.env.EMUZE_CONFIG_PATH
  ? nodepath.join(process.env.EMUZE_CONFIG_PATH, ".emuze")
  : data;

export const emulatorsConfigDirectory = nodepath.join(
  homeDirectory,
  "emulators",
);
