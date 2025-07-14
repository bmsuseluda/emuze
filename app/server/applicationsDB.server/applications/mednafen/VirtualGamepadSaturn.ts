import type { GamepadID } from "./initGamepadIDs.js";
import { findSdlGamepad, getGamepads } from "./initGamepadIDs.js";
import { log } from "../../../debug.server.js";
import { VirtualGamepad } from "./VirtualGamepad.js";
import { getKeyboardKey } from "./keyboardConfig.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { getPhysicalGamepad } from "./getPhysicalGamepad.js";

type MednafenButtonIdSaturn =
  | "up"
  | "down"
  | "left"
  | "right"
  | "analog_up"
  | "analog_down"
  | "analog_left"
  | "analog_right"
  | "a"
  | "b"
  | "c"
  | "x"
  | "y"
  | "z"
  | "start"
  | "ls"
  | "rs"
  | "mode";

const system = "ss";
const gamepadType = "3dpad";

export const getVirtualGamepadReset = (index: number) => {
  const { disableButtonMapping } = new VirtualGamepad<MednafenButtonIdSaturn>(
    index,
    system,
    gamepadType,
  );
  return [
    ...disableButtonMapping("up"),
    ...disableButtonMapping("down"),
    ...disableButtonMapping("left"),
    ...disableButtonMapping("right"),
    ...disableButtonMapping("analog_up"),
    ...disableButtonMapping("analog_down"),
    ...disableButtonMapping("analog_left"),
    ...disableButtonMapping("analog_right"),
    ...disableButtonMapping("a"),
    ...disableButtonMapping("b"),
    ...disableButtonMapping("c"),
    ...disableButtonMapping("x"),
    ...disableButtonMapping("y"),
    ...disableButtonMapping("z"),
    ...disableButtonMapping("ls"),
    ...disableButtonMapping("rs"),
    ...disableButtonMapping("mode"),
    ...disableButtonMapping("start"),
  ];
};

export const getKeyboardSaturn = () => {
  const { createButtonMapping } = new VirtualGamepad<MednafenButtonIdSaturn>(
    0,
    system,
    gamepadType,
  );
  return [
    ...createButtonMapping("up", getKeyboardKey("T")),
    ...createButtonMapping("down", getKeyboardKey("G")),
    ...createButtonMapping("left", getKeyboardKey("F")),
    ...createButtonMapping("right", getKeyboardKey("H")),
    ...createButtonMapping("analog_up", getKeyboardKey("W")),
    ...createButtonMapping("analog_down", getKeyboardKey("S")),
    ...createButtonMapping("analog_left", getKeyboardKey("A")),
    ...createButtonMapping("analog_right", getKeyboardKey("D")),
    ...createButtonMapping("a", getKeyboardKey("J")),
    ...createButtonMapping("b", getKeyboardKey("K")),
    ...createButtonMapping("c", getKeyboardKey("L")),
    ...createButtonMapping("x", getKeyboardKey("U")),
    ...createButtonMapping("y", getKeyboardKey("I")),
    ...createButtonMapping("z", getKeyboardKey("O")),
    ...createButtonMapping("ls", getKeyboardKey("8")),
    ...createButtonMapping("rs", getKeyboardKey("9")),
    ...createButtonMapping("mode", getKeyboardKey("BACKSPACE")),
    ...createButtonMapping("start", getKeyboardKey("RETURN")),
  ];
};

export const getVirtualGamepadSaturn = (
  gamepadID: GamepadID,
  index: number,
) => {
  const sdlGamepad = findSdlGamepad(gamepadID, index);

  if (sdlGamepad) {
    log("debug", "gamepad", gamepadID, sdlGamepad);
    const { initialize, createButtonMapping } =
      new VirtualGamepad<MednafenButtonIdSaturn>(index, system, gamepadType);
    const physicalGamepad = getPhysicalGamepad(sdlGamepad, gamepadID);

    return [
      ...initialize(),
      ...createButtonMapping("up", physicalGamepad.getDpadUp()),
      ...createButtonMapping("down", physicalGamepad.getDpadDown()),
      ...createButtonMapping("left", physicalGamepad.getDpadLeft()),
      ...createButtonMapping("right", physicalGamepad.getDpadRight()),
      ...createButtonMapping("analog_up", physicalGamepad.getLeftStickUp()),
      ...createButtonMapping("analog_down", physicalGamepad.getLeftStickDown()),
      ...createButtonMapping("analog_left", physicalGamepad.getLeftStickLeft()),
      ...createButtonMapping(
        "analog_right",
        physicalGamepad.getLeftStickRight(),
      ),
      ...createButtonMapping("a", physicalGamepad.getA()),
      ...createButtonMapping("b", physicalGamepad.getB()),
      ...createButtonMapping("c", physicalGamepad.getRightShoulder()),
      ...createButtonMapping("x", physicalGamepad.getX()),
      ...createButtonMapping("y", physicalGamepad.getY()),
      ...createButtonMapping("z", physicalGamepad.getLeftShoulder()),
      ...createButtonMapping("ls", physicalGamepad.getLeftTrigger()),
      ...createButtonMapping("rs", physicalGamepad.getRightTrigger()),
      ...createButtonMapping("mode", physicalGamepad.getBack()),
      ...createButtonMapping("start", physicalGamepad.getStart()),
    ];
  }

  return [];
};

export const getVirtualGamepadsSaturn = (applicationPath?: string) => {
  const gamepads = getGamepads(applicationPath);
  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepadSaturn)
      : getKeyboardSaturn();
  log("debug", "gamepads", gamepads.length);

  return [
    ...virtualGamepads.flat(),
    ...resetUnusedVirtualGamepads(
      12,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ).flat(),
  ];
};
