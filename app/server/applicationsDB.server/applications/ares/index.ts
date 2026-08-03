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
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: ["settings.bml"],
  },
  createOptionParams: getSharedAresOptionParams,
  bundledPath,
};
