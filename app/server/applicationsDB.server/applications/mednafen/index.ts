import type { Application, OptionParamFunction } from "../../types";
import { isWindows } from "../../../operationsystem.server";
import nodepath from "path";
import { log } from "../../../debug.server";
import { execFileSync } from "child_process";

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
export const getVirtualGamepad = (gamepadID: string, index: number) => {
  log("debug", "gamepad", gamepadID);

  return [
    ...["-ss.input.port1", "gamepad"],
    ...["-ss.input.port1.gamepad.a", `joystick ${gamepadID} button_0`],
    ...["-ss.input.port1.gamepad.b", `joystick ${gamepadID} button_1`],
    ...["-ss.input.port1.gamepad.c", `joystick ${gamepadID} abs_2-`],
    ...["-ss.input.port1.gamepad.x", `joystick ${gamepadID} button_2`],
    ...["-ss.input.port1.gamepad.y", `joystick ${gamepadID} button_3`],
    ...["-ss.input.port1.gamepad.z", `joystick ${gamepadID} abs_5+`],
    ...["-ss.input.port1.gamepad.start", `joystick ${gamepadID} button_7`],
    ...["-ss.input.port1.gamepad.up", `joystick ${gamepadID} abs_7-`],
    ...["-ss.input.port1.gamepad.down", `joystick ${gamepadID} abs_7+`],
    ...["-ss.input.port1.gamepad.left", `joystick ${gamepadID} abs_6-`],
    ...["-ss.input.port1.gamepad.right", `joystick ${gamepadID} abs_6+`],
    ...["-ss.input.port1.gamepad.ls", `joystick ${gamepadID} button_4`],
    ...["-ss.input.port1.gamepad.rs", `joystick ${gamepadID} button_5`],
    // ...["-ss.input.port1.gamepad.a", `joystick ${gamepadID} button_0`],
    // ...["-ss.input.port1.gamepad.b", `joystick ${gamepadID} button_1`],
    // ...["-ss.input.port1.gamepad.c", `joystick ${gamepadID} button_5`],
    // ...["-ss.input.port1.gamepad.x", `joystick ${gamepadID} button_2`],
    // ...["-ss.input.port1.gamepad.y", `joystick ${gamepadID} button_3`],
    // ...["-ss.input.port1.gamepad.z", `joystick ${gamepadID} button_7`],
    // ...["-ss.input.port1.gamepad.start", `joystick ${gamepadID} button_9`],
    // ...["-ss.input.port1.gamepad.up", `joystick ${gamepadID} button_13`],
    // ...["-ss.input.port1.gamepad.down", `joystick ${gamepadID} button_14`],
    // ...["-ss.input.port1.gamepad.left", `joystick ${gamepadID} button_15`],
    // ...["-ss.input.port1.gamepad.right", `joystick ${gamepadID} button_16`],
    // ...["-ss.input.port1.gamepad.ls", `joystick ${gamepadID} button_4`],
    // ...["-ss.input.port1.gamepad.rs", `joystick ${gamepadID} button_6`],
  ];
};

/**
 * TODO: refactor and rename to get controller ids
 */
const startMednafen = () => {
  execFileSync(
    "flatpak",
    ["run", "--command=mednafen", "com.github.AmatCoder.mednaffe", "wrong"],
    {
      encoding: "utf8",
    },
  );
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

interface MednafenError {
  stdout: string;
}

const isMednafenError = (e: any): e is MednafenError =>
  typeof e.stdout === "string";

const extractGamepadIDs = (error: MednafenError) =>
  error.stdout
    .split("\n")
    .filter((line) => line.trim().startsWith("ID: "))
    .map((line) => line.trim().split("ID: ")[1].split(" - ")[0]);

export const mednafenSaturn: Application = {
  ...mednafen,
  id: "mednafenSaturn",
  createOptionParams: (props) => {
    /**
     * TODO: run mednafen with wrong gamepath to get stdout
     * parse gamepad id lines by 'ID:' e.g.: 'ID: 0x0003054c026881110006001100000000 - Sony PLAYSTATION(R)3 Controller\n'
     */
    try {
      startMednafen();
    } catch (e) {
      if (isMednafenError(e)) {
        const gamepadsIDs = extractGamepadIDs(e);
        log("debug", "mednafen gamepad IDs", gamepadsIDs);
        const virtualGamepads = gamepadsIDs.flatMap(getVirtualGamepad);
        return [...getSharedMednafenOptionParams(props), ...virtualGamepads];
      }

      return [...getSharedMednafenOptionParams(props)];
    }

    return [...getSharedMednafenOptionParams(props)];
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
