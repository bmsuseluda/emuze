import type { Application, OptionParamFunction } from "../../types.js";
import { isWindows } from "../../../operationsystem.server.js";
import nodepath from "node:path";
import { getVirtualGamepadsSaturn } from "./VirtualGamepadSaturn.js";
import { getVirtualGamepadsPcEngine } from "./VirtualGamepadPcEngine.js";
import { getKeyboardKey } from "./keyboardConfig.js";
import { flatpakId, flatpakOptionParams } from "./definitions.js";
import { log } from "../../../debug.server.js";

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
  const setFullscreen = fullscreen ? ["-video.fs", "1"] : [];

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

export const mednafen: Application = {
  id: "mednafen",
  name: "Mednafen",
  fileExtensions: [".cue", ".pce", ".nes", ".sms", ".gg"],
  flatpakId,
  flatpakOptionParams,
  executable: "mednafen.exe",
  defineEnvironmentVariables: ({ applicationPath }) => {
    const environmentVariables = {};
    if (isWindows() && applicationPath) {
      return {
        ...environmentVariables,
        MEDNAFEN_HOME: nodepath.dirname(applicationPath),
        MEDNAFEN_NOPOPUPS: 1,
      };
    }
    return environmentVariables;
  },
  createOptionParams: getSharedMednafenOptionParams,
};

export const mednafenSaturn: Application = {
  ...mednafen,
  id: "mednafenSaturn",
  createOptionParams: (props) => {
    const virtualGamepadsSaturn = getVirtualGamepadsSaturn(
      props.applicationPath,
    );
    log("debug", "createOptionParams", virtualGamepadsSaturn);
    return [...mednafen.createOptionParams!(props), ...virtualGamepadsSaturn];
  },
};

export const mednafenPcEngineCD: Application = {
  ...mednafen,
  id: "mednafenPcEngineCD",
  createOptionParams: (props) => {
    const virtualGamepadsPcEngine = getVirtualGamepadsPcEngine(
      props.applicationPath,
    );
    log("debug", "createOptionParams", virtualGamepadsPcEngine);
    return [
      ...["-pce.cddavolume", "100"], // music
      ...["-pce.cdpsgvolume", "50"], // shooting
      ...["-pce.adpcmvolume", "50"], // explosions
      ...mednafen.createOptionParams!(props),
      ...virtualGamepadsPcEngine,
    ];
  },
};

export const mednafenPcEngineSuperGrafx: Application = {
  ...mednafen,
  id: "mednafenPcEngineSuperGrafx",
};
