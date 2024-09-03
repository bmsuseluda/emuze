import { execFileSync } from "child_process";

export class EmulatorNotInstalledError extends Error {
  constructor(emulatorName: string) {
    super(`The Emulator for ${emulatorName} is not installed`);
  }
}

export const checkFlatpakIsInstalled = (flatpakId: string) => {
  try {
    execFileSync("flatpak", ["info", flatpakId]);
    return true;
  } catch (error) {
    return false;
  }
};
