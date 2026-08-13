import nodepath from "node:path";
import type { Application } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import { isWindows } from "../../../operationsystem.server.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import XMLBuilder from "fast-xml-builder";
import { log } from "../../../debug.server.js";
import { readXmlConfigFile, writeConfig } from "../../configFile.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { envPaths } from "../../../envPaths.server.js";
import type { ConfigFile } from "./config.js";
import { defaultConfig } from "./defaultConfig.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { removeFile } from "../../../readWriteData.server.js";
import { findWiiUGameName } from "./findEntryName.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const applicationId: ApplicationId = "cemu";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "Cemu.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const defaultConfigFileName = "settings.xml";

const defaultConfigPathRelative = nodepath.join(defaultConfigFileName);
const controllerConfigPathRelative = (index: number) =>
  nodepath.join("controllerProfiles", `controller${index}.xml`);

const getConfigFilePath = (configFilePathRelative: string) =>
  nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
    configFilePathRelative,
  );

const getDefaultConfigFilePath = () =>
  getConfigFilePath(defaultConfigPathRelative);

const getControllerConfigFilePath = (index: number) =>
  getConfigFilePath(controllerConfigPathRelative(index));

const readDefaultConfigFile = () =>
  readXmlConfigFile(getDefaultConfigFilePath(), defaultConfig) as ConfigFile;

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

const replaceControllerConfigFile = () => {
  const virtualGamepads = getVirtualGamepads();

  virtualGamepads.forEach((virtualGamepad, index) => {
    writeConfig(getControllerConfigFilePath(index), virtualGamepad);
  });

  resetUnusedVirtualGamepads(8, virtualGamepads.length, (gamepadIndex) => {
    removeFile(getControllerConfigFilePath(gamepadIndex));
  });
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

const searchGamesOnlyIn = ["games"];

export const cemu: Application = {
  id: applicationId,
  name: "Cemu",
  entryAsDirectory: true,
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  searchGamesOnlyIn,
  requiredSystemFolderStructure: ["mlc", ...searchGamesOnlyIn],
  findEntryName: findWiiUGameName,
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [defaultConfigPathRelative, "controllerProfiles", "gameProfiles"],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
    absoluteEntryPath,
  }) => {
    const wiiuSystemFolderPath = nodepath.join(
      categoriesPath,
      categoryData.name,
    );
    const wiiuRomsPath = nodepath.join(wiiuSystemFolderPath, "games");
    const wiiuMlcPath = nodepath.join(wiiuSystemFolderPath, "mlc");

    replaceDefaultConfigFile(wiiuRomsPath);
    replaceControllerConfigFile();

    const optionParams = [...["--mlc", wiiuMlcPath]];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }

    log("debug", "entryPath", absoluteEntryPath);

    optionParams.push("--game");
    return optionParams;
  },
  bundledPath,
};
