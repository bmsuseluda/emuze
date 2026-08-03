import { Application } from "../../../types.js";
import { ares, getSharedAresOptionParams } from "../index.js";
import { getSystemGamepadButtonReset } from "../systemSpecificGamepadReset.js";

export const getNeoGeoPocketColorGamepadReset = () => {
  const getNeoGeoPocketColorButtonReset = getSystemGamepadButtonReset(
    "NeoGeoPocketColor/Input/Neo.Geo.Pocket.Color",
    "Controls",
  );

  return [
    ...getNeoGeoPocketColorButtonReset({ buttonId: "Left" }),
    ...getNeoGeoPocketColorButtonReset({ buttonId: "Right" }),
    ...getNeoGeoPocketColorButtonReset({ buttonId: "Up" }),
    ...getNeoGeoPocketColorButtonReset({ buttonId: "Down" }),

    ...getNeoGeoPocketColorButtonReset({ buttonId: "A" }),
    ...getNeoGeoPocketColorButtonReset({ buttonId: "B" }),

    ...getNeoGeoPocketColorButtonReset({ buttonId: "Option" }),
    ...getNeoGeoPocketColorButtonReset({ buttonId: "Power" }),
  ];
};

export const aresNeoGeoPocketColor: Application = {
  ...ares,
  fileExtensions: [".ngc", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...[
      "--setting",
      `NeoGeoPocketColor/Firmware/BIOS.World=${props.biosFiles!.at(0)!.filePath}`,
    ],
    ...["--system", "Neo Geo Pocket Color"],
    ...getNeoGeoPocketColorGamepadReset(),
  ],
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        {
          filename: "ngpcbios.rom",
          hash: "8fb845a2f71514cec20728e2f0fecfade69444f8d50898b92c2259f1ba63e10d",
        },
      ],
    },
  ],
};
