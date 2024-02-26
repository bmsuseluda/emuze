import type {
  Application,
  OptionParamFunction,
} from "~/server/applicationsDB.server/types";

const getSharedAresOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
}) => {
  // keyboard f2
  const hotkeyFullscreen = ["--setting", "Hotkey/ToggleFullscreen=0x1/0/2"];
  const virtualPad = [
    "--setting",
    "Input/Driver=SDL",
    "--setting",
    "VirtualPad1/Pad.Up=0x3/1/1/Lo;;",
    "--setting",
    "VirtualPad1/Pad.Down=0x3/1/1/Hi;;",
    "--setting",
    "VirtualPad1/Pad.Left=0x3/1/0/Lo;;",
    "--setting",
    "VirtualPad1/Pad.Right=0x3/1/0/Hi;;",
    "--setting",
    "VirtualPad1/Select=0x3/3/6;;",
    "--setting",
    "VirtualPad1/Start=0x3/3/7;;",
    "--setting",
    "VirtualPad1/A..South=0x3/3/0;;",
    "--setting",
    "VirtualPad1/B..East=0x3/3/1;;",
    "--setting",
    "VirtualPad1/X..West=0x3/3/2;;",
    "--setting",
    "VirtualPad1/Y..North=0x3/3/3;;",
    "--setting",
    "VirtualPad1/L-Bumper=0x3/3/4;;",
    "--setting",
    "VirtualPad1/R-Bumper=0x3/3/5;;",
    "--setting",
    "VirtualPad1/L-Trigger=0x3/0/2/Hi;;",
    "--setting",
    "VirtualPad1/R-Trigger=0x3/0/5/Hi;;",
    "--setting",
    "VirtualPad1/L-Stick..Click=0x3/3/9;;",
    "--setting",
    "VirtualPad1/R-Stick..Click=0x3/3/10;;",
    "--setting",
    "VirtualPad1/L-Up=0x3/0/1/Lo;;",
    "--setting",
    "VirtualPad1/L-Down=0x3/0/1/Hi;;",
    "--setting",
    "VirtualPad1/L-Left=0x3/0/0/Lo;;",
    "--setting",
    "VirtualPad1/L-Right=0x3/0/0/Hi;;",
    "--setting",
    "VirtualPad1/R-Up=0x3/0/4/Lo;;",
    "--setting",
    "VirtualPad1/R-Down=0x3/0/4/Hi;;",
    "--setting",
    "VirtualPad1/R-Left=0x3/0/3/Lo;;",
    "--setting",
    "VirtualPad1/R-Right=0x3/0/3/Hi;;",
  ];
  const optionParams = [...hotkeyFullscreen, ...virtualPad];
  if (fullscreen) {
    optionParams.push("--fullscreen");
  }
  return optionParams;
};

export const ares: Application = {
  id: "ares",
  name: "Ares",
  fileExtensions: [
    ".z64",
    ".sms",
    ".gg",
    ".chd",
    ".nes",
    ".sgd",
    ".smd",
    ".gb",
    ".gba",
    ".cue",
    ".pce",
  ],
  flatpakId: "dev.ares.ares",
  createOptionParams: getSharedAresOptionParams,
};

export const aresMegaDrive: Application = {
  ...ares,
  id: "aresMegaDrive",
  fileExtensions: [".sfc", ".smc", ".68K", ".bin"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega Drive"],
  ],
};

export const aresSegaCd: Application = {
  ...ares,
  id: "aresSegaCd",
  fileExtensions: [".chd", ".cue"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega CD"],
  ],
};

export const aresSega32x: Application = {
  ...ares,
  id: "aresSega32x",
  fileExtensions: [".32x"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega 32X"],
  ],
};
