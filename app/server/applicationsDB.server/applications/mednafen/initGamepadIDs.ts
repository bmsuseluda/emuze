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
  isXinputController,
} from "../../../../types/gamepad.js";
import { bundledPathLinux, bundledPathWindows } from "./definitions.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";

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

export const isSteamHandle = (
  controller: Sdl.Controller.Device,
): boolean | null => {
  try {
    return !!sdl.controller.openDevice(controller).steamHandle;
  } catch {
    return null;
  }
};

export const getGamepads = (): MednafenGamepadID[] => {
  if (sdl.controller.devices.length > 0) {
    const bundledPath = nodepath.join(
      bundledEmulatorsPathBase,
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

const steamInputHandle = "Microsoft X-Box 360 pad";

const getAlternativeNames = (
  controller: Sdl.Controller.Device,
  joystick: Sdl.Joystick.Device,
): string[] => {
  if (isSteamDeckController(joystick) || isSteamHandle(controller)) {
    return [steamInputHandle];
  }

  if (isWindows() && isXinputController(controller.type)) {
    return ["xinput"];
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

const sortMednafenGamepadIDs = (a: MednafenGamepadID, b: MednafenGamepadID) => {
  if (
    a.name.startsWith(steamInputHandle) &&
    b.name.startsWith(steamInputHandle)
  ) {
    if (a.name.charAt(-1) < b.name.charAt(-1)) {
      return -1;
    }
    return 1;
  }

  if (
    a.name.startsWith(steamInputHandle) &&
    !b.name.startsWith(steamInputHandle)
  ) {
    return -1;
  }

  return 1;
};

export const getMappedGamepads = (
  mednafenGamepadIds: MednafenGamepadID[],
): MappedGamepadWithPlayerIndex[] => {
  const mappedGamepads: MappedGamepad[] = [];
  const gamepadsSdl = [...sdl.controller.devices];
  mednafenGamepadIds.sort(sortMednafenGamepadIDs);

  mednafenGamepadIds.forEach((mednafenGamepadId) => {
    const mappedGamepad = getMappedGamepad(mednafenGamepadId, gamepadsSdl);
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

export const getMappedGamepad = (
  mednafenGamepadId: MednafenGamepadID,
  gamepads: Sdl.Controller.Device[],
): MappedGamepad | null => {
  log(
    "debug",
    "findSdlGamepad",
    `mednafen gamepadId: ${mednafenGamepadId.id}`,
    `mednafen gamepadName: ${mednafenGamepadId.name}`,
  );

  const sdlControllerIndex = gamepads.findIndex((gamepad) => {
    const joystick = getJoystickFromController(gamepad)!;
    const nameFromHid = getDeviceNameFromHid(joystick) || "";
    const alternativeNames = getAlternativeNames(gamepad, joystick);

    log(
      "debug",
      "findSdlGamepad filter",
      `hid: ${nameFromHid}`,
      `joystick: ${joystick.name}`,
      `controller: ${gamepad.name}`,
      `steamHandle: ${isSteamHandle(gamepad)}`,
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

  if (sdlControllerIndex >= 0) {
    const sdlController = gamepads[sdlControllerIndex];
    gamepads.splice(sdlControllerIndex, 1);
    return { mednafenGamepadId, sdlController };
  }

  return null;
};
