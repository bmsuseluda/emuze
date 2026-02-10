import type { Application } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import nodepath from "node:path";
import { log } from "../../../debug.server.js";
import { EOL } from "node:os";
import { keyboardConfig } from "./keyboardConfig.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import fs from "node:fs";
import { defaultSettings } from "./defaultSettings.js";
import { envPaths } from "../../../envPaths.server.js";
import { isWindows } from "../../../operationsystem.server.js";
import { disableSetting, getSetting } from "./getSettings.js";
import { getGamepad, getVirtualGamepad } from "./getVirtualGamepad.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const flatpakId = "io.github.lime3ds.Lime3DS";
const applicationId: ApplicationId = "azahar";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "azahar.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const configFileName = "qt-config.ini";

const getConfigFilePath = () =>
  nodepath.join(emulatorsConfigDirectory, applicationId, configFileName);

export const replaceGamepadConfig: SectionReplacement = (sections) => {
  const gamepad = getGamepad();
  const virtualGamepad = gamepad ? getVirtualGamepad(gamepad) : keyboardConfig;

  return replaceSection(sections, "[Controls]", virtualGamepad);
};

export const replaceMiscellaneousConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Miscellaneous]", [
    ...getSetting("check_for_update_on_start", false),
  ]);

// TODO: implement `disable param with same value` with setting the default value
export const replaceUiConfig =
  (n3dsRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[UI]", [
      ...getSetting("confirmClose", false),
      ...getSetting(
        "Shortcuts\\Main%20Window\\Fullscreen\\KeySeq",
        "F2",
        false,
      ),
      ...getSetting(
        "Shortcuts\\Main%20Window\\Quick%20Save\\KeySeq",
        "F1",
        false,
      ),
      ...getSetting(
        "Shortcuts\\Main%20Window\\Quick%20Load\\KeySeq",
        "F3",
        false,
      ),
      ...disableSetting("Shortcuts\\Main%20Window\\Load%20Amiibo\\KeySeq"),
      ...disableSetting("Shortcuts\\Main%20Window\\Remove%20Amiibo\\KeySeq"),
      ...getSetting("firstStart", false),
      ...getSetting("saveStateWarning", false),
      { keyValue: `Paths\\romsPath=${n3dsRomsPath}` },
      { keyValue: "fullscreen\\default=true" },
    ]);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "azahar",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

export const replaceConfigSections = (n3dsRomsPath: string) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceUiConfig(n3dsRomsPath),
    replaceGamepadConfig,
    replaceMiscellaneousConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = () => {
  if (isWindows()) {
    const { config } = envPaths("Azahar", { suffix: "" });
    return nodepath.join(config);
  } else {
    const { config } = envPaths("azahar", { suffix: "emu" });
    return nodepath.join(config);
  }
};

export const azahar: Application = {
  id: applicationId,
  name: "Azahar",
  fileExtensions: [".cci", ".zcia", ".zcci", ".z3dsx", ".zcxi", ".3ds"],
  flatpakId,
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [configFileName],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const n3dsRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(n3dsRomsPath);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
  bundledPath,
};
