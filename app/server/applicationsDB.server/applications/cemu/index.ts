import nodepath from "node:path";
import fs from "node:fs";
import type { Application } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import { isWindows } from "../../../operationsystem.server.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { log } from "../../../debug.server.js";
import { writeConfig } from "../../configFile.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { envPaths } from "../../../envPaths.server.js";
import { type ConfigFile } from "./config.js";
import { defaultConfigFull } from "./defaultConfigFull.js";

const flatpakId = "info.cemu.Cemu";
const applicationId: ApplicationId = "cemu";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "Cemu.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const defaultConfigFileName = "settings.xml";

const defaultConfigPathRelative = nodepath.join(defaultConfigFileName);

const getConfigFilePath = (configFilePathRelative: string) =>
  nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
    configFilePathRelative,
  );

const getDefaultConfigFilePath = () =>
  getConfigFilePath(defaultConfigPathRelative);

const readXmlConfigFile = (filePath: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  try {
    const file = fs.readFileSync(filePath, "utf8");
    return parser.parse(file);
  } catch (error) {
    log("debug", "cemu", "config file can not be read.", filePath, error);

    return parser.parse(defaultConfigFull);
  }
};

const readDefaultConfigFile = () =>
  readXmlConfigFile(getDefaultConfigFilePath()) as ConfigFile;

const replaceDefaultConfigFile = (wiiuRomsPath: string) => {
  const fileContent = readDefaultConfigFile();

  const fileContentNew: ConfigFile = {
    ...fileContent,
    content: {
      ...fileContent?.content,
      check_update: false,
      GamePaths: {
        Entry: wiiuRomsPath,
      },
    },
  };

  const builder = new XMLBuilder({ ignoreAttributes: false, format: true });
  const xmlContent = builder.build(fileContentNew);

  writeConfig(getDefaultConfigFilePath(), xmlContent);
};

const getConfigFileBasePath = () => {
  const windowsConfigFolder = nodepath.join(
    bundledEmulatorsPathBase,
    applicationId,
  );
  const { config } = envPaths("Cemu", { suffix: "" });

  return isWindows()
    ? nodepath.join(windowsConfigFolder)
    : nodepath.join(config);
};

export const cemu: Application = {
  id: applicationId,
  name: "Cemu",
  entryAsDirectory: true,
  flatpakId,
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [defaultConfigPathRelative],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
    absoluteEntryPath,
  }) => {
    const wiiuRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceDefaultConfigFile(wiiuRomsPath);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }

    log("debug", "entryPath", absoluteEntryPath);

    optionParams.push("--game");
    return optionParams;
  },
  excludeFiles: () => ["Games", "Saves", "Updates", "usr", "sys"],
  bundledPath,
};
