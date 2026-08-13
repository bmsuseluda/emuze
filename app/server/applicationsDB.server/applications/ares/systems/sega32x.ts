import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getSega32xGamepadReset = (gamepadIndex: number) => {
  const getSega32xButtonReset = getSystemGamepadButtonReset(
    "Mega32X/Input/Controller.Port.",
    "Fighting.Pad",
  );

  return [
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getSega32xButtonReset({ gamepadIndex, buttonId: "A" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "B" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "C" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "X" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "Y" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "Z" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "Mode" }),
    ...getSega32xButtonReset({ gamepadIndex, buttonId: "Start" }),
  ];
};

export const getSega32xGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getSega32xGamepadReset).flat();

export const aresSega32x: Application = {
  ...ares,
  fileExtensions: [".32x", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega 32X"],
    ...getSega32xGamepadsReset(),
  ],
};
