import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getPcEngineGamepadReset = (gamepadIndex: number) => {
  const getPcEngineButtonReset = getSystemGamepadButtonReset(
    "PCEngine/Input/Controller.Port.",
    "Gamepad",
  );

  return [
    ...getPcEngineButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getPcEngineButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getPcEngineButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getPcEngineButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getPcEngineButtonReset({ gamepadIndex, buttonId: "I" }),
    ...getPcEngineButtonReset({ gamepadIndex, buttonId: "II" }),

    ...getPcEngineButtonReset({ gamepadIndex, buttonId: "Select" }),
    ...getPcEngineButtonReset({ gamepadIndex, buttonId: "Run" }),
  ];
};

export const getPcEngineGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getPcEngineGamepadReset).flat();

export const aresPcEngine: Application = {
  ...ares,
  fileExtensions: [".pce", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "PC Engine"],
    ...getPcEngineGamepadsReset(),
  ],
};
