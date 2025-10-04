import type { Application, OptionParamFunction } from "../../types.js";
import { isWindows } from "../../../operationsystem.server.js";
import nodepath from "node:path";
import { getVirtualGamepadsSaturn } from "./VirtualGamepadSaturn.js";
import { getVirtualGamepadsPcEngine } from "./VirtualGamepadPcEngine.js";
import { getKeyboardKey } from "./keyboardConfig.js";
import { applicationId, bundledPath, flatpakId } from "./definitions.js";
import { log } from "../../../debug.server.js";
import { getGamepads } from "./initGamepadIDs.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { homedir } from "node:os";

const getSharedMednafenOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
}) => {
  const hotkeySave = ["-command.save_state", getKeyboardKey("F1")];
  const hotkeyLoad = ["-command.load_state", getKeyboardKey("F3")];
  const hotkeyHelp = ["-command.toggle_help", getKeyboardKey("F2")];
  const hotkeyCommandKey = ["-command.input_configc", getKeyboardKey("F4")];
  const hotkeySyncAnalog = ["-command.input_config_abd", getKeyboardKey("F5")];
  const hotkeyFullscreen = ["-command.toggle_fs", getKeyboardKey("F11")];
  const disabledHotkeys = [
    "-command.togglenetview",
    "",
    "-command.0",
    "",
    "-command.8",
    "",
    "-command.9",
    "",
  ];
  const soundDevice = !isWindows()
    ? ["-sound.device", "sexyal-literal-default"]
    : [];
  const setFullscreen = fullscreen ? ["-video.fs", "1"] : ["-video.fs", "0"];

  return [
    ...hotkeyHelp,
    ...hotkeyCommandKey,
    ...hotkeyFullscreen,
    ...hotkeySyncAnalog,
    ...disabledHotkeys,
    ...hotkeySave,
    ...hotkeyLoad,
    ...soundDevice,
    ...setFullscreen,
  ];
};

const getConfigFileBasePath = () =>
  isWindows()
    ? nodepath.join(bundledEmulatorsPathBase, applicationId)
    : nodepath.join(homedir(), `.${applicationId}`);

export const mednafen: Application = {
  id: applicationId,
  name: "Mednafen",
  fileExtensions: [".cue", ".zip"],
  configFile: {
    basePath: getConfigFileBasePath(),
    files: ["mednafen.cfg", "cheats", "firmware", "sav"],
  },
  flatpakId,
  defineEnvironmentVariables: () => {
    const environmentVariables: Record<string, string> = {
      SDL_ENABLE_SCREEN_KEYBOARD: "0",
    };

    if (isWindows()) {
      environmentVariables.MEDNAFEN_HOME = nodepath.dirname(
        nodepath.join(bundledEmulatorsPathBase, bundledPath),
      );
      environmentVariables.MEDNAFEN_NOPOPUPS = "1";
    }
    return environmentVariables;
  },
  createOptionParams: getSharedMednafenOptionParams,
  bundledPath,
};

export const mednafenSaturn: Application = {
  ...mednafen,
  createOptionParams: (props) => {
    const gamepads = getGamepads();
    const virtualGamepadsSaturn = getVirtualGamepadsSaturn(gamepads);
    log("debug", "createOptionParams", virtualGamepadsSaturn);
    return [
      ...["-force_module", "ss"],
      ...mednafen.createOptionParams!(props),
      ...virtualGamepadsSaturn,
    ];
  },
};

export const mednafenPcEngineCD: Application = {
  ...mednafen,
  createOptionParams: (props) => {
    const gamepads = getGamepads();
    const virtualGamepadsPcEngine = getVirtualGamepadsPcEngine(gamepads);
    log("debug", "createOptionParams", virtualGamepadsPcEngine);
    return [
      ...["-force_module", "pce"],
      ...["-pce.cddavolume", "100"], // music
      ...["-pce.cdpsgvolume", "50"], // shooting
      ...["-pce.adpcmvolume", "50"], // explosions
      ...mednafen.createOptionParams!(props),
      ...virtualGamepadsPcEngine,
    ];
  },
};
