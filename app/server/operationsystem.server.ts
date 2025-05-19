import {platform} from "os";

export const isWindows = () =>
  (process.env.EMUZE_IS_WINDOWS && process.env.EMUZE_IS_WINDOWS === "true") ||
  platform() === "win32";
