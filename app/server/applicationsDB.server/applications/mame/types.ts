import type { EmuzeButtonId } from "../../../../types/gamepad.js";

export type MameButtonId =
  | "JOYSTICK_UP"
  | "JOYSTICK_LEFT"
  | "JOYSTICK_RIGHT"
  | "JOYSTICK_DOWN"
  | "JOYSTICKLEFT_UP"
  | "JOYSTICKLEFT_LEFT"
  | "JOYSTICKLEFT_RIGHT"
  | "JOYSTICKLEFT_DOWN"
  | "BUTTON1"
  | "BUTTON2"
  | "BUTTON3"
  | "BUTTON4"
  | "BUTTON5"
  | "BUTTON6"
  | "BUTTON7"
  | "BUTTON8"
  | "BUTTON9"
  | "BUTTON10"
  | "BUTTON11"
  | "BUTTON15"
  | "START"
  | "SELECT"
  | "JOYSTICKRIGHT_UP"
  | "JOYSTICKRIGHT_LEFT"
  | "JOYSTICKRIGHT_RIGHT"
  | "JOYSTICKRIGHT_DOWN";

export const mameButtonIds = {
  dpadUp: "JOYSTICK_UP",
  dpadDown: "JOYSTICK_DOWN",
  dpadLeft: "JOYSTICK_LEFT",
  dpadRight: "JOYSTICK_RIGHT",
  leftStickUp: "JOYSTICKLEFT_UP",
  leftStickDown: "JOYSTICKLEFT_DOWN",
  leftStickLeft: "JOYSTICKLEFT_LEFT",
  leftStickRight: "JOYSTICKLEFT_RIGHT",
  a: "BUTTON1",
  b: "BUTTON2",
  x: "BUTTON3",
  y: "BUTTON4",
  leftShoulder: "BUTTON5",
  rightShoulder: "BUTTON6",
  leftTrigger: "BUTTON9",
  rightTrigger: "BUTTON10",
  back: "SELECT",
  start: "START",
  leftStick: "BUTTON7",
  rightStick: "BUTTON8",
  rightStickUp: "JOYSTICKRIGHT_UP",
  rightStickDown: "JOYSTICKRIGHT_DOWN",
  rightStickLeft: "JOYSTICKRIGHT_LEFT",
  rightStickRight: "JOYSTICKRIGHT_RIGHT",
} satisfies Record<EmuzeButtonId, MameButtonId>;
