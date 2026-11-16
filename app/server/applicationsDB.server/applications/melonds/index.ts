import nodepath from "node:path";
import fs from "node:fs";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { handleOperatingSystem } from "../../../operationsystem.server.js";
import { EOL } from "node:os";
import { log } from "../../../debug.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { defaultSettings } from "./defaultSettings.js";
import { replaceKeyboardConfig } from "./keyboardConfig.js";
import { getVirtualGamepad } from "./getVirtualGamepad.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import { EmuzeController, getControllers } from "../../../gamepad.server.js";
import { gamepadPs4Joystick } from "../../../../types/gamepad.js";

const applicationId: ApplicationId = "melonds";

const bundledPath = handleOperatingSystem({
  windows: nodepath.join(applicationId, "melonDS.exe"),
  mac: nodepath.join(applicationId, "melonDS.app"),
  linux: nodepath.join(applicationId, `melonDS-x86_64.AppImage`),
});

const configFileName = "melonDS.toml";

const getConfigFilePath = () =>
  nodepath.join(emulatorsConfigDirectory, applicationId, configFileName);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "melonDS",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

const replaceJoystickConfig =
  (emuzeController?: EmuzeController): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[Instance0.Joystick]", [
      ...getVirtualGamepad(emuzeController),
    ]);

const isGamepadWithTwoInstances = (emuzeController?: EmuzeController) =>
  emuzeController?.hasSteamHandle &&
  emuzeController.vendor === gamepadPs4Joystick.vendor &&
  (emuzeController.joystickName.includes("4") ||
    emuzeController.product === gamepadPs4Joystick.product);

const replaceInstanceConfig =
  (emuzeController?: EmuzeController): SectionReplacement =>
  (sections) => {
    const joystickId = isGamepadWithTwoInstances(emuzeController) ? 1 : 0;
    return replaceSection(sections, "[Instance0]", [
      { keyValue: `JoystickID = ${joystickId}` },
    ]);
  };

const replace3dGlConfig =
  (resolution: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[3D.GL]", [
      { keyValue: `ScaleFactor = ${resolution}` },
    ]);

export const replace3dConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[3D]", [{ keyValue: "Renderer = 2" }]);

const replaceConfigFile = (resolution: string) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const emuzeController = getControllers().at(0);

  const fileContentNew = chainSectionReplacements(
    sections,
    replace3dConfig,
    replace3dGlConfig(resolution),
    replaceInstanceConfig(emuzeController),
    replaceKeyboardConfig,
    replaceJoystickConfig(emuzeController),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = handleOperatingSystem({
  windows: () => {
    return nodepath.join(bundledEmulatorsPathBase, applicationId);
  },
  linux: () => {
    const { config } = envPaths("melonDS", { suffix: "" });
    return nodepath.join(config);
  },
});

const defaultResolution = "1";

export const melonds: Application = {
  id: applicationId,
  name: "melonDS",
  fileExtensions: [".nds"],
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [configFileName],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      advanced,
    },
  }) => {
    const resolution =
      advanced["nintendods/melonds"]?.resolution || defaultResolution;

    replaceConfigFile(resolution);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
  bundledPath,
  settings: [
    {
      id: "resolution",
      label: "Internal Resolution",
      options: [
        { name: "Native", value: defaultResolution },
        { name: "2x (512x384)", value: "2" },
        { name: "3x (768x576)", value: "3" },
        { name: "4x (1024x768)", value: "4" },
        { name: "5x (1280x960)", value: "5" },
        { name: "6x (1536x1152)", value: "6" },
        { name: "7x (1792x1344)", value: "7" },
        { name: "8x (2048x1536)", value: "8" },
        { name: "9x (2304x1728)", value: "9" },
        { name: "10x (2560x1920)", value: "10" },
      ],
    },
  ],
};
