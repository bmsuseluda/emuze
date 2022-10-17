import nodepath from "path";
import fs from "fs";
import { homedir } from "os";

const homeDirectory = nodepath.join(homedir(), ".emuze");
const readFileHome = (path: string) => {
  const pathInHome = nodepath.join(homeDirectory, path);
  try {
    const data = fs.readFileSync(pathInHome, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

type General = {
  applicationsPath?: string | null;
  categoriesPath?: string;
  isWindows?: boolean;
  fullscreen?: boolean;
};

const paths = {
  general: "data/settings/general.json",
};

// TODO: Check how to share with remix server
export const readGeneral = (): General => readFileHome(paths.general);
