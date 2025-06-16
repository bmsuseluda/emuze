import type { ChildProcess } from "node:child_process";
import kill from "tree-kill";
import { log } from "./debug.server.js";
import { importElectron } from "./importElectron.server.js";
import type { Sdl } from "@kmamal/sdl";
import type { SdlType } from "../types/gamepad.js";

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

let gamepads: Sdl.Controller.ControllerInstance[] = [];

const closeGameOnGamepad = (childProcess: ChildProcess, sdl: SdlType) => {
  const devices = sdl.controller.devices;
  if (devices.length > 0) {
    gamepads = [];
    devices.forEach((device) => {
      const controller = sdl.controller.openDevice(device);
      gamepads.push(controller);
      controller.on("buttonUp", (event) => {
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

export const unregisterCloseGameEvent = () => {
  const electron = importElectron();
  electron?.globalShortcut?.unregister("CommandOrControl+C");

  log("debug", "close gamepads");
  gamepads.forEach((gamepad) => {
    gamepad.close();
  });
};
