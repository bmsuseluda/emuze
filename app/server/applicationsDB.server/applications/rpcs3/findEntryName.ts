import nodepath from "node:path";
import ps3Games from "./nameMapping/ps3.json" with { type: "json" };
import { log } from "../../../debug.server.js";
import type {
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "../../types.js";

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
export const findPlaystation3GameName: FindEntryNameFunction = ({
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

const sortPhysicalLast = (a: string, b: string) => {
  const aNormalized = a.toLowerCase();
  const bNormalized = b.toLowerCase();
  if (
    aNormalized.startsWith("games/") ||
    aNormalized.startsWith("dev_hdd0/GAMES/")
  ) {
    return 1;
  }
  if (
    bNormalized.startsWith("games/") ||
    bNormalized.startsWith("dev_hdd0/GAMES/")
  ) {
    return -1;
  }

  if (aNormalized < bNormalized) {
    return -1;
  }
  if (aNormalized > bNormalized) {
    return 1;
  }
  return 0;
};

/**
 * Exclude files without serial and files that are just update files for physical games
 * BCES00129
 */
export const excludePlaystationFiles: ExcludeFilesFunction = (filepaths) => {
  const filePathsSorted = filepaths.toSorted(sortPhysicalLast);
  const filepathsTemp = [...filePathsSorted];
  return filePathsSorted.filter((filepath) => {
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
