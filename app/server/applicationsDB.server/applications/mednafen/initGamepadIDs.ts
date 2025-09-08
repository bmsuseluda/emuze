import nodepath from "node:path";
import { isWindows } from "../../../operationsystem.server.js";
import { log } from "../../../debug.server.js";
import { spawnSync } from "node:child_process";
import sdl from "@kmamal/sdl";
import type { Sdl } from "@kmamal/sdl";

import { getJoystickFromController } from "../../../gamepad.server.js";
import { getDeviceNameFromHid } from "../../../getDeviceNameFromHid.js";
import {
  getPlayerIndexArray,
  isSteamDeckController,
} from "../../../../types/gamepad.js";
import { bundledPathLinux, bundledPathWindows } from "./definitions.js";

export interface MednafenGamepadID {
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
export const extractGamepadIDs = (logOutput: string): MednafenGamepadID[] =>
  logOutput
    .split("\n")
    .filter((line) => {
      return line.replace("'", "").trim().startsWith("ID: ");
    })
    .map((line): MednafenGamepadID => {
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

export const getGamepads = (): MednafenGamepadID[] => {
  if (sdl.controller.devices.length > 0) {
    const bundledPathBase = nodepath.join(
      process.env.APPDIR || "",
      "emulators",
    );
    const bundledPath = nodepath.join(
      bundledPathBase,
      isWindows() ? bundledPathWindows : bundledPathLinux,
    );
    try {
      const output = executeWithLogs(nodepath.join(bundledPath), ["wrong"]);
      log("debug", "result", output);
      return extractGamepadIDs(output);
    } catch (e) {
      log("debug", "result in catch", e);
    }
  }
  return [];
};

const getAlternativeNames = (joystick: Sdl.Joystick.Device): string[] => {
  if (isSteamDeckController(joystick)) {
    return ["Microsoft X-Box 360 pad"];
  }

  return [];
};

export interface MappedGamepad {
  sdlController: Sdl.Controller.Device;
  mednafenGamepadId: MednafenGamepadID;
}

export interface MappedGamepadWithPlayerIndex extends MappedGamepad {
  playerIndex: number;
}

export const getMappedGamepads = (
  mednafenGamepadIds: MednafenGamepadID[],
): MappedGamepadWithPlayerIndex[] => {
  const mappedGamepads: MappedGamepad[] = [];

  mednafenGamepadIds.forEach((mednafenGamepadId) => {
    const mappedGamepad = getMappedGamepad(mednafenGamepadId);
    if (mappedGamepad) {
      mappedGamepads.push(mappedGamepad);
    }
  });

  const mappedJoysticks = mappedGamepads.map(
    ({ sdlController }) => getJoystickFromController(sdlController)!,
  );
  const playerIndexArray = getPlayerIndexArray(mappedJoysticks);

  const mappedGamepadsWithPlayerIndex =
    mappedGamepads.map<MappedGamepadWithPlayerIndex>(
      (mappedGamepad, index) => ({
        ...mappedGamepad,
        playerIndex: playerIndexArray[index],
      }),
    );

  return mappedGamepadsWithPlayerIndex;
};

/**
 *
 * steam deck 1
 * steam deck 2
 * wireless controller
 */
export const getMappedGamepad = (
  mednafenGamepadId: MednafenGamepadID,
): MappedGamepad | null => {
  const gamepads = sdl.controller.devices;

  log(
    "debug",
    "findSdlGamepad",
    `mednafen gamepadId: ${mednafenGamepadId.id}`,
    `mednafen gamepadName: ${mednafenGamepadId.name}`,
  );

  const sdlControllers = gamepads.filter((gamepad) => {
    const joystick = getJoystickFromController(gamepad)!;
    const nameFromHid = getDeviceNameFromHid(joystick) || "";
    const alternativeNames = getAlternativeNames(joystick);

    log(
      "debug",
      "findSdlGamepad filter",
      `hid: ${nameFromHid}`,
      `joystick: ${joystick.name}`,
      `controller: ${gamepad.name}`,
    );

    return !![
      ...alternativeNames,
      nameFromHid,
      joystick.name,
      gamepad.name,
    ].find(
      (name) =>
        name &&
        mednafenGamepadId.name
          .toLowerCase()
          .replaceAll(" ", "")
          .startsWith(name.toLowerCase().replaceAll(" ", "")),
    );
  });

  const sdlController = sdlControllers.at(mednafenGamepadId.nameIndex);

  if (sdlController) {
    return { mednafenGamepadId, sdlController };
  }

  return null;
};
