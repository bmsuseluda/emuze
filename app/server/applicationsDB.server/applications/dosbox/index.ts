import dosGames from "./nameMapping/dos.json";
import { existsSync, readdirSync } from "fs";
import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "~/server/applicationsDB.server/types";
import nodepath from "path";
import { findGameNameById } from "~/server/applicationsDB.server/nameMappings/findGameNameById";

/**
 * Returns filenames that are not the configured file to start the game.
 *
 * @param filenames
 */
export const excludeDosSecondaryFiles: ExcludeFilesFunction = (filenames) =>
  filenames.filter((filename) => {
    const filenameWithoutFoldername = nodepath.basename(filename);

    return !(dosGames as Record<string, string>)[
      filenameWithoutFoldername.toLowerCase()
    ];
  });

const findDosGameName: FindEntryNameFunction = ({ entry: { path } }) =>
  findGameNameById(nodepath.basename(path).toLowerCase(), dosGames, "dos");

const mountDiscDrive = (
  directoryName: string,
  filenameWithoutExtension: string,
) => {
  let fileToMount;
  if (
    existsSync(nodepath.join(directoryName, `${filenameWithoutExtension}.DAT`))
  ) {
    fileToMount = `${filenameWithoutExtension}.DAT`;
  }

  const gogFiles = readdirSync(directoryName).filter((file) =>
    file.endsWith(".gog"),
  );
  if (gogFiles.length > 0) {
    fileToMount = gogFiles[0];
  }

  if (fileToMount) {
    return ["-c", `imgmount D ${fileToMount} -t iso`];
  }

  return [];
};

export const dosboxstaging: Application = {
  id: "dosboxstaging",
  name: "DOSBox-Staging",
  fileExtensions: [".exe", ".bat"],
  flatpakId: "io.github.dosbox-staging",
  excludeFiles: excludeDosSecondaryFiles,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
    entryData: { path },
  }) => {
    const optionParams = [];

    if (fullscreen) {
      optionParams.push("--fullscreen");
    }

    const directoryName = nodepath.dirname(absoluteEntryPath);
    const filenameWithoutExtension = nodepath.basename(
      path,
      nodepath.extname(path),
    );

    optionParams.push("--working-dir", directoryName);
    optionParams.push("-c", "mount C . -t dir");

    optionParams.push(
      ...mountDiscDrive(directoryName, filenameWithoutExtension),
    );

    optionParams.push("-c", "loadfix", filenameWithoutExtension);

    return optionParams;
  },
  findEntryName: findDosGameName,
};
