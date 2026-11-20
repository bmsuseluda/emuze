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
        log("debug", "rewind down");
        kimetra.keyDown("f4");
        // await kimetra.pressKey("f4", 10000);
      }
    }
  });

  gamepadManager.addButtonUpEvent("inGame", async (event, controller) => {
    if (isGameRunning() && controller.buttons.back) {
      log("debug", "buttons", event.button);
      const kimetra = Kimetra();

      // close game
      if (event.button === "south") {
        killChildProcess();
      }

      // game menu
      if (event.button === "north") {
        await kimetra.pressKey("f2");
      }

      // fast forward
      if (event.button === "east") {
        await kimetra.pressKey("f5");
      }

      // save state
      if (event.button === "leftShoulder") {
        await kimetra.pressKey("f1");
      }

      // load state
      if (event.button === "rightShoulder") {
        await kimetra.pressKey("f3");
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
