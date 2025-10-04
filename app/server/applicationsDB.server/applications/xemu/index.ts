import nodepath from "node:path";
import fs from "node:fs";
import sdl from "@kmamal/sdl";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { log } from "../../../debug.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL, homedir } from "node:os";
import { isWindows } from "../../../operationsystem.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { getKeyboardButtonMappings } from "./keyboardConfig.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";

const flatpakId = "app.xemu.xemu";
const applicationId: ApplicationId = "xemu";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "xemu.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const configFileName = "xemu.toml";
const getConfigFilePath = () =>
  nodepath.join(emulatorsConfigDirectory, applicationId, configFileName);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "xemu",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return ``;
  }
};

const replaceGeneralConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[general]", [{ keyValue: "show_welcome = false" }]);

const replaceGeneralUpdatesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[general.updates]", [
    { keyValue: "check = false" },
  ]);

const replaceInputBindingsConfig: SectionReplacement = (sections) => {
  const virtualGamepads = getVirtualGamepads();

  return replaceSection(
    sections,
    "[input.bindings]",
    [...virtualGamepads, { keyValue: `guide = ${sdl.keyboard.SCANCODE.F2}` }],
    true,
  );
};

const replaceKeyboardControllerConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[input.keyboard_controller_scancode_map]", [
    ...getKeyboardButtonMappings(),
  ]);

const replaceConfigFile = () => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceGeneralConfig,
    replaceGeneralUpdatesConfig,
    replaceInputBindingsConfig,
    replaceKeyboardControllerConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = () => {
  if (isWindows()) {
    return nodepath.join(homedir(), "AppData", "Roaming", "xemu", "xemu");
  } else {
    const { data } = envPaths("xemu", { suffix: "" });

    return nodepath.join(data, "xemu");
  }
};

export const xemu: Application = {
  id: applicationId,
  name: "xemu",
  fileExtensions: [".iso", ".xiso"],
  flatpakId,
  omitAbsoluteEntryPathAsLastParam: true,
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [configFileName],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
  }) => {
    replaceConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-full-screen");
    }
    optionParams.push(...["-dvd_path", absoluteEntryPath]);
    return optionParams;
  },
  bundledPath,
};
