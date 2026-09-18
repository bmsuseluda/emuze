import { resetUnusedVirtualGamepads } from "../../../resetUnusedVirtualGamepads.js";
import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

const getSegaMegaLdGamepadReset = (gamepadIndex: number) => {
  const getSegaMegaLdButtonReset = getSystemGamepadButtonReset(
    "LaserActiveSEGAPAC/Input/Controller.Port.",
    "Fighting.Pad",
  );

  return [
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "Left" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "Right" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "Up" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "Down" }),

    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "A" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "B" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "C" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "X" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "Y" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "Z" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "Mode" }),
    ...getSegaMegaLdButtonReset({ gamepadIndex, buttonId: "Start" }),
  ];
};

export const getSegaMegaLdGamepadsReset = () =>
  resetUnusedVirtualGamepads(2, 0, getSegaMegaLdGamepadReset).flat();

const megaLdBiosTypes = {
  us: "US",
  japan: "Japan",
};

export const aresSegaMegaLd: Application = {
  ...ares,
  fileExtensions: [".mmi"],
  createOptionParams: (props) => {
    const optionParams = [
      ...getSharedAresOptionParams(props),
      ...["--system", "LaserActive (SEGA PAC)"],
      ...getSegaMegaLdGamepadsReset(),
    ];

    props.biosFiles?.forEach(({ filePath, type }) => {
      optionParams.push(
        ...[
          "--setting",
          `LaserActiveSEGAPAC/Firmware/BIOS.${type}=${filePath}`,
        ],
      );
    });

    return optionParams;
  },
  biosFiles: [
    {
      type: megaLdBiosTypes.us,
      requiredFiles: [
        {
          filename:
            "Pioneer LaserActive Sega PAC Boot ROM v1.04 (1993)(Pioneer - Sega)(US).bin",
          hash: "e89b5a319f66406611ec82fe5c4aa6827c175a05135bd7bd177366cba0465021",
        },
        {
          filename:
            "Pioneer LaserActive Sega PAC Boot ROM v1.02 (1993)(Pioneer - Sega)(US).bin",
        },
      ],
    },
    {
      type: megaLdBiosTypes.japan,
      requiredFiles: [
        {
          filename:
            "Pioneer LaserActive Sega PAC Boot ROM v1.02 (1993)(Pioneer - Sega)(JP)(en-ja).bin",
          hash: "dca942d977217f703d8d1c6eb1aeb6b32c78ecc421486bbb46c459d385161c94",
        },
      ],
    },
  ],
};
