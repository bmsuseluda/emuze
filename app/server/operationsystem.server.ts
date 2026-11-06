import { readFileSync } from "node:fs";
import { platform } from "node:os";
import { log } from "./debug.server.js";

export const EMUZE_IS_WINDOWS = "EMUZE_IS_WINDOWS";
export const EMUZE_IS_MAC = "EMUZE_IS_MAC";
export const EMUZE_IS_LINUX = "EMUZE_IS_LINUX";

export const isWindows = () =>
  (process.env[EMUZE_IS_WINDOWS] && process.env[EMUZE_IS_WINDOWS] === "true") ||
  (platform() === "win32" &&
    process.env[EMUZE_IS_WINDOWS] !== "false" &&
    process.env[EMUZE_IS_MAC] !== "true" &&
    process.env[EMUZE_IS_LINUX] !== "true");

export const isMac = () =>
  (process.env[EMUZE_IS_MAC] && process.env[EMUZE_IS_MAC] === "true") ||
  (platform() === "darwin" &&
    process.env[EMUZE_IS_MAC] !== "false" &&
    process.env[EMUZE_IS_WINDOWS] !== "true" &&
    process.env[EMUZE_IS_LINUX] !== "true");

export const isLinux = () =>
  (process.env[EMUZE_IS_LINUX] && process.env[EMUZE_IS_LINUX] === "true") ||
  (platform() === "linux" &&
    process.env[EMUZE_IS_LINUX] !== "false" &&
    process.env[EMUZE_IS_WINDOWS] !== "true" &&
    process.env[EMUZE_IS_MAC] !== "true");

/**
 * linux is the default
 */
export const handleOperatingSystem = <T extends unknown>({
  windows,
  mac,
  linux,
}: {
  windows?: T;
  mac?: T;
  linux: T;
}) => {
  if (isWindows() && windows) {
    return windows;
  }

  if (isMac() && mac) {
    return mac;
  }

  return linux;
};

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

export const replaceToPosixPathing = (value: string) =>
  value.replace(/\\/g, "/");
