import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

export const getGameboyAdvanceGamepadReset = () => {
  const getGameboyAdvanceButtonReset = getSystemGamepadButtonReset(
    "GameBoyAdvance/Input/Game.Boy.Advance",
    "Controls",
  );

  return [
    ...getGameboyAdvanceButtonReset({ buttonId: "Left" }),
    ...getGameboyAdvanceButtonReset({ buttonId: "Right" }),
    ...getGameboyAdvanceButtonReset({ buttonId: "Up" }),
    ...getGameboyAdvanceButtonReset({ buttonId: "Down" }),

    ...getGameboyAdvanceButtonReset({ buttonId: "A" }),
    ...getGameboyAdvanceButtonReset({ buttonId: "B" }),
    ...getGameboyAdvanceButtonReset({ buttonId: "L" }),
    ...getGameboyAdvanceButtonReset({ buttonId: "R" }),

    ...getGameboyAdvanceButtonReset({ buttonId: "Select" }),
    ...getGameboyAdvanceButtonReset({ buttonId: "Start" }),

    ...getGameboyAdvanceButtonReset({ buttonId: "Rumble" }),
  ];
};

export const aresGameBoyAdvance: Application = {
  ...ares,
  fileExtensions: [".gba", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...[
      "--setting",
      `GameBoyAdvance/Firmware/BIOS.World=${props.biosFiles!.at(0)!.filePath}`,
    ],
    ...["--system", "Game Boy Advance"],
    ...getGameboyAdvanceGamepadReset(),
  ],
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        {
          filename: "gba_bios.bin",
          hash: "fd2547724b505f487e6dcb29ec2ecff3af35a841a77ab2e85fd87350abd36570",
        },
      ],
    },
  ],
  bundledBiosOpenSource: true,
};
