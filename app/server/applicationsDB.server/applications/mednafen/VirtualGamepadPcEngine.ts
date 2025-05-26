import type { GamepadID } from "./initGamepadIDs.js";
import { findSdlGamepad, getGamepads } from "./initGamepadIDs.js";
import { log } from "../../../debug.server.js";
import { VirtualGamepad } from "./VirtualGamepad.js";
import { PhysicalGamepadLinux } from "./PhysicalGamepadLinux.js";
import { getKeyboardKey } from "./keyboardConfig.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { isWindows } from "../../../operationsystem.server.js";
import { PhysicalGamepadXinput } from "./PhysicalGamepadXinput.js";

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

export const getVirtualGamepadPcEngine = (
  gamepadID: GamepadID,
  index: number,
) => {
  const sdlGamepad = findSdlGamepad(gamepadID, index);

  if (sdlGamepad) {
    log("debug", "gamepad", gamepadID, sdlGamepad);
    const { initialize, createButtonMapping, disableButtonMapping } =
      new VirtualGamepad<MednafenButtonIdPcEngine>(index, system);
    const physicalGamepad = isWindows()
      ? new PhysicalGamepadXinput(gamepadID.id, sdlGamepad.mapping)
      : new PhysicalGamepadLinux(gamepadID.id, sdlGamepad.mapping);

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

export const getVirtualGamepadsPcEngine = (applicationPath?: string) => {
  const gamepads = getGamepads(applicationPath);
  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.flatMap(getVirtualGamepadPcEngine)
      : getKeyboardPcEngine();
  log("debug", "gamepads", gamepads.length);

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(
      5,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ).flat(),
  ];
};
