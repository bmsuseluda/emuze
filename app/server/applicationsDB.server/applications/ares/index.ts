import type { Application, OptionParamFunction } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import nodepath from "node:path";
import { getKeyboardKey } from "./keyboardConfig.js";
import { isWindows } from "../../../operationsystem.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { envPaths } from "../../../envPaths.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { importElectron } from "../../../importElectron.server.js";
import { commandLineOptions } from "../../../commandLine.server.js";
import { getMouse } from "./mouseConfig.js";

const applicationId: ApplicationId = "ares";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "ares.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const getSharedAresOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
  hasAnalogStick,
}) => {
  const hotkeyFullscreen = [
    "--setting",
    `Hotkey/ToggleFullscreen=${getKeyboardKey("F2")}`,
  ];
  const hotkeySave = ["--setting", `Hotkey/SaveState=${getKeyboardKey("F1")}`];
  const hotkeyLoad = ["--setting", `Hotkey/LoadState=${getKeyboardKey("F3")}`];
  const inputSDL = ["--setting", "Input/Driver=SDL"];

  const optionParams = [
    ...hotkeyFullscreen,
    ...hotkeySave,
    ...hotkeyLoad,
    ...inputSDL,
    ...getVirtualGamepads(hasAnalogStick),
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
    ...["--system", "Game Boy Advance"],
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

export const aresSegaCd: Application = {
  ...ares,
  fileExtensions: [".chd", ".cue"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega CD"],
  ],
};

export const aresSegaMegaLd: Application = {
  ...ares,
  fileExtensions: [".mmi"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega LD"],
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
    ...["--system", "Neo Geo Pocket"],
  ],
};

export const aresNeoGeoPocketColor: Application = {
  ...ares,
  fileExtensions: [".ngc", ".zip"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Neo Geo Pocket Color"],
  ],
};

export const isRmgForN64 = () => {
  const electron = importElectron();

  return (
    electron?.app?.commandLine.hasSwitch(commandLineOptions.rmgN64.id) ||
    process.env.EMUZE_RMG_N64 === "true"
  );
};
