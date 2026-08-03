import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
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

export const aresGameBoyColor: Application = {
  ...ares,
  fileExtensions: [".gb", ".gbc", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Game Boy Color"],
    ...getGameboyColorGamepadReset(),
  ],
};
