import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import {
  getNameIndex,
  getPlayerIndexArray,
} from "../../../../types/gamepad.js";
import { log } from "../../../debug.server.js";
import { isSteamOs } from "../../../operationsystem.server.js";
import type { GlobalDefaultInputConfigFile, PlayerInput } from "./config.js";
import { globalDefaultInputConfigFileReset } from "./config.js";
import { keyboardConfig } from "./keyboardConfig.js";

export const getVirtualGamepad =
  (isPs1Classic: boolean) =>
  (
    name: string,
    index: number,
    devices: Sdl.Joystick.Device[] | Sdl.Controller.Device[],
  ): PlayerInput => {
    const psButtonPs1ClassicOverwrite =
      isSteamOs() && isPs1Classic ? { "PS Button": "RS", R3: "" } : {};

    return {
      Handler: "SDL",
      Device: `${name} ${getNameIndex(name, index, devices) + 1}`,
      Config: {
        "Left Stick Left": "LS X-",
        "Left Stick Down": "LS Y-",
        "Left Stick Right": "LS X+",
        "Left Stick Up": "LS Y+",
        "Right Stick Left": "RS X-",
        "Right Stick Down": "RS Y-",
        "Right Stick Right": "RS X+",
        "Right Stick Up": "RS Y+",
        Start: "Start",
        Select: "Back",
        "PS Button": "Guide",
        Square: "West",
        Cross: "South",
        Circle: "East",
        Triangle: "North",
        Left: "Left",
        Down: "Down",
        Right: "Right",
        Up: "Up",
        R1: "RB",
        R2: "RT",
        R3: "RS",
        L1: "LB",
        L2: "LT",
        L3: "LS",
        "IR Nose": "",
        "IR Tail": "",
        "IR Left": "",
        "IR Right": "",
        "Tilt Left": "",
        "Tilt Right": "",
        "Motion Sensor X": {
          Axis: "",
          Mirrored: false,
          Shift: 0,
        },
        "Motion Sensor Y": {
          Axis: "",
          Mirrored: false,
          Shift: 0,
        },
        "Motion Sensor Z": {
          Axis: "",
          Mirrored: false,
          Shift: 0,
        },
        "Motion Sensor G": {
          Axis: "",
          Mirrored: false,
          Shift: 0,
        },
        "Orientation Reset Button": "",
        "Orientation Enabled": false,
        "Pressure Intensity Button": "",
        "Pressure Intensity Percent": 50,
        "Pressure Intensity Toggle Mode": false,
        "Pressure Intensity Deadzone": 0,
        "Analog Limiter Button": "",
        "Analog Limiter Toggle Mode": false,
        "Left Stick Multiplier": 100,
        "Right Stick Multiplier": 100,
        "Left Stick Deadzone": 8000,
        "Right Stick Deadzone": 8000,
        "Left Stick Anti-Deadzone": 4259,
        "Right Stick Anti-Deadzone": 4259,
        "Left Trigger Threshold": 0,
        "Right Trigger Threshold": 0,
        "Left Pad Squircling Factor": 8000,
        "Right Pad Squircling Factor": 8000,
        "Color Value R": 0,
        "Color Value G": 0,
        "Color Value B": 20,
        "Blink LED when battery is below 20%": true,
        "Use LED as a battery indicator": false,
        "LED battery indicator brightness": 10,
        "Player LED enabled": true,
        "Large Vibration Motor Multiplier": 100,
        "Small Vibration Motor Multiplier": 100,
        "Switch Vibration Motors": false,
        "Mouse Movement Mode": "Relative",
        "Mouse Deadzone X Axis": 60,
        "Mouse Deadzone Y Axis": 60,
        "Mouse Acceleration X Axis": 200,
        "Mouse Acceleration Y Axis": 250,
        "Left Stick Lerp Factor": 100,
        "Right Stick Lerp Factor": 100,
        "Analog Button Lerp Factor": 100,
        "Trigger Lerp Factor": 100,
        "Device Class Type": 0,
        "Vendor ID": 1356,
        "Product ID": 616,
        ...psButtonPs1ClassicOverwrite,
      },
      "Buddy Device": "",
    };
  };

export const getVirtualGamepads = (
  isPs1Classic: boolean,
): GlobalDefaultInputConfigFile => {
  const gamepads = isSteamOs() ? sdl.joystick.devices : sdl.controller.devices;
  const playerIndexArray = getPlayerIndexArray(sdl.joystick.devices);

  if (gamepads.length > 0) {
    const mappedGamepads = gamepads.reduce<GlobalDefaultInputConfigFile>(
      (accumulator, currentDevice, index) => {
        if (currentDevice.name) {
          log("debug", "gamepad", { index, currentDevice });

          accumulator[`Player ${playerIndexArray[index] + 1} Input`] =
            getVirtualGamepad(isPs1Classic)(
              currentDevice.name,
              index,
              gamepads,
            );
        }
        return accumulator;
      },
      globalDefaultInputConfigFileReset,
    );

    return mappedGamepads;
  }

  return keyboardConfig;
};
