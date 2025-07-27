import type { VirtualGamepad } from "./types.js";

export const getVirtualGamepadButtonReset = (
  virtualGamepad: VirtualGamepad,
) => [
  "--setting",
  `${[
    `VirtualPad${virtualGamepad.gamepadIndex + 1}`,
    virtualGamepad.buttonId,
  ].join("/")}= `,
];

export const getVirtualGamepadReset = (gamepadIndex: number) => [
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "Pad.Left" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "Pad.Right" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "Pad.Up" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "Pad.Down" }),

  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "Select" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "Start" }),

  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "A..South" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "B..East" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "X..West" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "Y..North" }),

  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "L-Bumper" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "R-Bumper" }),

  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "L-Trigger" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "R-Trigger" }),

  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "L-Stick..Click" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "R-Stick..Click" }),

  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "L-Up" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "L-Down" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "L-Left" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "L-Right" }),

  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "R-Up" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "R-Down" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "R-Left" }),
  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "R-Right" }),

  ...getVirtualGamepadButtonReset({ gamepadIndex, buttonId: "Rumble" }),
];
