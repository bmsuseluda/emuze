import nodepath from "path";
import { homedir } from "os";

export const homeDirectory = nodepath.join(
  process.env.EMUZE_CONFIG_PATH || homedir(),
  ".emuze",
);
