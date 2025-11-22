import { getKeyboardKey } from "./keyboardConfig.js";

type ButtonId = keyof typeof buttonMapping;
export const buttonMapping = {
  Left: 0,
  Middle: 1,
  Right: 2,
} satisfies Partial<Record<string, number>>;

type AxisId = "X" | "Y";
const axisMapping = {
  X: 0,
  Y: 1,
} satisfies Record<AxisId, number>;

export const getVirtualMouseAxis = (axisId: AxisId) =>
  `VirtualMouse2/${axisId}=0x2/0/${axisMapping[axisId]}`;

export const getPhysicalMouseButton = (buttonId: ButtonId) =>
  `0x2/1/${buttonMapping[buttonId]}`;

export const getVirtualMouseButton = (buttonId: ButtonId) =>
  `VirtualMouse2/${buttonId}=${getPhysicalMouseButton(buttonId)}`;

export const getMouse = () => [
  ...["--setting", getVirtualMouseAxis("X")],
  ...["--setting", getVirtualMouseAxis("Y")],
  ...["--setting", getVirtualMouseButton("Left")],
  ...["--setting", getVirtualMouseButton("Middle")],
  ...["--setting", getVirtualMouseButton("Right")],
  ...["--setting", `VirtualMouse2/Extra=${getKeyboardKey("5")}`],
];
