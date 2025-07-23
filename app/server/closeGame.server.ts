import kill from "tree-kill";
import { log } from "./debug.server.js";
import { importElectron } from "./importElectron.server.js";
import { gamepadManager } from "./gamepadManager.server/index.js";
import {
  gameIsRunningChildProcess,
  isGameRunning,
} from "./gameIsRunning.server.js";

const killChildProcess = () => {
  log("debug", "kill process");

  if (isGameRunning() && gameIsRunningChildProcess?.pid) {
    kill(gameIsRunningChildProcess.pid, "SIGINT", (err) => {
      if (err) {
        log("error", "Failed to kill process:", err);
      }
    });
  }
};

const registerCloseGameOnGamepadEvent = () => {
  gamepadManager.addButtonUpEvent("closeGame", (event, controller) => {
    if (isGameRunning() && event.button === "a" && controller.buttons.back) {
      log("debug", "buttons", controller.buttons);
      killChildProcess();
    }
  });
};

registerCloseGameOnGamepadEvent();

export const registerCloseGameOnKeyboardEvent = () => {
  const electron = importElectron();

  electron?.globalShortcut?.register("CommandOrControl+C", () => {
    killChildProcess();
  });
};

export const unregisterCloseGameOnKeyboardEvent = () => {
  const electron = importElectron();
  electron?.globalShortcut?.unregister("CommandOrControl+C");
};
