import dosGames from "./nameMapping/dos.json" with { type: "json" };
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
  OptionParamFunction,
} from "../../types.js";
import nodepath from "node:path";
import { readFilenames } from "../../../readWriteData.server.js";
import type { ApplicationId } from "../../applicationId.js";
import { isWindows } from "../../../operationsystem.server.js";
import { envPaths } from "../../../envPaths.server.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { log } from "../../../debug.server.js";
import { writeConfig } from "../../configFile.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";

const applicationId: ApplicationId = "dosboxpure";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "DOSBoxPure.exe")
  : nodepath.join(applicationId, "DOSBoxPure");

const configFolderPath = nodepath.join(emulatorsConfigDirectory, applicationId);
const configFileName = "DOSBoxPure.cfg";
const configFilePath = nodepath.join(configFolderPath, configFileName);

const readConfigFile = (filePath: string) => {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    log(
      "debug",
      "dosbox",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return {};
  }
};

const findDosGameEntry = (filePath: string) =>
  Object.entries(dosGames).find(([key]) =>
    nodepath
      .normalize(filePath)
      .toLowerCase()
      .endsWith(nodepath.normalize(key).toLowerCase()),
  );

/**
 * Returns filenames that are not the configured file to start the game.
 *
 * @param filenames
 */
export const excludeDosSecondaryFiles: ExcludeFilesFunction = (filenames) =>
  filenames.filter((filename) => !findDosGameEntry(filename));

const findDosGameName: FindEntryNameFunction = ({ entry: { path } }) => {
  const result = findDosGameEntry(path);

  if (result) {
    return result[1];
  }

  return nodepath.basename(path);
};

const createMountCommand = (fileToMount: string) =>
  `imgmount D ${fileToMount} -t cdrom`;

/**
 * Looks for a disc drive file. Uses the following priority:
 * 1) .cue
 * 2) .ins
 * 3) .gog
 * 4) [filenameWithoutExtension].DAT
 *
 * @param directoryName
 * @param filenameWithoutExtension
 */
const mountDiscDrive = (
  directoryName: string,
  filenameWithoutExtension: string,
): string => {
  const cueFiles = readFilenames({
    path: directoryName,
    fileExtensions: [".cue"],
  });
  if (cueFiles.length > 0) {
    return createMountCommand(nodepath.relative(directoryName, cueFiles[0]));
  }

  const insFiles = readFilenames({
    path: directoryName,
    fileExtensions: [".ins"],
  });
  if (insFiles.length > 0) {
    return createMountCommand(nodepath.relative(directoryName, insFiles[0]));
  }

  const gogFiles = readFilenames({
    path: directoryName,
    fileExtensions: [".gog"],
  });
  if (gogFiles.length > 0) {
    return createMountCommand(nodepath.relative(directoryName, gogFiles[0]));
  }

  if (
    existsSync(nodepath.join(directoryName, `${filenameWithoutExtension}.DAT`))
  ) {
    return createMountCommand(`${filenameWithoutExtension}.DAT`);
  }

  return "";
};

const createPrepareBatFile = (
  workingDirectory: string,
  absoluteEntryPath: string,
  mountDiscDriveCommand: string,
) => {
  const filePath = nodepath.join(workingDirectory, "PREPARE.BAT");

  const executableFileName = nodepath.basename(absoluteEntryPath);
  const executableRelativePath = absoluteEntryPath.split(workingDirectory)[1];
  const executableRelativeDir =
    executableRelativePath.split(executableFileName)[0];

  const file = [
    mountDiscDriveCommand,
    "loadfix",
    `CD ${executableRelativeDir}`,
    executableFileName,
  ].join("\n");

  writeFileSync(filePath, file);

  return filePath;
};

const writeConfigFile = (fullscreen?: boolean) => {
  const filePath = configFilePath;
  const fileContent = readConfigFile(filePath);

  const fileContentNew = {
    ...fileContent,
    custom_controller_bindings: "true",
    screen_fullscreen: fullscreen ? "true" : "false",
    ...getVirtualGamepads(),
  };

  writeConfig(filePath, JSON.stringify(fileContentNew));
};

const createOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
    general: { categoriesPath },
  },
  entryData: { path },
  categoryData,
  absoluteEntryPath,
}) => {
  writeConfigFile(fullscreen);

  const workingDirectory = nodepath.join(
    categoriesPath,
    categoryData.name,
    path.split(nodepath.sep)[0],
  );
  const filenameWithoutExtension = nodepath.basename(
    path,
    nodepath.extname(path),
  );

  const mountDiscDriveCommand = mountDiscDrive(
    workingDirectory,
    filenameWithoutExtension,
  );

  const prepareBatFile = createPrepareBatFile(
    workingDirectory,
    absoluteEntryPath,
    mountDiscDriveCommand,
  );
  const optionParams = [prepareBatFile];

  return optionParams;
};

const getConfigFileBasePath = () => {
  if (isWindows()) {
    const { config } = envPaths("DOSBoxPure", { suffix: "" });
    return nodepath.join(config);
  } else {
    const { config } = envPaths("DOSBoxPure", { suffix: "" });
    return nodepath.join(config);
  }
};

export const dosboxpure: Application = {
  id: applicationId,
  name: "DOSBox Pure Unleashed",
  fileExtensions: [".exe", ".bat"],
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [configFileName],
  },
  excludeFiles: excludeDosSecondaryFiles,
  omitAbsoluteEntryPathAsLastParam: true,
  createOptionParams,
  findEntryName: findDosGameName,
  bundledPath,
};
