import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getMasterSystemGamepadReset = (gamepadIndex: number) => {
  const getMasterSystemButtonReset = getSystemGamepadButtonReset(
    "MasterSystem/Input/Controller.Port.",
    "Gamepad",
  );

  return [
    ...getMasterSystemButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getMasterSystemButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getMasterSystemButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getMasterSystemButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getMasterSystemButtonReset({ gamepadIndex, buttonId: "1" }),
    ...getMasterSystemButtonReset({ gamepadIndex, buttonId: "2" }),
  ];
};

export const getMasterSystemGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getMasterSystemGamepadReset).flat();

export const aresMasterSystem: Application = {
  ...ares,
  fileExtensions: [".sms", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Master System"],
    ...getMasterSystemGamepadsReset(),
  ],
};
