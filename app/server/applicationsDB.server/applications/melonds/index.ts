import nodepath from "node:path";
import fs from "node:fs";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { isWindows } from "../../../operationsystem.server.js";
import { EOL, homedir } from "node:os";
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
import { getPlayerId, getVirtualGamepad } from "./getVirtualGamepad.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";

const flatpakId = "net.kuribo64.melonDS";
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

const replaceJoystickConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Instance0.Joystick]", [...getVirtualGamepad()]);

const replaceInstanceConfig: SectionReplacement = (sections) => {
  const playerId = getPlayerId();
  return replaceSection(sections, "[Instance0]", [
    { keyValue: `JoystickID = ${playerId}` },
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

const getConfigFileBasePath = () => {
  if (isWindows()) {
    return nodepath.join(homedir(), "AppData", "Roaming", "melonDS");
  } else {
    const { config } = envPaths("melonDS", { suffix: "" });
    return nodepath.join(config);
  }
};

export const melonds: Application = {
  id: applicationId,
  name: "melonDS",
  fileExtensions: [".nds"],
  flatpakId,
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
