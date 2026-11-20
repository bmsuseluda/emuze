import kill from "tree-kill";
import { log } from "./debug.server.js";
import { importElectron } from "./importElectron.server.js";
import { gamepadManager } from "./gamepadManager.server/index.js";
import { Kimetra } from "kimetra";
import {
  gameIsRunningChildProcess,
  isGameRunning,
} from "./gameIsRunning.server.js";

const killChildProcess = () => {
  log("debug", "kill process");

  // signal needs to kill a process without an error message and settings done in the emulator need to be saved
  // https://man7.org/linux/man-pages/man7/signal.7.html
  if (isGameRunning() && gameIsRunningChildProcess?.pid) {
    kill(gameIsRunningChildProcess.pid, "SIGHUP" as NodeJS.Signals, (err) => {
      if (err) {
        log("error", "Failed to kill process:", err);
      }
    });
  }
};

// TODO: maybe move to another file
const registerCloseGameOnGamepadEvent = () => {
  gamepadManager.addButtonDownEvent("inGame", async (event, controller) => {
    if (isGameRunning() && controller.buttons.back) {
      const kimetra = Kimetra();

      // rewind
      if (event.button === "west") {
        kimetra.keyDown("f4");
      }

      // game menu
      if (event.button === "north") {
        kimetra.keyDown("f2");
      }

      // fast forward
      if (event.button === "east") {
        kimetra.keyDown("f5");
      }

      // save state
      if (event.button === "leftShoulder") {
        kimetra.keyDown("f1");
      }

      // load state
      if (event.button === "rightShoulder") {
        kimetra.keyDown("f3");
      }
    }
  });

  gamepadManager.addButtonUpEvent("inGame", (event, controller) => {
    if (isGameRunning() && controller.buttons.back) {
      log("debug", "buttons", event.button);
      const kimetra = Kimetra();

      // close game
      if (event.button === "south") {
        killChildProcess();
      }

      kimetra.cleanup();
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
