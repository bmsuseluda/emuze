import type { Application, OptionParamFunction } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import nodepath from "node:path";
import { getKeyboardKey } from "./keyboardConfig.js";
import { handleOperatingSystem } from "../../../operationsystem.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { envPaths } from "../../../envPaths.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { getMouse } from "./mouseConfig.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import { SystemSetting } from "../../../settings.server.js";
import {
  ApplicationHotkeys,
  Hotkey,
  hotkeysDefinition,
} from "../../../../types/hotkeys.js";

const applicationId: ApplicationId = "ares";

const bundledPath = handleOperatingSystem({
  windows: nodepath.join(applicationId, "ares.exe"),
  mac: nodepath.join(applicationId, "ares.app"),
  linux: nodepath.join(applicationId, `${applicationId}.AppImage`),
});

const defaultShader = "None";

export const shaderCrtSetting = {
  id: "shader",
  label: "Shader",
  options: [
    { name: "Off", value: defaultShader },
    { name: "CRT Royale", value: "crt/crt-royale" },
    { name: "CRT Geom", value: "crt/crt-geom" },
    { name: "CRT Lottes", value: "crt/crt-lottes" },
    { name: "CRT Guest Advanced", value: "crt/crt-guest-advanced-hd" },
  ],
} satisfies SystemSetting;

export const shaderLcdSetting = {
  id: "shader",
  label: "Shader",
  options: [
    { name: "Off", value: defaultShader },
    { name: "LCD 3x", value: "handheld/lcd3x" },
    { name: "Bevel", value: "handheld/bevel" },
  ],
} satisfies SystemSetting;

const hotkeys: ApplicationHotkeys = {
  Rewind: "Rewind",
  "Fast Forward": "ToggleFastForward",
  "Load State": "LoadState",
  "Save State": "SaveState",
  Fullscreen: "ToggleFullscreen",
};

const getHotkeyParams = () =>
  Object.entries(hotkeys).flatMap(([key, value]) => [
    "--setting",
    `Hotkey/${value}=${getKeyboardKey(hotkeysDefinition[key as Hotkey].keyboard)}`,
  ]);

export const getSharedAresOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
  categoryData: { id },
  hasAnalogStick,
  emulatorSettings,
}) => {
  const activateRewind = ["--setting", "General/Rewind=true"];
  const inputSDL = ["--setting", "Input/Driver=SDL"];
  const autoSaveMemory = ["--setting", "General/AutoSaveMemory=true"];
  const shader = ["--shader", emulatorSettings?.shader || defaultShader];

  const optionParams = [
    ...getHotkeyParams(),
    ...activateRewind,
    ...inputSDL,
    ...autoSaveMemory,
    ...shader,
    ...getVirtualGamepads(id, hasAnalogStick),
    ...getMouse(),
    "--no-file-prompt",
  ];
  if (fullscreen) {
    optionParams.push("--kiosk");
    optionParams.push("--pseudofullscreen");
  }
  return optionParams;
};

const getConfigFileBasePath = () => {
  const windowsConfigFolder = nodepath.join(
    bundledEmulatorsPathBase,
    applicationId,
  );
  const { data } = envPaths("ares", { suffix: "" });

  return handleOperatingSystem({
    windows: nodepath.join(windowsConfigFolder),
    linux: nodepath.join(data),
  });
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
  hotkeys,
};
