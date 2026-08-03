import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getSegaCdGamepadReset = (gamepadIndex: number) => {
  const getSegaCdButtonReset = getSystemGamepadButtonReset(
    "MegaCD/Input/Controller.Port.",
    "Control.Pad",
  );

  return [
    ...getSegaCdButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getSegaCdButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getSegaCdButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getSegaCdButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getSegaCdButtonReset({ gamepadIndex, buttonId: "A" }),
    ...getSegaCdButtonReset({ gamepadIndex, buttonId: "B" }),
    ...getSegaCdButtonReset({ gamepadIndex, buttonId: "C" }),
    ...getSegaCdButtonReset({ gamepadIndex, buttonId: "Start" }),
  ];
};

export const getSegaCdGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getSegaCdGamepadReset).flat();

const segaCdBiosTypes = {
  us: "US",
  japan: "Japan",
  europe: "Europe",
};

export const aresSegaCd: Application = {
  ...ares,
  fileExtensions: [".chd", ".cue"],
  createOptionParams: (props) => {
    const optionParams = [
      ...getSharedAresOptionParams(props),
      ...["--system", "Mega CD"],
      ...getSegaCdGamepadsReset(),
    ];

    props.biosFiles?.forEach(({ filePath, type }) => {
      optionParams.push(
        ...["--setting", `MegaCD/Firmware/BIOS.${type}=${filePath}`],
      );
    });

    return optionParams;
  },
  biosFiles: [
    {
      type: segaCdBiosTypes.us,
      requiredFiles: [
        {
          filename: "bios_CD_U.bin",
        },
        {
          filename: "us_scd2_9306.bin",
          hash: "fb477cdbf94c84424c2feca4fe40656d85393fe7b7b401911b45ad2eb991258c",
        },
      ],
    },
    {
      type: segaCdBiosTypes.europe,
      requiredFiles: [
        {
          filename: "bios_CD_E.bin",
        },
        {
          filename: "eu_mcd2_9306.bin",
          hash: "fe608a2a07676a23ab5fd5eee2f53c9e2526d69a28aa16ccd85c0ec42e6933cb",
        },
      ],
    },
    {
      type: segaCdBiosTypes.japan,
      requiredFiles: [
        {
          filename: "bios_CD_J.bin",
        },
        {
          filename: "jp_mcd2_921222.bin",
          hash: "7133fc2dd2fe5b7d0acd53a5f10f3d00b5d31270239ad20d74ef32393e24af88",
        },
      ],
    },
  ],
};
