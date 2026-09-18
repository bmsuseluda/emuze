import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getSuperGrafxGamepadReset = (gamepadIndex: number) => {
  const getSuperGrafxButtonReset = getSystemGamepadButtonReset(
    "SuperGrafx/Input/Controller.Port.",
    "Gamepad",
  );

  return [
    ...getSuperGrafxButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getSuperGrafxButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getSuperGrafxButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getSuperGrafxButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getSuperGrafxButtonReset({ gamepadIndex, buttonId: "I" }),
    ...getSuperGrafxButtonReset({ gamepadIndex, buttonId: "II" }),

    ...getSuperGrafxButtonReset({ gamepadIndex, buttonId: "Select" }),
    ...getSuperGrafxButtonReset({ gamepadIndex, buttonId: "Run" }),
  ];
};

export const getSuperGrafxGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getSuperGrafxGamepadReset).flat();

export const aresSuperGrafx: Application = {
  ...ares,
  fileExtensions: [".pce", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "SuperGrafx"],
    ...getSuperGrafxGamepadsReset(),
  ],
};
