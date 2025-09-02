import nodepath from "node:path";
import fs from "node:fs";
import sdl from "@kmamal/sdl";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { isWindows } from "../../../operationsystem.server.js";
import { EOL, homedir } from "node:os";
import { log } from "../../../debug.server.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  createSdlMappingObject,
  getButtonIndex,
  getPlayerIndexArray,
  isDpadHat,
} from "../../../../types/gamepad.js";
import { defaultSettings } from "./defaultSettings.js";
import { getControllerFromJoystick } from "../../../gamepad.server.js";
import type { MelonDsButtonId } from "./types.js";
import { replaceKeyboardConfig } from "./keyboardConfig.js";

const flatpakId = "net.kuribo64.melonDS";
const applicationId: ApplicationId = "melonds";
const bundledPathLinux = nodepath.join(
  applicationId,
  `melonDS-x86_64.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "melonDS.exe");

const { config } = envPaths("melonDS", { suffix: "" });

const configFileName = "melonDS.toml";
export const getConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(
      homedir(),
      "AppData",
      "Roaming",
      "melonDS",
      configFileName,
    );
  } else {
    return nodepath.join(config, configFileName);
  }
};

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

const melonDsButtonMapping = {
  Up: "dpup",
  Left: "dpleft",
  Down: "dpdown",
  Right: "dpright",
  B: "a",
  A: "b",
  Y: "x",
  X: "y",
  Select: "back",
  Start: "start",
  L: "leftshoulder",
  R: "rightshoulder",
} satisfies Record<MelonDsButtonId, SdlButtonId>;

const getMelonDsDpadHatMapping = (melonDsButtonId: MelonDsButtonId) => {
  switch (melonDsButtonId) {
    case "Up":
      return 257;
    case "Down":
      return 260;
    case "Left":
      return 264;
    case "Right":
      return 258;
    default:
      return null;
  }
};

const getDpadButtonMapping = (
  mappingObject: SdlButtonMapping,
  melonDsButtonId: MelonDsButtonId,
): ParamToReplace => {
  const sdlButtonId = melonDsButtonMapping[melonDsButtonId];
  let buttonId;

  if (isDpadHat(mappingObject, sdlButtonId)) {
    buttonId = getMelonDsDpadHatMapping(melonDsButtonId);
  } else {
    buttonId = getButtonIndex(mappingObject, sdlButtonId);
  }

  return {
    keyValue: `${melonDsButtonId} = ${buttonId}`,
  };
};

const getButtonMapping = (
  mappingObject: SdlButtonMapping,
  melonDsButtonId: MelonDsButtonId,
): ParamToReplace => {
  const sdlButtonId = melonDsButtonMapping[melonDsButtonId];

  return {
    keyValue: `${melonDsButtonId} = ${getButtonIndex(mappingObject, sdlButtonId)}`,
  };
};

const getJoystickButtonMapping = (): ParamToReplace[] => {
  const joysticks = sdl.joystick.devices;
  if (joysticks.length > 0) {
    const playerIndex = getPlayerIndexArray(joysticks).at(0) || 0;
    const controller = getControllerFromJoystick(joysticks[playerIndex]);
    if (controller?.mapping) {
      const mappingObject = createSdlMappingObject(controller.mapping);

      return [
        getDpadButtonMapping(mappingObject, "Up"),
        getDpadButtonMapping(mappingObject, "Down"),
        getDpadButtonMapping(mappingObject, "Left"),
        getDpadButtonMapping(mappingObject, "Right"),
        getButtonMapping(mappingObject, "A"),
        getButtonMapping(mappingObject, "B"),
        getButtonMapping(mappingObject, "X"),
        getButtonMapping(mappingObject, "Y"),
        getButtonMapping(mappingObject, "L"),
        getButtonMapping(mappingObject, "R"),
        getButtonMapping(mappingObject, "Select"),
        getButtonMapping(mappingObject, "Start"),
        // TODO: how to set this?
        { keyValue: `HK_SwapScreens = 35782655` },
      ];
    }
  }

  return [];
};

const replaceJoystickConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Instance0.Joystick]", [
    ...getJoystickButtonMapping(),
  ]);

const replaceInstanceConfig: SectionReplacement = (sections) => {
  const playerIndex = getPlayerIndexArray(sdl.joystick.devices).at(0) || 0;
  return replaceSection(sections, "[Instance0]", [
    { keyValue: `JoystickID = ${playerIndex}` },
  ]);
};

const replaceConfigFile = () => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceInstanceConfig,
    replaceKeyboardConfig,
    replaceJoystickConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const melonds: Application = {
  id: applicationId,
  name: "melonDS",
  fileExtensions: [".nds"],
  flatpakId,
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
  bundledPathLinux,
  bundledPathWindows,
};
