import { isWindows } from "../../../operationsystem.server";
import { execFileSync } from "child_process";
import { log } from "../../../debug.server";
import sdl from "@bmsuseluda/node-sdl";
import { checkFlatpakIsInstalled } from "../../checkEmulatorIsInstalled";
import { flatpakId, flatpakOptionParams } from "./definitions";

interface MednafenError {
  stdout: string;
}

const isMednafenError = (e: any): e is MednafenError =>
  typeof e.stdout === "string";

export interface GamepadID {
  id: string;
  name: string;
}

const extractGamepadIDs = (error: MednafenError): GamepadID[] =>
  error.stdout
    .split("\n")
    .filter((line) => line.trim().startsWith("ID: "))
    .map((line) => {
      const [id, name] = line.trim().split("ID: ")[1].split(" - ");
      return {
        id,
        name,
      };
    });

export const getGamepads = (applicationPath?: string) => {
  if (sdl.controller.devices.length > 0) {
    try {
      if (isWindows() && applicationPath) {
        execFileSync(applicationPath, ["wrong"], {
          encoding: "utf8",
        });
      } else {
        if (checkFlatpakIsInstalled(flatpakId)) {
          execFileSync(
            "flatpak",
            ["run", ...flatpakOptionParams, flatpakId, "wrong"],
            {
              encoding: "utf8",
            },
          );
        }
      }
    } catch (e) {
      if (isMednafenError(e)) {
        const gamepadsIDs = extractGamepadIDs(e);
        log("debug", "mednafen gamepad IDs", gamepadsIDs);
        return gamepadsIDs;
      }
    }
  }
  return [];
};

export const findSdlGamepad = (gamepadId: GamepadID, index: number) => {
  const gamepads = sdl.controller.devices;

  const sdlGamepad = gamepads.find((gamepad) => {
    const openedDevice = sdl.controller.openDevice(gamepad);
    log("debug", "findSdlGamepad", gamepadId, gamepad, openedDevice);

    return (
      gamepad.name.toLowerCase().replaceAll(" ", "") ===
        gamepadId.name.toLowerCase().replaceAll(" ", "") ||
      openedDevice.controllerName.toLowerCase().replaceAll(" ", "") ===
        gamepadId.name.toLowerCase().replaceAll(" ", "")
    );
  });

  return sdlGamepad || gamepads.at(index);
};
