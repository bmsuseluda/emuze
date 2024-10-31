import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "../../types";
import nodepath from "path";
import ps3Games from "./nameMapping/ps3.json";
import { log } from "../../../debug.server";

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

const physicalDigitalMapping: Record<string, string> = {
  XCUS00003: "BCUS98472",
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
          physicalDigitalMapping[serial] === otherSerial;

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

export const rpcs3: Application = {
  id: "rpcs3",
  name: "RPCS3",
  flatpakId: "net.rpcs3.RPCS3",
  fileExtensions: ["EBOOT.BIN"],
  findEntryName: findPlaystation3GameName,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
      optionParams.push("--no-gui");
    }
    return optionParams;
  },
  excludeFiles: excludePlaystationFiles,
};
