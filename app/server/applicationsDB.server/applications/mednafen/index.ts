import type { Application, OptionParamFunction } from "../../types";
import { isWindows } from "../../../operationsystem.server";
import nodepath from "path";
import { getVirtualGamepadsSaturn } from "./VirtualGamepadSaturn";
import { getVirtualGamepadsPcEngine } from "./VirtualGamepadPcEngine";
import { getKeyboardKey } from "./keyboardConfig";
import { flatpakId, flatpakOptionParams } from "./definitions";

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
    return [
      ...mednafen.createOptionParams!(props),
      ...getVirtualGamepadsSaturn(props.applicationPath),
    ];
  },
};

export const mednafenPcEngineCD: Application = {
  ...mednafen,
  id: "mednafenPcEngineCD",
  createOptionParams: (props) => {
    return [
      ...["-pce.cddavolume", "100"], // music
      ...["-pce.cdpsgvolume", "50"], // shooting
      ...["-pce.adpcmvolume", "50"], // explosions
      ...mednafen.createOptionParams!(props),
      ...getVirtualGamepadsPcEngine(props.applicationPath),
    ];
  },
};

export const mednafenPcEngineSuperGrafx: Application = {
  ...mednafen,
  id: "mednafenPcEngineSuperGrafx",
};
