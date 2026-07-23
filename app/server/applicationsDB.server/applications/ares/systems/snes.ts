import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getSnesGamepadReset = (gamepadIndex: number) => {
  const getSnesButtonReset = getSystemGamepadButtonReset(
    "SuperFamicom/Input/Controller.Port.",
    "Gamepad",
  );

  return [
    ...getSnesButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getSnesButtonReset({ gamepadIndex, buttonId: "A" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "B" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "X" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "Y" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "L" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "R" }),

    ...getSnesButtonReset({ gamepadIndex, buttonId: "Select" }),
    ...getSnesButtonReset({ gamepadIndex, buttonId: "Start" }),
  ];
};

export const getSnesGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getSnesGamepadReset).flat();

export const aresSuperNintendo: Application = {
  ...ares,
  fileExtensions: [".sfc", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Super Famicom"],
    ...getSnesGamepadsReset(),
  ],
};
