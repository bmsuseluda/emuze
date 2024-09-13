import { execFileSync } from "child_process";
import { log } from "../debug.server";

export class EmulatorNotInstalledError extends Error {
  constructor(emulatorName: string) {
    super(`The Emulator for ${emulatorName} is not installed`);
  }
}

let flatpakAppList: string | null = null;

export const updateFlatpakAppList = () => {
  log("info", "Update flatpak app list");
  flatpakAppList = execFileSync("flatpak", ["list", "--app"]).toString();
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
