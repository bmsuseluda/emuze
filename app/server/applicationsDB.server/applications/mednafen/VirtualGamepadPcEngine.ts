import sdl from "@kmamal/sdl";
import type { GamepadID } from "./initGamepadIDs.js";
import { findSdlGamepad } from "./initGamepadIDs.js";
import { log } from "../../../debug.server.js";
import { VirtualGamepad } from "./VirtualGamepad.js";
import { getKeyboardKey } from "./keyboardConfig.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { getPhysicalGamepad } from "./getPhysicalGamepad.js";
import { getPlayerIndexArray } from "../../../../types/gamepad.js";

type MednafenButtonIdPcEngine =
  | "up"
  | "down"
  | "left"
  | "right"
  | "i"
  | "ii"
  | "iii"
  | "iv"
  | "v"
  | "vi"
  | "select"
  | "run"
  | "mode_select"
  | "rapid_i"
  | "rapid_ii";

const system = "pce";

export const getVirtualGamepadReset = (index: number) => {
  const { disableButtonMapping } = new VirtualGamepad<MednafenButtonIdPcEngine>(
    index,
    system,
  );
  return [
    ...disableButtonMapping("up"),
    ...disableButtonMapping("down"),
    ...disableButtonMapping("left"),
    ...disableButtonMapping("right"),
    ...disableButtonMapping("i"),
    ...disableButtonMapping("ii"),
    ...disableButtonMapping("iii"),
    ...disableButtonMapping("iv"),
    ...disableButtonMapping("v"),
    ...disableButtonMapping("vi"),
    ...disableButtonMapping("rapid_i"),
    ...disableButtonMapping("rapid_ii"),
    ...disableButtonMapping("mode_select"),
    ...disableButtonMapping("select"),
    ...disableButtonMapping("run"),
  ];
};

export const getKeyboardPcEngine = () => {
  const { createButtonMapping, disableButtonMapping } =
    new VirtualGamepad<MednafenButtonIdPcEngine>(0, system);
  return [
    ...createButtonMapping("up", getKeyboardKey("W")),
    ...createButtonMapping("down", getKeyboardKey("S")),
    ...createButtonMapping("left", getKeyboardKey("A")),
    ...createButtonMapping("right", getKeyboardKey("D")),
    ...createButtonMapping("i", getKeyboardKey("K")),
    ...createButtonMapping("ii", getKeyboardKey("J")),
    ...disableButtonMapping("iii"),
    ...disableButtonMapping("iv"),
    ...disableButtonMapping("v"),
    ...disableButtonMapping("vi"),
    ...createButtonMapping("rapid_i", getKeyboardKey("I")),
    ...createButtonMapping("rapid_ii", getKeyboardKey("U")),
    ...disableButtonMapping("mode_select"),
    ...createButtonMapping("select", getKeyboardKey("BACKSPACE")),
    ...createButtonMapping("run", getKeyboardKey("RETURN")),
  ];
};

export const getVirtualGamepadPcEngine =
  (playerIndexArray: number[]) => (gamepadID: GamepadID, index: number) => {
    const sdlGamepad = findSdlGamepad(gamepadID, index);

    if (sdlGamepad) {
      log("debug", "gamepad", gamepadID, sdlGamepad);
      const { initialize, createButtonMapping, disableButtonMapping } =
        new VirtualGamepad<MednafenButtonIdPcEngine>(
          playerIndexArray[index],
          system,
        );
      const physicalGamepad = getPhysicalGamepad(sdlGamepad, gamepadID);

      return [
        ...initialize(),
        ...createButtonMapping(
          "up",
          physicalGamepad.getDpadUp(),
          physicalGamepad.getLeftStickUp(),
        ),
        ...createButtonMapping(
          "down",
          physicalGamepad.getDpadDown(),
          physicalGamepad.getLeftStickDown(),
        ),
        ...createButtonMapping(
          "left",
          physicalGamepad.getDpadLeft(),
          physicalGamepad.getLeftStickLeft(),
        ),
        ...createButtonMapping(
          "right",
          physicalGamepad.getDpadRight(),
          physicalGamepad.getLeftStickRight(),
        ),
        ...createButtonMapping("i", physicalGamepad.getB()),
        ...createButtonMapping("ii", physicalGamepad.getA()),
        ...disableButtonMapping("iii"),
        ...disableButtonMapping("iv"),
        ...disableButtonMapping("v"),
        ...disableButtonMapping("vi"),
        ...createButtonMapping("rapid_i", physicalGamepad.getY()),
        ...createButtonMapping("rapid_ii", physicalGamepad.getX()),
        ...disableButtonMapping("mode_select"),
        ...createButtonMapping("select", physicalGamepad.getBack()),
        ...createButtonMapping("run", physicalGamepad.getStart()),
      ];
    }

    return [];
  };

export const getVirtualGamepadsPcEngine = (gamepads: GamepadID[]) => {
  const playerIndexArray = getPlayerIndexArray(sdl.joystick.devices);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepadPcEngine(playerIndexArray))
      : getKeyboardPcEngine();
  log("debug", "gamepads", gamepads.length);

  return [
    ...virtualGamepads.flat(),
    ...resetUnusedVirtualGamepads(
      5,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ).flat(),
  ];
};
