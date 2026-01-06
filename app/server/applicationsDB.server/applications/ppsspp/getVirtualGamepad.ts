import type { ParamToReplace } from "../../configFile.js";
import {
  getKeyboardKey,
  getKeyboardKeyForGamepadButton,
} from "./keyboardConfig.js";
import type { PpssppButtonId } from "./types.js";

const buttonMappingSdl: Record<PpssppButtonId, number> = {
  dpadUp: 19,
  dpadDown: 20,
  dpadLeft: 21,
  dpadRight: 22,
  b: 190,
  a: 189,
  x: 191,
  y: 188,
  start: 197,
  back: 196,
  // This works with ps3, steam deck controller and 8bitdo pro 2
  leftShoulder: 193,
  // This works with ps3, steam deck controller and 8bitdo pro 2
  rightShoulder: 192,
  leftStickUp: 4003,
  leftStickDown: 4002,
  leftStickLeft: 4001,
  leftStickRight: 4000,
  leftTrigger: 4008,
  rightTrigger: 0,
};

const buttonMappingXinput: Record<PpssppButtonId, number> = {
  dpadUp: 19,
  dpadDown: 20,
  dpadLeft: 21,
  dpadRight: 22,
  b: 97,
  a: 96,
  x: 99,
  y: 100,
  start: 108,
  back: 109,
  leftShoulder: 102,
  rightShoulder: 103,
  leftStickUp: 4002,
  leftStickDown: 4003,
  leftStickLeft: 4001,
  leftStickRight: 4000,
  leftTrigger: 4034,
  rightTrigger: 0,
};

const getButtonId = (
  controllerId: number,
  buttonId: PpssppButtonId,
  buttonMapping: Record<PpssppButtonId, number> = buttonMappingSdl,
) => `${controllerId}-${buttonMapping[buttonId]}`;

const controller1id = 10;
const controller2id = 11;
const controller360idWindows = 20;

const getMappingString = (buttonId: PpssppButtonId) =>
  [
    getKeyboardKeyForGamepadButton(buttonId),
    getButtonId(controller1id, buttonId),
    getButtonId(controller2id, buttonId),
    getButtonId(controller360idWindows, buttonId, buttonMappingXinput),
  ].join(",");

export const getVirtualGamepad = (): ParamToReplace[] => [
  {
    keyValue: `Up = ${getMappingString("dpadUp")}`,
  },
  {
    keyValue: `Down = ${getMappingString("dpadDown")}`,
  },
  {
    keyValue: `Left = ${getMappingString("dpadLeft")}`,
  },
  {
    keyValue: `Right = ${getMappingString("dpadRight")}`,
  },
  {
    keyValue: `Circle = ${getMappingString("b")}`,
  },
  {
    keyValue: `Cross = ${getMappingString("a")}`,
  },
  {
    keyValue: `Square = ${getMappingString("x")}`,
  },
  {
    keyValue: `Triangle = ${getMappingString("y")}`,
  },
  {
    keyValue: `Start = ${getMappingString("start")}`,
  },
  {
    keyValue: `Select = ${getMappingString("back")}`,
  },
  {
    keyValue: `L = ${getMappingString("leftShoulder")}`,
  },
  {
    keyValue: `R = ${getMappingString("rightShoulder")}`,
  },
  {
    keyValue: `An.Up = ${getMappingString("leftStickUp")}`,
  },
  {
    keyValue: `An.Down = ${getMappingString("leftStickDown")}`,
  },
  {
    keyValue: `An.Left = ${getMappingString("leftStickLeft")}`,
  },
  {
    keyValue: `An.Right = ${getMappingString("leftStickRight")}`,
  },
  {
    keyValue: `Pause = ${getKeyboardKey("F2")},${getButtonId(controller1id, "leftTrigger")},${getButtonId(controller2id, "leftTrigger")},${getButtonId(controller360idWindows, "leftTrigger", buttonMappingXinput)}`,
  },
  { keyValue: `Save State = ${getKeyboardKey("F1")}` },
  { keyValue: `Load State = ${getKeyboardKey("F3")}` },
  { keyValue: `Toggle Fullscreen = ${getKeyboardKey("F11")}` },
];
