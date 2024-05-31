import dosGames from "./nameMapping/dos.json";
import { existsSync } from "fs";
import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
  OptionParamFunction,
} from "../../types";
import nodepath from "path";
import { readFilenames } from "../../../readWriteData.server";

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

const createMountCommand = (fileToMount: string) => [
  "-c",
  `imgmount D ${fileToMount} -t cdrom`,
];

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
): string[] => {
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

  return [];
};

const createOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
    general: { categoriesPath },
  },
  entryData: { path },
  categoryData,
}) => {
  const optionParams = [];

  if (fullscreen) {
    optionParams.push("--fullscreen");
  }

  const workingDirectory = nodepath.join(
    categoriesPath,
    categoryData.name,
    path.split(nodepath.sep)[0],
  );
  const filenameWithoutExtension = nodepath.basename(
    path,
    nodepath.extname(path),
  );

  optionParams.push("--working-dir", workingDirectory);
  optionParams.push("-c", "mount C . -t dir");

  optionParams.push(
    ...mountDiscDrive(workingDirectory, filenameWithoutExtension),
  );

  optionParams.push("-c", "loadfix");

  return optionParams;
};

export const dosboxstaging: Application = {
  id: "dosboxstaging",
  name: "DOSBox-Staging",
  executable: "dosbox.exe",
  fileExtensions: [".exe", ".bat"],
  flatpakId: "io.github.dosbox-staging",
  excludeFiles: excludeDosSecondaryFiles,
  createOptionParams,
  findEntryName: findDosGameName,
};
