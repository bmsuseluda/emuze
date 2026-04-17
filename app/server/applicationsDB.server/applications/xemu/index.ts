import nodepath from "node:path";
import fs from "node:fs";
import sdl from "@kmamal/sdl";
import type { ApplicationId } from "../../applicationId.js";
import type { Application, DetectedRequiredFile } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { log } from "../../../debug.server.js";
import type { SectionReplacement, ParamToReplace } from "../../configFile.js";
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
import { sdlGameControllerConfig } from "../../environmentVariables.js";

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

const replaceSysFilesConfig =
  (
    biosFiles: DetectedRequiredFile[],
    otherRequiredFiles: DetectedRequiredFile[],
  ): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[sys.files]", [
      { keyValue: `flashrom_path = '${biosFiles.at(0)!.filePath}'` },
      ...otherRequiredFiles.map<ParamToReplace>(({ type, filePath }) => ({
        keyValue: `${type}_path = '${filePath}'`,
      })),
    ]);

const replaceConfigFile = (
  biosFiles: DetectedRequiredFile[],
  otherRequiredFiles: DetectedRequiredFile[],
) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceGeneralConfig,
    replaceGeneralUpdatesConfig,
    replaceInputBindingsConfig,
    replaceKeyboardControllerConfig,
    replaceSysFilesConfig(biosFiles, otherRequiredFiles),
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

const requiredFileTypes = {
  bootRom: "bootrom",
  hdd: "hdd",
};

export const xemu: Application = {
  id: applicationId,
  name: "xemu",
  fileExtensions: [".iso", ".xiso"],
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
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
    biosFiles,
    otherRequiredFiles,
  }) => {
    replaceConfigFile(biosFiles!, otherRequiredFiles!);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-full-screen");
    }
    optionParams.push(...["-dvd_path", absoluteEntryPath]);
    return optionParams;
  },
  bundledPath,
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        {
          filename: "Complex_4627v1.03.bin",
          hash: "1de4c87effe40d44f95581d204f9fa0600fbd5fe2171692316dcf97af0f4113f",
        },
        {
          filename: "Complex_4627.bin",
          hash: "34f1c8ded59116436065783f8ad2ef0939df3cbfc76277ec9e5c41bf9ccb93cd",
        },
      ],
    },
  ],
  otherRequiredFiles: [
    {
      type: requiredFileTypes.bootRom,
      requiredFiles: [
        {
          filename: "mcpx_1.0.bin",
          hash: "e99e3a772bf5f5d262786aee895664eb96136196e37732fe66e14ae062f20335",
        },
      ],
    },
    {
      type: requiredFileTypes.hdd,
      requiredFiles: [{ filename: "xbox_hdd.qcow2" }],
    },
  ],
};
