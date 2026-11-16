import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams, shaderCrtSetting } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getN64GamepadReset = (gamepadIndex: number) => {
  const getN64ButtonReset = getSystemGamepadButtonReset(
    "Nintendo64/Input/Controller.Port.",
    "Gamepad",
  );

  return [
    ...getN64ButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getN64ButtonReset({ gamepadIndex, buttonId: "A" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "B" }),

    ...getN64ButtonReset({ gamepadIndex, buttonId: "L" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "R" }),

    ...getN64ButtonReset({ gamepadIndex, buttonId: "Z" }),

    ...getN64ButtonReset({ gamepadIndex, buttonId: "L-Up" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "L-Down" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "L-Left" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "L-Right" }),

    ...getN64ButtonReset({ gamepadIndex, buttonId: "C-Up" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "C-Down" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "C-Left" }),
    ...getN64ButtonReset({ gamepadIndex, buttonId: "C-Right" }),

    ...getN64ButtonReset({ gamepadIndex, buttonId: "Start" }),

    ...getN64ButtonReset({ gamepadIndex, buttonId: "Rumble" }),
  ];
};

export const getN64GamepadsReset = () =>
  resetUnusedVirtualGamepads(4, 0, getN64GamepadReset).flat();

const defaultResolution = "SD";

export const aresNintendo64: Application = {
  ...ares,
  fileExtensions: [".z64", ".n64", ".v64"],
  createOptionParams: (props) => {
    const resolution = props.emulatorSettings?.resolution || defaultResolution;
    return [
      ...getSharedAresOptionParams(props),
      ...["--system", "Nintendo 64"],
      ...["--setting", `Video/Quality=${resolution}`],
      ...getN64GamepadsReset(),
    ];
  },
  settings: [
    shaderCrtSetting,
    {
      id: "resolution",
      label: "Internal Resolution",
      options: [
        { name: "Native", value: defaultResolution },
        { name: "2x", value: "HD" },
        { name: "4x", value: "UHD" },
      ],
    },
  ],
};
