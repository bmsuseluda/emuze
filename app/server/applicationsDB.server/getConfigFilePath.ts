import { spawnSync } from "child_process";
import { homedir } from "os";

/**
 * look into application folder for config file, if not then home folder
 */
export const getWindowsConfigFilePath = (configFileName: string) => {
  // TODO: implement
  return homedir();
};

export const getFlatpakConfigPath = (flatpakId: string) =>
  spawnSync("flatpak", [
    "run",
    "--command=bash",
    flatpakId,
    "-c",
    "echo $XDG_CONFIG_HOME",
  ])
    .stdout.toString()
    .trim();

export const getFlatpakDataPath = (flatpakId: string) =>
  spawnSync("flatpak", [
    "run",
    "--command=bash",
    flatpakId,
    "-c",
    "echo $XDG_DATA_HOME",
  ])
    .stdout.toString()
    .trim();
