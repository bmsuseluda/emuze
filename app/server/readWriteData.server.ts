import nodepath from "path";
import { homedir } from "os";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";

const homeDirectory = nodepath.join(
  process.env.EMUZE_CONFIG_PATH || homedir(),
  ".emuze",
);

const readFiles = (path: string) =>
  readdirSync(path, { encoding: "utf8", withFileTypes: true });

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

    if (entryAsDirectory) {
      if (file.isDirectory()) {
        filenames.push(filePath);
      }
    } else {
      if (file.isDirectory()) {
        readFilenames({ path: filePath }).forEach((filename) =>
          filenames.push(filename),
        );
      }
      filenames.push(filePath);
    }
  });

  if (fileExtensions) {
    return filenames.filter((filename) =>
      fileExtensions.find((value) =>
        filename.toLowerCase().endsWith(value.toLowerCase()),
      ),
    );
  }

  return filenames;
};

export const readFileHome = <T>(path: string): T | null => {
  const pathInHome = nodepath.join(homeDirectory, path);
  try {
    const data = readFileSync(pathInHome, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
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
