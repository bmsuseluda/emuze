import { isWindows } from "../../../operationsystem.server.js";
import { log } from "../../../debug.server.js";
import { spawnSync } from "node:child_process";
import sdl from "@kmamal/sdl";

import { checkFlatpakIsInstalled } from "../../checkEmulatorIsInstalled.js";
import { flatpakId, flatpakOptionParams } from "./definitions.js";
import { getJoystickFromController } from "../../../gamepad.server.js";
import { getDeviceNameFromHid } from "../../../getDeviceNameFromHid.js";

export interface GamepadID {
  id: string;
  name: string;
  nameIndex: number;
}

/**
 * ID: 0x0005045e02e009030008000a00000000 - 8BitDo Pro 2
 *
 * @param logOutput
 * @returns
 */
export const extractGamepadIDs = (logOutput: string): GamepadID[] =>
  logOutput
    .split("\n")
    .filter((line) => {
      return line.replace("'", "").trim().startsWith("ID: ");
    })
    .map((line): GamepadID => {
      const [id, name] = line
        .replace("'", "")
        .trim()
        .split("ID: ")[1]
        .split(" - ");
      log("debug", "extractGamepadIDs", id, name, line);
      return {
        id,
        name,
        nameIndex: Number(id.at(-1)) || 0,
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

// TODO: check if hid works for steam input as well
export const findSdlGamepad = (gamepadId: GamepadID, index: number) => {
  const gamepads = sdl.controller.devices;

  const sdlGamepads = gamepads.filter((gamepad) => {
    const joystick = getJoystickFromController(gamepad)!;
    const nameFromHid = getDeviceNameFromHid(joystick) || "";
    log(
      "debug",
      "findSdlGamepad",
      `mednafen gamepadId: ${gamepadId.id}`,
      `mednafen gamepadName: ${gamepadId.name}`,
      `hid: ${nameFromHid}`,
      `joystick: ${joystick.name}`,
      `controller: ${gamepad.name}`,
    );

    return !![nameFromHid, joystick.name, gamepad.name].find(
      (name) =>
        name &&
        gamepadId.name
          .toLowerCase()
          .replaceAll(" ", "")
          .startsWith(name.toLowerCase().replaceAll(" ", "")),
    );
  });

  const sdlGamepad =
    sdlGamepads.at(gamepadId.nameIndex) ||
    sdlGamepads.at(0) ||
    gamepads.at(index);

  return sdlGamepad;
};
