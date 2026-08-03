import nodepath from "node:path";
import fs from "node:fs";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { isWindows } from "../../../operationsystem.server.js";
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
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "melonDS.exe")
  : nodepath.join(applicationId, "melonDS-x86_64.AppImage");

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

const replaceConfigFile = () => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const emuzeController = getControllers().at(0);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceInstanceConfig(emuzeController),
    replaceKeyboardConfig,
    replaceJoystickConfig(emuzeController),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = () => {
  if (isWindows()) {
    return nodepath.join(bundledEmulatorsPathBase, applicationId);
  } else {
    const { config } = envPaths("melonDS", { suffix: "" });
    return nodepath.join(config);
  }
};

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
    },
  }) => {
    replaceConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
  bundledPath,
};
