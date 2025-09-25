import type {
  MappedGamepadWithPlayerIndex,
  MednafenGamepadID,
} from "./initGamepadIDs.js";
import { getMappedGamepads } from "./initGamepadIDs.js";
import { log } from "../../../debug.server.js";
import { VirtualGamepad } from "./VirtualGamepad.js";
import { getKeyboardMapping } from "./keyboardConfig.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { getPhysicalGamepad } from "./getPhysicalGamepad.js";

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
  const { initialize, createButtonMapping, disableButtonMapping } =
    new VirtualGamepad<MednafenButtonIdPcEngine>(0, system);
  return [
    ...initialize(),
    ...createButtonMapping(
      "up",
      getKeyboardMapping("dpadUp"),
      getKeyboardMapping("leftStickUp"),
    ),
    ...createButtonMapping(
      "down",
      getKeyboardMapping("dpadDown"),
      getKeyboardMapping("leftStickDown"),
    ),
    ...createButtonMapping(
      "left",
      getKeyboardMapping("dpadLeft"),
      getKeyboardMapping("leftStickLeft"),
    ),
    ...createButtonMapping(
      "right",
      getKeyboardMapping("dpadRight"),
      getKeyboardMapping("leftStickRight"),
    ),
    ...createButtonMapping("i", getKeyboardMapping("b")),
    ...createButtonMapping("ii", getKeyboardMapping("a")),
    ...disableButtonMapping("iii"),
    ...disableButtonMapping("iv"),
    ...disableButtonMapping("v"),
    ...disableButtonMapping("vi"),
    ...createButtonMapping("rapid_i", getKeyboardMapping("y")),
    ...createButtonMapping("rapid_ii", getKeyboardMapping("x")),
    ...disableButtonMapping("mode_select"),
    ...createButtonMapping("select", getKeyboardMapping("back")),
    ...createButtonMapping("run", getKeyboardMapping("start")),
  ];
};

export const getVirtualGamepadPcEngine = ({
  mednafenGamepadId,
  playerIndex,
  sdlController,
}: MappedGamepadWithPlayerIndex) => {
  log("debug", "gamepad", mednafenGamepadId, sdlController, playerIndex);
  const { initialize, createButtonMapping, disableButtonMapping } =
    new VirtualGamepad<MednafenButtonIdPcEngine>(playerIndex, system);
  const physicalGamepad = getPhysicalGamepad(sdlController, mednafenGamepadId);

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
};

export const getVirtualGamepadsPcEngine = (
  mednafenGamepadIds: MednafenGamepadID[],
) => {
  const mappedGamepads = getMappedGamepads(mednafenGamepadIds);

  const virtualGamepads =
    mappedGamepads.length > 0
      ? mappedGamepads.map(getVirtualGamepadPcEngine)
      : getKeyboardPcEngine();
  log("debug", "gamepads", mappedGamepads.length);

  return [
    ...virtualGamepads.flat(),
    ...resetUnusedVirtualGamepads(
      5,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ).flat(),
  ];
};
