import { EOL } from "node:os";
import {
  getPlayerIndexArray,
  isLightgunConnected,
} from "../../../../types/gamepad.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { keyboardConfig } from "./keyboardConfig.js";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../../../debug.server.js";
import type { DuckStationButtonId } from "./types.js";

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
} satisfies Record<DuckStationButtonId, string>;

export const getVirtualGamepad =
  (playerIndexArray: number[]) =>
  (sdlDevice: Sdl.Joystick.Device, sdlIndex: number) => {
    log("debug", "gamepad", { sdlIndex, sdlDevice });

    return [
      `[Pad${playerIndexArray[sdlIndex] + 1}]`,
      `Type = AnalogController`,
      ...Object.entries(buttonMapping).map(
        ([key, value]) => `${key} = SDL-${sdlDevice.player}/${value}`,
      ),
      `SmallMotor = SDL-${sdlIndex}/SmallMotor`,
      `LargeMotor = SDL-${sdlIndex}/LargeMotor`,
      "",
      "",
      "",
    ].join(EOL);
  };

export const getLightgun = (gameName: string) => [
  `[Pad1]`,
  `Type = GunCon`,
  `SmallMotor = SDL-0/SmallMotor`,
  `LargeMotor = SDL-0/LargeMotor`,
  `Trigger = Pointer-0/LeftButton`,
  `ShootOffscreen = Keyboard/1`,
  `A = Pointer-0/RightButton`,
  `B = Keyboard/5`,
  `XScale = ${gameName === "Time Crisis" ? "0.94" : "1"}`,
  "",
  "",
  "",
];

const getVirtualGamepadConfig = (gameName: string): string[] => {
  const gamepads = sdl.joystick.devices;

  if (gamepads.length > 0) {
    if (isLightgunConnected(gamepads)) {
      return getLightgun(gameName);
    }

    const playerIndexArray = getPlayerIndexArray(gamepads);
    return gamepads.map(getVirtualGamepad(playerIndexArray));
  }

  return [keyboardConfig];
};

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [`[Pad${gamepadIndex + 1}]`, "Type = None", "", "", ""].join(EOL);

export const getVirtualGamepads = (gameName: string) => {
  const virtualGamepads = getVirtualGamepadConfig(gameName);

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(
      8,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ),
  ];
};
