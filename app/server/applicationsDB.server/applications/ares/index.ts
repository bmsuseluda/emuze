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
  // save state F1
  const hotkeySave = ["--setting", "Hotkey/SaveState=0x1/0/1"];
  // load state F3
  const hotkeyLoad = ["--setting", "Hotkey/LoadState=0x1/0/3"];
  // TODO: Check how to setup gamepad keys
  const inputSDL = ["--setting", "Input/Driver=SDL"];
  const optionParams = [
    ...hotkeyFullscreen,
    ...hotkeySave,
    ...hotkeyLoad,
    ...inputSDL,
  ];
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
