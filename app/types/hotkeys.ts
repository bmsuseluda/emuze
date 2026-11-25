import { Sdl } from "@kmamal/sdl3";
import { GamepadType } from "./gamepad.js";

export type Hotkey =
  | "Emulator Menu"
  | "Save State"
  | "Load State"
  | "Rewind"
  | "Fast Forward"
  | "Fullscreen"
  | "Swap Screen";

export type ApplicationHotkeys = Partial<Record<Hotkey, string>>;

export type InputDevice = "keyboard" | GamepadType;

type Extends<T, U extends T> = U;
export type HotkeyKeyboard = Extends<
  Sdl.Keyboard.ScancodeNames,
  "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F11"
>;

export interface HotkeyDefintion extends Record<InputDevice, string> {
  keyboard: HotkeyKeyboard;
  XBox: string;
  PlayStation: string;
  Nintendo: string;
  gamepadSdl: Sdl.Gamepad.Button;
}

type HotkeysDefinition = Record<Hotkey, HotkeyDefintion>;

export const hotkeysDefinition = {
  "Emulator Menu": {
    keyboard: "F2",
    XBox: "back + y",
    PlayStation: "select + triangle",
    Nintendo: "select + x",
    gamepadSdl: "north",
  },
  "Save State": {
    keyboard: "F1",
    XBox: "back + Left Shoulder",
    PlayStation: "select + L1",
    Nintendo: "select + Left Bumper",
    gamepadSdl: "leftShoulder",
  },
  "Load State": {
    keyboard: "F3",
    XBox: "back + Right Shoulder",
    PlayStation: "select + R1",
    Nintendo: "select + Right Bumper",
    gamepadSdl: "rightShoulder",
  },
  Rewind: {
    keyboard: "F4",
    XBox: "back + x",
    PlayStation: "select + square",
    Nintendo: "select + y",
    gamepadSdl: "west",
  },
  "Fast Forward": {
    keyboard: "F5",
    XBox: "back + b",
    PlayStation: "select + circle",
    Nintendo: "select + a",
    gamepadSdl: "east",
  },
  Fullscreen: {
    keyboard: "F11",
    XBox: "back + start",
    PlayStation: "select + start",
    Nintendo: "select + start",
    gamepadSdl: "start",
  },
  "Swap Screen": {
    keyboard: "F6",
    XBox: "back + Right Stick",
    PlayStation: "select + R3",
    Nintendo: "select + Right Stick",
    gamepadSdl: "rightStick",
  },
} satisfies HotkeysDefinition;
