import { readFileSync } from "node:fs";
import { platform } from "node:os";
import { log } from "./debug.server.js";

export const isWindows = () =>
  (process.env.EMUZE_IS_WINDOWS && process.env.EMUZE_IS_WINDOWS === "true") ||
  platform() === "win32";

export const isSteamOs = () => {
  if (platform() === "linux") {
    try {
      const osRelease = readFileSync("/etc/os-release", "utf8");
      return osRelease.toLowerCase().includes("steamos");
    } catch (error) {
      log("debug", "isSteamOs", "/etc/os-release could not be found", error);
      return false;
    }
  }

  return false;
};
