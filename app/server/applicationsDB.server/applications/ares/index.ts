import type { Application, OptionParamFunction } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import nodepath from "node:path";
import { getKeyboardKey } from "./keyboardConfig.js";
import { isWindows } from "../../../operationsystem.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { envPaths } from "../../../envPaths.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { getMouse } from "./mouseConfig.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const applicationId: ApplicationId = "ares";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "ares.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

export const getSharedAresOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
  categoryData: { id },
  hasAnalogStick,
}) => {
  const hotkeyFullscreen = [
    "--setting",
    `Hotkey/ToggleFullscreen=${getKeyboardKey("F2")}`,
  ];
  const hotkeySave = ["--setting", `Hotkey/SaveState=${getKeyboardKey("F1")}`];
  const hotkeyLoad = ["--setting", `Hotkey/LoadState=${getKeyboardKey("F3")}`];
  const inputSDL = ["--setting", "Input/Driver=SDL"];
  const autoSaveMemory = ["--setting", "General/AutoSaveMemory=true"];

  const optionParams = [
    ...hotkeyFullscreen,
    ...hotkeySave,
    ...hotkeyLoad,
    ...inputSDL,
    ...autoSaveMemory,
    ...getVirtualGamepads(id, hasAnalogStick),
    ...getMouse(),
    "--no-file-prompt",
  ];
  if (fullscreen) {
    optionParams.push("--fullscreen");
  }
  return optionParams;
};

const getConfigFileBasePath = () => {
  const windowsConfigFolder = nodepath.join(
    bundledEmulatorsPathBase,
    applicationId,
  );
  const { data } = envPaths("ares", { suffix: "" });

  return isWindows() ? nodepath.join(windowsConfigFolder) : nodepath.join(data);
};

export const ares: Application = {
  id: "ares",
  name: "ares",
  fileExtensions: [],
  configFile: {
    basePath: getConfigFileBasePath(),
    files: ["settings.bml"],
  },
  createOptionParams: getSharedAresOptionParams,
  bundledPath,
};

export const aresMegaDrive: Application = {
  ...ares,
  fileExtensions: [".sfc", ".smc", ".68K", ".bin", ".md", ".sgd", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega Drive"],
  ],
};

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

export const aresSega32x: Application = {
  ...ares,
  fileExtensions: [".32x", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega 32X"],
  ],
};

export const aresPcEngine: Application = {
  ...ares,
  fileExtensions: [".pce", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "PC Engine"],
  ],
};

export const aresSuperGrafx: Application = {
  ...ares,
  fileExtensions: [".pce", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "SuperGrafx"],
  ],
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

export const aresNeoGeoPocketColor: Application = {
  ...ares,
  fileExtensions: [".ngc", ".zip"],
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...[
      "--setting",
      `NeoGeoPocketColor/Firmware/BIOS.World=${props.biosFiles!.at(0)!.filePath}`,
    ],
    ...["--system", "Neo Geo Pocket Color"],
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
