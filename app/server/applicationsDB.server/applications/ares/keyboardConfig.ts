import type { AresButtonId } from "./types";

type Scancode = keyof typeof scancodes;
const scancodes = {
  F1: 1,
  F2: 2,
  F3: 3,
  T: 54,
  G: 41,
  F: 40,
  H: 42,
  BACKSPACE: 28,
  RETURN: 89,
  J: 44,
  K: 45,
  U: 55,
  I: 43,
  L: 46,
  "0": 49,
  "8": 24,
  "9": 25,
  X: 58,
  RSHIFT: 96,
  W: 57,
  S: 53,
  A: 35,
  D: 38,
  UP: 84,
  DOWN: 85,
  LEFT: 86,
  RIGHT: 87,
} satisfies Record<string, number>;

export const getKeyboardKey = (scancode: Scancode) =>
  `0x1/0/${scancodes[scancode]}`;

const getVirtualKeyboardKey = (
  buttonId: AresButtonId,
  ...physicalKeyboardKeys: (Scancode | null)[]
) => {
  const physicalKeyboardKeyStrings = physicalKeyboardKeys
    .filter(Boolean)
    .map((key) => key && getKeyboardKey(key));

  if (physicalKeyboardKeyStrings.length > 0) {
    const virtualGamepadString = [`VirtualPad1`, buttonId].join("/");

    return [
      "--setting",
      `${virtualGamepadString}=${physicalKeyboardKeyStrings.join(";")}`,
    ];
  }

  return [];
};

/**
 *   VirtualPad1
 *   Pad.Up: 0x1/0/54;;
 *   Pad.Down: 0x1/0/41;;
 *   Pad.Left: 0x1/0/40;;
 *   Pad.Right: 0x1/0/42;;
 *   Select: 0x1/0/28;;
 *   Start: 0x1/0/89;;
 *   A..South: 0x1/0/44;;
 *   B..East: 0x1/0/45;;
 *   X..West: 0x1/0/55;;
 *   Y..North: 0x1/0/43;;
 *   L-Bumper: 0x1/0/46;;
 *   R-Bumper: 0x1/0/49;;
 *   L-Trigger: 0x1/0/24;;
 *   R-Trigger: 0x1/0/25;;
 *   L-Stick..Click: 0x1/0/58;;
 *   R-Stick..Click: 0x1/0/96;;
 *   L-Up: 0x1/0/57;;
 *   L-Down: 0x1/0/53;;
 *   L-Left: 0x1/0/35;;
 *   L-Right: 0x1/0/38;;
 *   R-Up: 0x1/0/84;;
 *   R-Down: 0x1/0/85;;
 *   R-Left: 0x1/0/86;;
 *   R-Right: 0x1/0/87;;
 *   Rumble: ;;
 */
export const getKeyboard = () => [
  ...getVirtualKeyboardKey("Pad.Up", "T"),
  ...getVirtualKeyboardKey("Pad.Down", "G"),
  ...getVirtualKeyboardKey("Pad.Left", "F"),
  ...getVirtualKeyboardKey("Pad.Right", "H"),
  ...getVirtualKeyboardKey("Select", "BACKSPACE"),
  ...getVirtualKeyboardKey("Start", "RETURN"),
  ...getVirtualKeyboardKey("A..South", "J"),
  ...getVirtualKeyboardKey("B..East", "K"),
  ...getVirtualKeyboardKey("X..West", "U"),
  ...getVirtualKeyboardKey("Y..North", "I"),
  ...getVirtualKeyboardKey("L-Bumper", "L"),
  ...getVirtualKeyboardKey("R-Bumper", "0"),
  ...getVirtualKeyboardKey("L-Trigger", "8"),
  ...getVirtualKeyboardKey("R-Trigger", "9"),
  ...getVirtualKeyboardKey("L-Stick..Click", "X"),
  ...getVirtualKeyboardKey("R-Stick..Click", "RSHIFT"),
  ...getVirtualKeyboardKey("L-Up", "W"),
  ...getVirtualKeyboardKey("L-Down", "S"),
  ...getVirtualKeyboardKey("L-Left", "A"),
  ...getVirtualKeyboardKey("L-Right", "D"),
  ...getVirtualKeyboardKey("R-Up", "UP"),
  ...getVirtualKeyboardKey("R-Down", "DOWN"),
  ...getVirtualKeyboardKey("R-Left", "LEFT"),
  ...getVirtualKeyboardKey("R-Right", "RIGHT"),
];
