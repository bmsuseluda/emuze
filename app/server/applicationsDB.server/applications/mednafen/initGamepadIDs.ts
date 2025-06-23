import { isWindows } from "../../../operationsystem.server.js";
import { log } from "../../../debug.server.js";
import { spawnSync } from "node:child_process";
import sdl from "@kmamal/sdl";

import { checkFlatpakIsInstalled } from "../../checkEmulatorIsInstalled.js";
import { flatpakId, flatpakOptionParams } from "./definitions.js";

export interface GamepadID {
  id: string;
  name: string;
}

const extractGamepadIDs = (logOutput: string): GamepadID[] =>
  logOutput
    .split("\n")
    .filter((line) => {
      return line.replace("'", "").trim().startsWith("ID: ");
    })
    .map((line) => {
      const [id, name] = line
        .replace("'", "")
        .trim()
        .split("ID: ")[1]
        .split(" - ");
      log("debug", "extractGamepadIDs", id, name, line);
      return {
        id,
        name,
      };
    });

const executeWithLogs = (applicationPath: string, args: string[]): string => {
  const result = spawnSync(applicationPath, args, {
    stdio: ["inherit", "pipe", "inherit"],
    encoding: "utf8",
  });

  return result.stdout || "";
};

export const getGamepads = (applicationPath?: string) => {
  if (sdl.controller.devices.length > 0) {
    try {
      if (isWindows() && applicationPath) {
        const output = executeWithLogs(applicationPath, ["wrong"]);
        log("debug", "result", output);
        return extractGamepadIDs(output);
      } else {
        if (checkFlatpakIsInstalled(flatpakId)) {
          const output = executeWithLogs("flatpak", [
            "run",
            ...flatpakOptionParams,
            flatpakId,
            "wrong",
          ]);
          return extractGamepadIDs(output);
        }
      }
    } catch (e) {
      log("debug", "result in catch", e);
    }
  }
  return [];
};

export const findSdlGamepad = (gamepadId: GamepadID, index: number) => {
  const gamepads = sdl.controller.devices;
  const joysticks = sdl.joystick.devices;

  const sdlGamepad = gamepads.find((gamepad, index) => {
    const joystick = joysticks[index];
    log("debug", "findSdlGamepad", gamepadId, gamepad, joystick);

    return (
      gamepad.name.toLowerCase().replaceAll(" ", "") ===
        gamepadId.name.toLowerCase().replaceAll(" ", "") ||
      joystick.name.toLowerCase().replaceAll(" ", "") ===
        gamepadId.name.toLowerCase().replaceAll(" ", "")
    );
  });

  return sdlGamepad || gamepads.at(index);
};
