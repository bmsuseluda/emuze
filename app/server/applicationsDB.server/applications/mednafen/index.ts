import type {Application, OptionParamFunction} from "../../types";
import {isWindows} from "../../../operationsystem.server";
import nodepath from "path";
import {getVirtualGamepadsSaturn} from "./VirtualGamepadSaturn";
import {getVirtualGamepadsPcEngine} from "./VirtualGamepadPcEngine";
import {getKeyboardKey} from "./keyboardConfig";
import {flatpakId, flatpakOptionParams} from "./definitions";

const getSharedMednafenOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
}) => {
  const hotkeySave = ["-command.save_state", getKeyboardKey("F1")];
  const hotkeyLoad = ["-command.load_state", getKeyboardKey("F3")];
  const hotkeyCommandKey = ["-command.input_configc", getKeyboardKey("F2")];
  const hotkeyFullscreen = ["-command.toggle_fs", getKeyboardKey("F11")];
  const soundDevice = !isWindows()
    ? ["-sound.device", "sexyal-literal-default"]
    : [];
  const setFullscreen = fullscreen ? ["-command.video.fs", "1"] : [];

  return [
    ...hotkeyCommandKey,
    ...hotkeyFullscreen,
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
      ...mednafen.createOptionParams!(props),
      ...getVirtualGamepadsPcEngine(props.applicationPath),
    ];
  },
};

export const mednafenPcEngineSuperGrafx: Application = {
  ...mednafen,
  id: "mednafenPcEngineSuperGrafx",
};
