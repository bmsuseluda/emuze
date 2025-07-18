import nodepath from "node:path";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { log } from "./debug.server.js";
import { homeDirectory } from "./homeDirectory.server.js";

const readFiles = (path: string) => {
  try {
    return readdirSync(path, { encoding: "utf8", withFileTypes: true });
  } catch (error) {
    log("error", "readFiles", path, error);
    throw new Error("readFiles error");
  }
};

export const readDirectorynames = (path: string) =>
  readdirSync(path, { encoding: "utf8", withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map(({ name }) => nodepath.join(path, name));

export const readFilenames = ({
  path,
  fileExtensions,
  entryAsDirectory,
}: {
  path: string;
  fileExtensions?: string[];
  entryAsDirectory?: boolean;
}) => {
  const filenames: string[] = [];

  readFiles(path).forEach((file) => {
    const filePath = nodepath.join(path, file.name);

    // TODO: check if readdirSync with recursive option would be an option here
    if (entryAsDirectory) {
      if (file.isDirectory()) {
        filenames.push(filePath);
      }
    } else {
      if (file.isDirectory()) {
        readFilenames({
          path: filePath,
          fileExtensions,
          entryAsDirectory,
        }).forEach((filename) => filenames.push(filename));
      }

      if (
        !file.isDirectory() &&
        (!fileExtensions ||
          fileExtensions.find((value) =>
            filePath.toLowerCase().endsWith(value.toLowerCase()),
          ))
      ) {
        filenames.push(filePath);
      }
    }
  });

  return filenames;
};

export const readFileHome = <T>(path: string): T | null => {
  const pathInHome = nodepath.join(homeDirectory, path);

  if (existsSync(pathInHome)) {
    const data = readFileSync(pathInHome, "utf8");
    return JSON.parse(data);
  }
  return null;
};

export const writeFile = (object: unknown, path: string) => {
  // TODO: add success message, validation ...
  const dirname = nodepath.dirname(path);
  if (!existsSync(dirname)) {
    mkdirSync(dirname, { recursive: true });
  }
  writeFileSync(path, JSON.stringify(object));
};

export const writeFileHome = (object: unknown, path: string) => {
  const pathInHome = nodepath.join(homeDirectory, path);
  writeFile(object, pathInHome);
};
