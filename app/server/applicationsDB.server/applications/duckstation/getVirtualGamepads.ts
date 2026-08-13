import { EOL } from "node:os";
import { isLightgunConnected } from "../../../../types/gamepad.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { keyboardConfig } from "./keyboardConfig.js";
import sdl from "@kmamal/sdl";
import { log } from "../../../debug.server.js";
import type { DuckStationButtonId } from "./types.js";
import { normalizeString } from "../../../igdb.server.js";
import { EmuzeController, getControllers } from "../../../gamepad.server.js";

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

export const getVirtualGamepad = (
  emuzeController: EmuzeController,
  sdlIndex: number,
) => {
  log("debug", "gamepad", { sdlIndex, emuzeController });

  return [
    `[Pad${sdlIndex + 1}]`,
    `Type = AnalogController`,
    ...Object.entries(buttonMapping).map(
      ([key, value]) => `${key} = SDL-${emuzeController.player}/${value}`,
    ),
    `SmallMotor = SDL-${sdlIndex}/SmallMotor`,
    `LargeMotor = SDL-${sdlIndex}/LargeMotor`,
    "",
    "",
    "",
  ].join(EOL);
};

const gameSpecificXscaleValues: Record<string, string> = {
  [normalizeString("Time Crisis")]: "0.94",
};

const getXscale = (gameName: string) => {
  const xscaleDefault = "1";
  const gameNameNormalized = normalizeString(gameName);

  const xscaleGameSpecific = gameSpecificXscaleValues[gameNameNormalized];

  return xscaleGameSpecific || xscaleDefault;
};

export const getLightgun = (gameName: string, playerIndex: number) => [
  `[Pad${playerIndex + 1}]`,
  `Type = GunCon`,
  `SmallMotor = SDL-${playerIndex}/SmallMotor`,
  `LargeMotor = SDL-${playerIndex}/LargeMotor`,
  `Trigger = Pointer-${playerIndex}/LeftButton`,
  `ShootOffscreen = Keyboard/${1 + playerIndex}`,
  `A = Pointer-${playerIndex}/RightButton`,
  `B = Keyboard/${5 + playerIndex}`,
  `XScale = ${getXscale(gameName)}`,
  "",
  "",
  "",
];

const getVirtualGamepadConfig = (gameName: string): string[] => {
  const gamepads = getControllers();

  if (gamepads.length > 0) {
    if (isLightgunConnected(sdl.joystick.devices)) {
      return [...getLightgun(gameName, 0)];
    }

    return gamepads.map(getVirtualGamepad);
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
