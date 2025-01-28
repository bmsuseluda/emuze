import { execFileSync } from "child_process";
import { log } from "../debug.server";

export class EmulatorNotInstalledError extends Error {
  constructor(emulatorName: string) {
    super(`The Emulator ${emulatorName} is not installed.`);
  }
}

let flatpakAppList: string | null = null;

export const updateFlatpakAppList = () => {
  log("debug", "Update flatpak app list");
  flatpakAppList = execFileSync("flatpak", ["list", "--app"], {
    encoding: "utf8",
  }).toString();
};

export const checkFlatpakIsInstalled = (flatpakId: string): boolean => {
  try {
    if (!flatpakAppList) {
      updateFlatpakAppList();
    }
    return !!flatpakAppList && flatpakAppList.includes(flatpakId);
  } catch (error) {
    console.error("Error checking Flatpak installation:", error);
    return false;
  }
};
