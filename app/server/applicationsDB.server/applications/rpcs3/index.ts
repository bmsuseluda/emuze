import fs from "node:fs";
import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "../../types.js";
import nodepath from "node:path";
import ps3Games from "./nameMapping/ps3.json" with { type: "json" };
import { log } from "../../../debug.server.js";
import type { ApplicationId } from "../../applicationId.js";
import { defaultGuiSettings } from "./defaultGuiSettings.js";
import { envPaths } from "../../../envPaths.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL } from "node:os";

const flatpakId = "net.rpcs3.RPCS3";
const applicationId: ApplicationId = "rpcs3";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "rpcs3.exe");
const guiConfigFileName = "CurrentSettings.ini";

/**
 * Find the 9digit serial number from path
 *
 * @param path  e.g. 'dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN' or '/games/BLES01658-[Dragon Ball Z Budokai HD Collection]/PS3_GAME/USRDIR/EBOOT.BIN'
 */
export const findPlaystation3Serial = (path: string): string | undefined =>
  path
    .split(nodepath.sep)
    .reverse()
    .find(
      (pathSegment) =>
        pathSegment.match(/^\w{9}$/) || pathSegment.match(/^\w{9}-\[(.*)]$/),
    )
    ?.split("-")[0];

/**
 * Find the 9digit serial number and map to the Gamename.
 *
 * @param name EBOOT.BIN
 * @param path e.g. 'dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN' or '/games/BLES01658-[Dragon Ball Z Budokai HD Collection]/PS3_GAME/USRDIR/EBOOT.BIN'
 */
const findPlaystation3GameName: FindEntryNameFunction = ({
  entry: { name, path },
}) => {
  let entryName: string | null = null;

  const serial = findPlaystation3Serial(path);

  if (serial) {
    try {
      entryName = (ps3Games as Record<string, string>)[serial];
    } catch (error) {
      log("error", "findPlaystation3GameName", error);
      return name;
    }
  }

  return entryName || serial || name;
};

const digitalPhysicalMapping: Record<string, string> = {
  BCUS98472: "XCUS00003",
};

/**
 * Exclude files without serial and files that are just update files for physical games
 */
export const excludePlaystationFiles: ExcludeFilesFunction = (filepaths) => {
  const filepathsTemp = [...filepaths];
  return filepaths.filter((filepath) => {
    const serial = findPlaystation3Serial(filepath);

    const foundExclude =
      !serial ||
      !!filepathsTemp.find((otherFilepath) => {
        const otherSerial = findPlaystation3Serial(otherFilepath);

        const isNotTheSame = otherFilepath !== filepath;
        const isUpdateOnly =
          serial === otherSerial ||
          (digitalPhysicalMapping[serial] &&
            digitalPhysicalMapping[serial] === otherSerial);

        return isNotTheSame && isUpdateOnly;
      });

    if (foundExclude) {
      filepathsTemp.splice(
        filepathsTemp.findIndex((filepathTemp) => filepathTemp === filepath),
        1,
      );
    }

    return foundExclude;
  });
};

const readGuiConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "rpcs3",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultGuiSettings;
  }
};

const { config } = envPaths("rpcs3", { suffix: "" });
export const getGuiConfigFilePath = (configFileName: string) => {
  return nodepath.join(config, "GuiConfigs", configFileName);
};

export const replaceMetaConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Meta]", [{ keyValue: "checkUpdateStart=false" }]);

export const replaceMainWindowConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[main_window]", [
    { keyValue: "confirmationBoxExitGame=false" },
    { keyValue: "infoBoxEnabledWelcome=false" },
  ]);

export const replaceGuiConfigFile = async () => {
  const filePath = getGuiConfigFilePath(guiConfigFileName);
  const fileContent = readGuiConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceMetaConfig,
    replaceMainWindowConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const rpcs3: Application = {
  id: applicationId,
  name: "RPCS3",
  flatpakId,
  fileExtensions: ["EBOOT.BIN"],
  findEntryName: findPlaystation3GameName,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    replaceGuiConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
      optionParams.push("--no-gui");
    }
    return optionParams;
  },
  excludeFiles: excludePlaystationFiles,
  bundledPathLinux,
  bundledPathWindows,
};
