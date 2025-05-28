import type { ChildProcess } from "node:child_process";
import kill from "tree-kill";
import type { SdlType } from "../types/sdl.js";
import { log } from "./debug.server.js";
import { importElectron } from "./importElectron.server.js";

const killChildProcess = (childProcess: ChildProcess) => {
  log("debug", "kill process");

  if (childProcess.pid) {
    kill(childProcess.pid, "SIGKILL", (err) => {
      if (err) {
        log("error", "Failed to kill process:", err);
      }
    });
  }
};

const closeGameOnGamepad = (childProcess: ChildProcess, sdl: SdlType) => {
  const devices = sdl.controller.devices;
  if (devices.length > 0) {
    devices.forEach((device) => {
      const controller = sdl.controller.openDevice(device);
      controller.on("buttonDown", (event) => {
        if (event.button === "a" && controller.buttons.back) {
          log("debug", "buttons", controller.buttons);
          if (childProcess && !childProcess.killed) {
            killChildProcess(childProcess);
          }
        }
      });
    });
  }
};

const closeGameOnKeyboard = (childProcess: ChildProcess) => {
  const electron = importElectron();

  electron?.globalShortcut?.register("CommandOrControl+C", () => {
    killChildProcess(childProcess);
  });
};

export const registerCloseGameEvent = (
  childProcess: ChildProcess,
  sdl: SdlType,
) => {
  closeGameOnKeyboard(childProcess);
  closeGameOnGamepad(childProcess, sdl);
};

export const unregisterCloseGameEvent = (sdl: SdlType) => {
  const electron = importElectron();
  electron?.globalShortcut?.unregister("CommandOrControl+C");
  // @ts-ignore types are missing
  // TODO: create pull request to @kmamal/sdl
  sdl.controller.removeAllListeners("buttonDown");
};
