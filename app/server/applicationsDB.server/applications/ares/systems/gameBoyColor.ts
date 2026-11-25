import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams, shaderLcdSetting } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

export const getGameboyColorGamepadReset = () => {
  const getGameboyColorButtonReset = getSystemGamepadButtonReset(
    "GameBoyColor/Input/Game.Boy.Color",
    "Controls",
  );

  return [
    ...getGameboyColorButtonReset({ buttonId: "Left" }),
    ...getGameboyColorButtonReset({ buttonId: "Right" }),
    ...getGameboyColorButtonReset({ buttonId: "Up" }),
    ...getGameboyColorButtonReset({ buttonId: "Down" }),

    ...getGameboyColorButtonReset({ buttonId: "A" }),
    ...getGameboyColorButtonReset({ buttonId: "B" }),

    ...getGameboyColorButtonReset({ buttonId: "Select" }),
    ...getGameboyColorButtonReset({ buttonId: "Start" }),

    ...getGameboyColorButtonReset({ buttonId: "Rumble" }),
  ];
};

const defaultEmulator = "Game Boy";

export const aresGameBoy: Application = {
  ...ares,
  fileExtensions: [".gb", ".zip"],
  createOptionParams: (props) => {
    const emulator =
      props.settings.advanced["nintendogameboy/ares"]?.emulator ||
      defaultEmulator;

    return [
      ...getSharedAresOptionParams(props),
      ...["--system", emulator],
      ...getGameboyColorGamepadReset(),
    ];
  },
  settings: [
    {
      id: "emulator",
      label: "Emulator",
      options: [
        { name: "ares Game Boy", value: defaultEmulator },
        { name: "ares Game Boy Color", value: "Game Boy Color" },
      ],
    },
    shaderLcdSetting,
  ],
};

export const aresGameBoyColor: Application = {
  ...ares,
  fileExtensions: [".gb", ".gbc", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Game Boy Color"],
    ...getGameboyColorGamepadReset(),
  ],
  settings: [shaderLcdSetting],
};
