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
  const { initialize, createButtonMapping } =
    new VirtualGamepad<MednafenButtonIdSaturn>(0, system, gamepadType);
  return [
    ...initialize(),
    ...createButtonMapping("up", getKeyboardMapping("dpadUp")),
    ...createButtonMapping("down", getKeyboardMapping("dpadDown")),
    ...createButtonMapping("left", getKeyboardMapping("dpadLeft")),
    ...createButtonMapping("right", getKeyboardMapping("dpadRight")),
    ...createButtonMapping("analog_up", getKeyboardMapping("leftStickUp")),
    ...createButtonMapping("analog_down", getKeyboardMapping("leftStickDown")),
    ...createButtonMapping("analog_left", getKeyboardMapping("leftStickLeft")),
    ...createButtonMapping(
      "analog_right",
      getKeyboardMapping("leftStickRight"),
    ),
    ...createButtonMapping("a", getKeyboardMapping("a")),
    ...createButtonMapping("b", getKeyboardMapping("b")),
    ...createButtonMapping("c", getKeyboardMapping("rightShoulder")),
    ...createButtonMapping("x", getKeyboardMapping("x")),
    ...createButtonMapping("y", getKeyboardMapping("y")),
    ...createButtonMapping("z", getKeyboardMapping("leftShoulder")),
    ...createButtonMapping("ls", getKeyboardMapping("leftTrigger")),
    ...createButtonMapping("rs", getKeyboardMapping("rightTrigger")),
    ...createButtonMapping("mode", getKeyboardMapping("back")),
    ...createButtonMapping("start", getKeyboardMapping("start")),
  ];
};

export const getVirtualGamepadSaturn = ({
  mednafenGamepadId,
  playerIndex,
  sdlController,
}: MappedGamepadWithPlayerIndex) => {
  log("debug", "gamepad", mednafenGamepadId, sdlController, playerIndex);
  const { initialize, createButtonMapping } =
    new VirtualGamepad<MednafenButtonIdSaturn>(
      playerIndex,
      system,
      gamepadType,
    );
  const physicalGamepad = getPhysicalGamepad(sdlController, mednafenGamepadId);

  return [
    ...initialize(),
    ...createButtonMapping("up", physicalGamepad.getDpadUp()),
    ...createButtonMapping("down", physicalGamepad.getDpadDown()),
    ...createButtonMapping("left", physicalGamepad.getDpadLeft()),
    ...createButtonMapping("right", physicalGamepad.getDpadRight()),
    ...createButtonMapping("analog_up", physicalGamepad.getLeftStickUp()),
    ...createButtonMapping("analog_down", physicalGamepad.getLeftStickDown()),
    ...createButtonMapping("analog_left", physicalGamepad.getLeftStickLeft()),
    ...createButtonMapping("analog_right", physicalGamepad.getLeftStickRight()),
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
};

export const getVirtualGamepadsSaturn = (
  mednafenGamepadIds: MednafenGamepadID[],
) => {
  const mappedGamepads = getMappedGamepads(mednafenGamepadIds);

  const virtualGamepads =
    mappedGamepads.length > 0
      ? mappedGamepads.map(getVirtualGamepadSaturn)
      : getKeyboardSaturn();
  log("debug", "gamepads", mappedGamepads.length);

  return [
    ...virtualGamepads.flat(),
    ...resetUnusedVirtualGamepads(
      12,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ).flat(),
  ];
};
