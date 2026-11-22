import { Sdl } from "@kmamal/sdl3";
import { GamepadType } from "./gamepad.js";

export type Hotkey =
  | "menu"
  | "save state"
  | "load state"
  | "rewind"
  | "fast forward"
  | "fullscreen"
  | "swap screen";

export type ApplicationHotkeys = Hotkey[];

export type InputDevice = "keyboard" | GamepadType;

export interface HotkeyDefintion extends Record<InputDevice, string> {
  keyboard: Sdl.Keyboard.ScancodeNames;
  XBox: string;
  PlayStation: string;
  Nintendo: string;
  gamepadSdl: Sdl.Gamepad.Button;
}

type HotkeysDefinition = Record<Hotkey, HotkeyDefintion>;

export const hotkeysDefinition = {
  menu: {
    keyboard: "F2",
    XBox: "back + y",
    PlayStation: "select + triangle",
    Nintendo: "select + x",
    gamepadSdl: "north",
  },
  "save state": {
    keyboard: "F1",
    XBox: "back + Left Shoulder",
    PlayStation: "select + L1",
    Nintendo: "select + Left Bumper",
    gamepadSdl: "leftShoulder",
  },
  "load state": {
    keyboard: "F3",
    XBox: "back + Right Shoulder",
    PlayStation: "select + R1",
    Nintendo: "select + Right Bumper",
    gamepadSdl: "rightShoulder",
  },
  rewind: {
    keyboard: "F4",
    XBox: "back + x",
    PlayStation: "select + square",
    Nintendo: "select + y",
    gamepadSdl: "west",
  },
  "fast forward": {
    keyboard: "F5",
    XBox: "back + b",
    PlayStation: "select + circle",
    Nintendo: "select + a",
    gamepadSdl: "east",
  },
  fullscreen: {
    keyboard: "F11",
    XBox: "back + start",
    PlayStation: "select + start",
    Nintendo: "select + start",
    gamepadSdl: "start",
  },
  "swap screen": {
    keyboard: "F7",
    XBox: "back + Right Stick",
    PlayStation: "select + R3",
    Nintendo: "select + Right Stick",
    gamepadSdl: "rightStick",
  },
} satisfies HotkeysDefinition;
