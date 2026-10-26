import { EOL } from "node:os";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { keyboardConfig } from "./keyboardConfig.js";
import { log } from "../../../debug.server.js";
import type { Pcsx2ButtonId } from "./types.js";
import {
  EmuzeController,
  getControllersSdl3,
} from "../../../gamepad.server.js";

const buttonMapping = {
  Up: "DPadUp",
  Right: "DPadRight",
  Down: "DPadDown",
  Left: "DPadLeft",
  Triangle: "Y",
  Circle: "B",
  Cross: "A",
  Square: "X",
  Select: "Back",
  Start: "Start",
  L1: "LeftShoulder",
  R1: "RightShoulder",
  L2: "+LeftTrigger",
  R2: "+RightTrigger",
  L3: "LeftStick",
  R3: "RightStick",
  LLeft: "-LeftX",
  LRight: "+LeftX",
  LDown: "+LeftY",
  LUp: "-LeftY",
  RLeft: "-RightX",
  RRight: "+RightX",
  RDown: "+RightY",
  RUp: "-RightY",
  Analog: "Guide",
} satisfies Record<Pcsx2ButtonId, string>;

const getPadIndex = (isMultitapGame: boolean, sdlIndex: number) => {
  if (sdlIndex === 0 || !isMultitapGame) {
    return sdlIndex + 1;
  }

  return sdlIndex + 2;
};

export const getVirtualGamepad =
  (isMultitapGame: boolean) =>
  (emuzeController: EmuzeController, sdlIndex: number) => {
    log("debug", "gamepad", { sdlIndex, emuzeController });

    return [
      `[Pad${getPadIndex(isMultitapGame, sdlIndex)}]`,
      "Type = DualShock2",
      "InvertL = 0",
      "InvertR = 0",
      "Deadzone = 0",
      "AxisScale = 1.33",
      "LargeMotorScale = 1",
      "SmallMotorScale = 1",
      "ButtonDeadzone = 0",
      "PressureModifier = 0.5",
      ...Object.entries(buttonMapping).map(
        ([key, value]) => `${key} = SDL-${emuzeController.player}/${value}`,
      ),
      "",
      "",
      "",
    ].join(EOL);
  };

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [`[Pad${gamepadIndex + 1}]`, "Type = None", "", "", ""].join(EOL);

const resetUnusedVirtualGamepadsMultitap = (virtualGamepadsLength: number) => [
  // reset Pad2, because it will not be used with a Multitap in Port 1
  getVirtualGamepadReset(1),
  ...resetUnusedVirtualGamepads(
    8,
    virtualGamepadsLength + 1,
    getVirtualGamepadReset,
  ),
];

export const getVirtualGamepads = (isMultitapGame: boolean) => {
  const gamepads = getControllersSdl3();

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(isMultitapGame))
      : [keyboardConfig];

  return [
    ...virtualGamepads,
    ...(isMultitapGame
      ? resetUnusedVirtualGamepadsMultitap(virtualGamepads.length)
      : resetUnusedVirtualGamepads(
          8,
          virtualGamepads.length,
          getVirtualGamepadReset,
        )),
  ];
};
