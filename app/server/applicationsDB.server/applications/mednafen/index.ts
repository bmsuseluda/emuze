import type { Application, OptionParamFunction } from "../../types";
import { isWindows } from "../../../operationsystem.server";
import nodepath from "path";
import { getVirtualGamepadsSaturn } from "./VirtualGamepadSaturn";
import { getVirtualGamepadsPcEngine } from "./VirtualGamepadPcEngine";
import { getKeyboardKey } from "./keyboardConfig";

const getSharedMednafenOptionParams: OptionParamFunction = () => {
  const hotkeySave = ["-command.save_state", getKeyboardKey("F1")];
  const hotkeyLoad = ["-command.load_state", getKeyboardKey("F3")];
  const hotkeyCommandKey = ["-command.input_configc", getKeyboardKey("F2")];
  const hotkeyFullscreen = ["-command.toggle_fs", getKeyboardKey("F11")];

  return [
    ...hotkeyCommandKey,
    ...hotkeyFullscreen,
    ...hotkeySave,
    ...hotkeyLoad,
  ];
};

export const mednafen: Application = {
  id: "mednafen",
  name: "Mednafen",
  fileExtensions: [".cue", ".pce", ".nes", ".sms", ".gg"],
  flatpakId: "com.github.AmatCoder.mednaffe",
  flatpakOptionParams: ["--command=mednafen"],
  defineEnvironmentVariables: ({ applicationPath }) => {
    const environmentVariables = {};
    if (isWindows() && applicationPath) {
      return {
        ...environmentVariables,
        MEDNAFEN_HOME: nodepath.dirname(applicationPath),
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
      ...getSharedMednafenOptionParams(props),
      ...getVirtualGamepadsSaturn(),
    ];
  },
};

export const mednafenPcEngineCD: Application = {
  ...mednafen,
  id: "mednafenPcEngineCD",
  createOptionParams: (props) => {
    return [
      ...getSharedMednafenOptionParams(props),
      ...getVirtualGamepadsPcEngine(),
    ];
  },
};

export const mednafenPcEngineSuperGrafx: Application = {
  ...mednafen,
  id: "mednafenPcEngineSuperGrafx",
};
