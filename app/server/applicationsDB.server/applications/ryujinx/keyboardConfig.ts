import type { InputConfig } from "./config";

export const keyboardConfig: InputConfig = {
  left_joycon_stick: {
    stick_up: "W",
    stick_down: "S",
    stick_left: "A",
    stick_right: "D",
    stick_button: "X",
  },
  right_joycon_stick: {
    stick_up: "Up",
    stick_down: "Down",
    stick_left: "Left",
    stick_right: "Right",
    stick_button: "ShiftRight",
  },
  left_joycon: {
    button_minus: "Minus",
    button_l: "Semicolon", // Ö
    button_zl: "P",
    button_sl: "Unbound",
    button_sr: "Unbound",
    dpad_up: "T",
    dpad_down: "G",
    dpad_left: "F",
    dpad_right: "H",
  },
  right_joycon: {
    button_plus: "Plus",
    button_r: "Quote", // Ä
    button_zr: "BracketLeft", // Ü
    button_sl: "Unbound",
    button_sr: "Unbound",
    button_x: "O",
    button_b: "K",
    button_y: "I",
    button_a: "L",
  },
  version: 1,
  backend: "WindowKeyboard",
  id: "0",
  controller_type: "ProController",
  player_index: "Player1",
};
