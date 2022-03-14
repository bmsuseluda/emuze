import fs from "fs";
import nodepath from "path";

const readFiles = (path: string) =>
  fs.readdirSync(path, { encoding: "utf8", withFileTypes: true });

export const readDirectorynames = (path: string) =>
  fs
    .readdirSync(path, { encoding: "utf8", withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map(({ name }) => nodepath.join(path, name));

export const readFilenames = (path: string, fileExtensions?: string[]) => {
  const filenames: string[] = readFiles(path).flatMap((file) => {
    const filePath = nodepath.join(path, file.name);
    if (file.isDirectory()) {
      return readFilenames(filePath);
    }
    return filePath;
  });

  if (fileExtensions) {
    return filenames.filter((filename) =>
      fileExtensions.find(
        (value) =>
          value.toLowerCase() === nodepath.extname(filename).toLowerCase()
      )
    );
  }

  return filenames;
};

export const readFile = (path: string) => {
  try {
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

export const writeFile = (object: unknown, path: string) => {
  // TODO: add success message, validation ...
  const dirname = nodepath.dirname(path);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(path, JSON.stringify(object));
};
