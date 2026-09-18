import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

export const getGameGearGamepadReset = () => {
  const getGameGearButtonReset = getSystemGamepadButtonReset(
    "GameGear/Input/Game.Gear",
    "Controls",
  );

  return [
    ...getGameGearButtonReset({ buttonId: "Left" }),
    ...getGameGearButtonReset({ buttonId: "Right" }),
    ...getGameGearButtonReset({ buttonId: "Up" }),
    ...getGameGearButtonReset({ buttonId: "Down" }),

    ...getGameGearButtonReset({ buttonId: "1" }),
    ...getGameGearButtonReset({ buttonId: "2" }),

    ...getGameGearButtonReset({ buttonId: "Start" }),
  ];
};

export const aresGameGear: Application = {
  ...ares,
  fileExtensions: [".gg", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Game Gear"],
    ...getGameGearGamepadReset(),
  ],
};
