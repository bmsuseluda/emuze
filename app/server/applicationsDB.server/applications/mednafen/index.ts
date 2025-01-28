import type { Application, OptionParamFunction } from "../../types";
import { isWindows } from "../../../operationsystem.server";
import nodepath from "path";
import { log } from "../../../debug.server";
import { execFileSync } from "child_process";
import sdl from "@bmsuseluda/node-sdl";

const getSharedMednafenOptionParams: OptionParamFunction = () => {
  // save state F1
  const hotkeySave = ["-command.save_state", "keyboard 0x0 62"];
  // load state F3
  const hotkeyLoad = ["-command.load_state", "keyboard 0x0 64"];

  return [
    //   TODO: set fullscreen?
    //   TODO: set help
    ...hotkeySave,
    ...hotkeyLoad,
  ];
};

const findSdlGamepad = (gamepadId: GamepadID) => {
  const gamepads = sdl.controller.devices;

  const sdlGamepad = gamepads.find((gamepad) => {
    const openedDevice = sdl.controller.openDevice(gamepad);
    return (
      gamepad.name.toLowerCase() === gamepadId.name.toLowerCase() ||
      openedDevice.controllerName.toLowerCase() === gamepadId.name.toLowerCase()
    );
  });

  return sdlGamepad;
};

/**
 * 8bitdo pro 2
 * ;ss, Virtual Port 1, Digital Gamepad: A
 * ss.input.port1.gamepad.a joystick 0x0005045e02e009030008000a00000000 button_0
 *
 * ;ss, Virtual Port 1, Digital Gamepad: B
 * ss.input.port1.gamepad.b joystick 0x0005045e02e009030008000a00000000 button_1
 *
 * ;ss, Virtual Port 1, Digital Gamepad: C
 * ss.input.port1.gamepad.c joystick 0x0005045e02e009030008000a00000000 button_5
 *
 * ;ss, Virtual Port 1, Digital Gamepad: DOWN ↓
 * ss.input.port1.gamepad.down joystick 0x0005045e02e009030008000a00000000 abs_7+
 *
 * ;ss, Virtual Port 1, Digital Gamepad: LEFT ←
 * ss.input.port1.gamepad.left joystick 0x0005045e02e009030008000a00000000 abs_6-
 *
 * ;ss, Virtual Port 1, Digital Gamepad: Left Shoulder
 * ss.input.port1.gamepad.ls joystick 0x0005045e02e009030008000a00000000 button_4
 *
 * ;ss, Virtual Port 1, Digital Gamepad: RIGHT →
 * ss.input.port1.gamepad.right joystick 0x0005045e02e009030008000a00000000 abs_6+
 *
 * ;ss, Virtual Port 1, Digital Gamepad: Right Shoulder
 * ss.input.port1.gamepad.rs joystick 0x0005045e02e009030008000a00000000 abs_2+ || joystick 0x0005045e02e009030008000a00000000 abs_2- || joystick 0x0005045e02e009030008000a00000000 abs_2+
 *
 * ;ss, Virtual Port 1, Digital Gamepad: START
 * ss.input.port1.gamepad.start joystick 0x0005045e02e009030008000a00000000 button_7
 *
 * ;ss, Virtual Port 1, Digital Gamepad: UP ↑
 * ss.input.port1.gamepad.up joystick 0x0005045e02e009030008000a00000000 abs_7-
 *
 * ;ss, Virtual Port 1, Digital Gamepad: X
 * ss.input.port1.gamepad.x joystick 0x0005045e02e009030008000a00000000 button_2
 *
 * ;ss, Virtual Port 1, Digital Gamepad: Y
 * ss.input.port1.gamepad.y joystick 0x0005045e02e009030008000a00000000 button_3
 *
 * ;ss, Virtual Port 1, Digital Gamepad: Z
 * ss.input.port1.gamepad.z joystick 0x0005045e02e009030008000a00000000 abs_5-
 */
export const getVirtualGamepadSaturn = (
  gamepadID: GamepadID,
  index: number,
) => {
  const sdlGamepad = findSdlGamepad(gamepadID);
  log("debug", "gamepad", gamepadID, sdlGamepad);

  // TODO: lookup sdl mapping to know which button should be used and how, as axes or button

  return [
    ...[`-ss.input.port${index + 1}`, "gamepad"],
    ...[
      `-ss.input.port${index + 1}.gamepad.a`,
      `joystick ${gamepadID.id} button_0`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.b`,
      `joystick ${gamepadID.id} button_1`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.c`,
      `joystick ${gamepadID.id} abs_2-`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.x`,
      `joystick ${gamepadID.id} button_2`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.y`,
      `joystick ${gamepadID.id} button_3`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.z`,
      `joystick ${gamepadID.id} abs_5+`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.start`,
      `joystick ${gamepadID.id} button_7`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.up`,
      `joystick ${gamepadID.id} abs_7-`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.down`,
      `joystick ${gamepadID.id} abs_7+`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.left`,
      `joystick ${gamepadID.id} abs_6-`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.right`,
      `joystick ${gamepadID.id} abs_6+`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.ls`,
      `joystick ${gamepadID.id} button_4`,
    ],
    ...[
      `-ss.input.port${index + 1}.gamepad.rs`,
      `joystick ${gamepadID.id} button_5`,
    ],
  ];
};

interface MednafenError {
  stdout: string;
}

const isMednafenError = (e: any): e is MednafenError =>
  typeof e.stdout === "string";

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

interface GamepadID {
  id: string;
  name: string;
}

const getGamepads = (applicationPath?: string) => {
  try {
    if (isWindows() && applicationPath) {
      execFileSync(applicationPath, ["wrong"], {
        encoding: "utf8",
      });
    } else {
      execFileSync(
        "flatpak",
        ["run", "--command=mednafen", "com.github.AmatCoder.mednaffe", "wrong"],
        {
          encoding: "utf8",
        },
      );
    }
  } catch (e) {
    if (isMednafenError(e)) {
      const gamepadsIDs = extractGamepadIDs(e);
      log("debug", "mednafen gamepad IDs", gamepadsIDs);
      return gamepadsIDs;
    }
  }
  return [];
};

export const mednafen: Application = {
  id: "mednafen",
  name: "Mednafen",
  fileExtensions: [".cue", ".pce", ".nes", ".sms", ".gg"],
  flatpakId: "com.github.AmatCoder.mednaffe",
  flatpakOptionParams: ["--command=mednafen"],
  defineEnvironmentVariables: ({ applicationPath }) => {
    const environmentVariables = {};
    if (isWindows() && applicationPath) {
      return {
        ...environmentVariables,
        MEDNAFEN_HOME: nodepath.dirname(applicationPath),
      };
    }
    return environmentVariables;
  },
  createOptionParams: getSharedMednafenOptionParams,
};

export const mednafenSaturn: Application = {
  ...mednafen,
  id: "mednafenSaturn",
  createOptionParams: (props) => {
    const virtualGamepads = getGamepads().flatMap(getVirtualGamepadSaturn);
    return [...getSharedMednafenOptionParams(props), ...virtualGamepads];
  },
};

export const mednafenPcEngineCD: Application = {
  ...mednafen,
  id: "mednafenPcEngineCD",
};

export const mednafenPcEngineSuperGrafx: Application = {
  ...mednafen,
  id: "mednafenPcEngineSuperGrafx",
};
