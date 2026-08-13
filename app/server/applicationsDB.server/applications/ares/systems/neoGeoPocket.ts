import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

export const getNeoGeoPocketGamepadReset = () => {
  const getNeoGeoPocketButtonReset = getSystemGamepadButtonReset(
    "NeoGeoPocket/Input/Neo.Geo.Pocket",
    "Controls",
  );

  return [
    ...getNeoGeoPocketButtonReset({ buttonId: "Left" }),
    ...getNeoGeoPocketButtonReset({ buttonId: "Right" }),
    ...getNeoGeoPocketButtonReset({ buttonId: "Up" }),
    ...getNeoGeoPocketButtonReset({ buttonId: "Down" }),

    ...getNeoGeoPocketButtonReset({ buttonId: "A" }),
    ...getNeoGeoPocketButtonReset({ buttonId: "B" }),

    ...getNeoGeoPocketButtonReset({ buttonId: "Option" }),
    ...getNeoGeoPocketButtonReset({ buttonId: "Power" }),
  ];
};

export const aresNeoGeoPocket: Application = {
  ...ares,
  fileExtensions: [".ngp", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...[
      "--setting",
      `NeoGeoPocket/Firmware/BIOS.World=${props.biosFiles!.at(0)!.filePath}`,
    ],
    ...["--system", "Neo Geo Pocket"],
    ...getNeoGeoPocketGamepadReset(),
  ],
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        {
          filename: "ngpbios.rom",
          hash: "0293555b21c4fac516d25199df7809b26beeae150e1d4504a050db32264a6ad7",
        },
      ],
    },
  ],
};
