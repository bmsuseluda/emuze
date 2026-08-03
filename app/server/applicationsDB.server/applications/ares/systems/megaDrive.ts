import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getMegadriveGamepadReset = (gamepadIndex: number) => {
  const getMegadriveButtonReset = getSystemGamepadButtonReset(
    "MegaDrive/Input/Controller.Port.",
    "Control.Pad",
  );

  return [
    ...getMegadriveButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getMegadriveButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getMegadriveButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getMegadriveButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getMegadriveButtonReset({ gamepadIndex, buttonId: "A" }),
    ...getMegadriveButtonReset({ gamepadIndex, buttonId: "B" }),
    ...getMegadriveButtonReset({ gamepadIndex, buttonId: "C" }),
    ...getMegadriveButtonReset({ gamepadIndex, buttonId: "Start" }),
  ];
};

export const getMegadriveGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getMegadriveGamepadReset).flat();

export const aresMegaDrive: Application = {
  ...ares,
  fileExtensions: [".sfc", ".smc", ".68K", ".bin", ".md", ".sgd", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega Drive"],
    ...getMegadriveGamepadsReset(),
  ],
};
