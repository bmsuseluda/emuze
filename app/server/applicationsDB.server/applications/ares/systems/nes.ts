import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getNesGamepadReset = (gamepadIndex: number) => {
  const getNesButtonReset = getSystemGamepadButtonReset(
    "Famicom/Input/Controller.Port.",
    "Gamepad",
  );

  return [
    ...getNesButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getNesButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getNesButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getNesButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getNesButtonReset({ gamepadIndex, buttonId: "A" }),
    ...getNesButtonReset({ gamepadIndex, buttonId: "B" }),

    ...getNesButtonReset({ gamepadIndex, buttonId: "Select" }),
    ...getNesButtonReset({ gamepadIndex, buttonId: "Start" }),
  ];
};

export const getNesGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getNesGamepadReset).flat();

export const aresNES: Application = {
  ...ares,
  fileExtensions: [".nes", ".fc", ".unh", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Famicom"],
    ...getNesGamepadsReset(),
  ],
};
