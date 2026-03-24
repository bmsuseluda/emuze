import type { Application, OptionParamFunction } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import nodepath from "node:path";
import { getKeyboardKey } from "./keyboardConfig.js";
import { isWindows } from "../../../operationsystem.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { envPaths } from "../../../envPaths.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { getMouse } from "./mouseConfig.js";

const applicationId: ApplicationId = "ares";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "ares.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const getSharedAresOptionParams: OptionParamFunction = ({
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
  flatpakId: "dev.ares.ares",
  configFile: {
    basePath: getConfigFileBasePath(),
    files: ["settings.bml"],
  },
  createOptionParams: getSharedAresOptionParams,
  bundledPath,
};

export const aresGameBoyColor: Application = {
  ...ares,
  fileExtensions: [".gb", ".gbc", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Game Boy Color"],
  ],
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
  ],
  biosFiles: [
    { type: "default", requiredFiles: [{ filename: "gba_bios.bin" }] },
  ],
};

export const aresNES: Application = {
  ...ares,
  fileExtensions: [".nes", ".fc", ".unh", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Famicom"],
  ],
};

export const aresSuperNintendo: Application = {
  ...ares,
  fileExtensions: [".sfc", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Super Famicom"],
  ],
};

export const aresNintendo64: Application = {
  ...ares,
  fileExtensions: [".z64", ".n64", ".v64"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Nintendo 64"],
  ],
};

export const aresMasterSystem: Application = {
  ...ares,
  fileExtensions: [".sms", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Master System"],
  ],
};

export const aresGameGear: Application = {
  ...ares,
  fileExtensions: [".gg", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Game Gear"],
  ],
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
  japan: "JAPAN",
  europe: "EUROPE",
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
          hash: "2efd74e3232ff260e371b99f84024f7f",
        },
        {
          filename: "us_scd2_9306.bin",
          hash: "310a9081d2edf2d316ab38813136725e",
        },
      ],
    },
    {
      type: segaCdBiosTypes.europe,
      requiredFiles: [
        {
          filename: "bios_CD_E.bin",
          hash: "e66fa1dc5820d254611fdcdba0662372",
        },
        {
          filename: "eu_mcd2_9306.bin",
          hash: "9b562ebf2d095bf1dabadbc1881f519a",
        },
      ],
    },
    {
      type: segaCdBiosTypes.japan,
      requiredFiles: [
        {
          filename: "bios_CD_J.bin",
          hash: "278a9397d192149e84e820ac621a8edd",
        },
        {
          filename: "jp_mcd2_921222.bin",
          hash: "683a8a9e273662561172468dfa2858eb",
        },
      ],
    },
  ],
};

const megaLdBiosTypes = {
  us: "US",
  japan: "JAPAN",
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
    { type: "default", requiredFiles: [{ filename: "ngpbios.rom" }] },
  ],
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
  ],
  biosFiles: [
    { type: "default", requiredFiles: [{ filename: "ngpcbios.rom" }] },
  ],
};
