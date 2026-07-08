import nodepath from "node:path";
import { isWindows } from "../../../operationsystem.server.js";
import { log } from "../../../debug.server.js";
import { spawnSync } from "node:child_process";
import sdl from "@kmamal/sdl";

import {
  steamInputHandleFromHid,
  EmuzeController,
  getControllers,
} from "../../../gamepad.server.js";
import { isXinputController } from "../../../../types/gamepad.js";
import { bundledPath } from "./definitions.js";
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

export const getGamepads = (): MednafenGamepadID[] => {
  if (sdl.controller.devices.length > 0) {
    try {
      const output = executeWithLogs(
        nodepath.join(bundledEmulatorsPathBase, bundledPath),
        ["wrong"],
      );
      log("debug", "result", output);
      return extractGamepadIDs(output);
    } catch (e) {
      log("debug", "result in catch", e);
    }
  }
  return [];
};

const getAlternativeNames = (controller: EmuzeController): string[] => {
  if (isWindows() && isXinputController(controller.type)) {
    return ["xinput"];
  }

  return [];
};

export interface MappedGamepad {
  emuzeController: EmuzeController;
  mednafenGamepadId: MednafenGamepadID;
}

const sortMednafenGamepadIDs = (a: MednafenGamepadID, b: MednafenGamepadID) => {
  if (
    a.name.startsWith(steamInputHandleFromHid) &&
    b.name.startsWith(steamInputHandleFromHid)
  ) {
    if (a.name.charAt(-1) < b.name.charAt(-1)) {
      return -1;
    }
    return 1;
  }

  if (
    a.name.startsWith(steamInputHandleFromHid) &&
    !b.name.startsWith(steamInputHandleFromHid)
  ) {
    return -1;
  }

  return 1;
};

export const getMappedGamepads = (
  mednafenGamepadIds: MednafenGamepadID[],
): MappedGamepad[] => {
  const mappedGamepads: MappedGamepad[] = [];
  const emuzeControllers = [...getControllers()];
  mednafenGamepadIds.sort(sortMednafenGamepadIDs);

  mednafenGamepadIds.forEach((mednafenGamepadId) => {
    const mappedGamepad = getMappedGamepad(mednafenGamepadId, emuzeControllers);
    if (mappedGamepad) {
      mappedGamepads.push(mappedGamepad);
    }
  });

  return mappedGamepads;
};

export const getMappedGamepad = (
  mednafenGamepadId: MednafenGamepadID,
  gamepads: EmuzeController[],
): MappedGamepad | null => {
  log(
    "debug",
    "findSdlGamepad",
    `mednafen gamepadId: ${mednafenGamepadId.id}`,
    `mednafen gamepadName: ${mednafenGamepadId.name}`,
  );

  const sdlControllerIndex = gamepads.findIndex((gamepad) => {
    const { hidName, joystickName, name, hasSteamHandle } = gamepad;
    const nameFromHid = hidName || "";
    const alternativeNames = getAlternativeNames(gamepad);

    log(
      "debug",
      "findSdlGamepad filter",
      `hid: ${nameFromHid}`,
      `joystick: ${joystickName}`,
      `controller: ${name}`,
      `steamHandle: ${hasSteamHandle}`,
    );

    return !![...alternativeNames, nameFromHid, joystickName, name].find(
      (name) =>
        name &&
        mednafenGamepadId.name
          .toLowerCase()
          .replaceAll(" ", "")
          .startsWith(name.toLowerCase().replaceAll(" ", "")),
    );
  });

  if (sdlControllerIndex >= 0) {
    const emuzeController = gamepads[sdlControllerIndex];
    gamepads.splice(sdlControllerIndex, 1);
    return { mednafenGamepadId, emuzeController };
  }

  return null;
};
