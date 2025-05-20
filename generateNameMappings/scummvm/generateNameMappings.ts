import nodepath from "node:path";
// Import can't be shortend because path aliases do not work
import {writeFile} from "../../app/server/readWriteData.server.js";
import {spawnSync} from "node:child_process";
import {checkFlatpakIsInstalled} from "../../app/server/applicationsDB.server/checkEmulatorIsInstalled.js";

import {fileURLToPath} from 'node:url';

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));

export type Result = Record<string, string | number>;

const projectPath = nodepath.join(__dirname, "..", "..");
const resultPath = nodepath.join(
  projectPath,
  "app",
  "server",
  "applicationsDB.server",
  "applications",
  "scummvm",
  "nameMapping",
);

export const extractGames = (data: string) => {
  const objectToExtend: Result = {};

  const rows = data.split("\n");
  rows.forEach((row) => {
    // is row with engine:gameid
    if (row.match(/\w+:\w+.*/)) {
      // split by minimum of 3 whitespaces
      const [engineAndId, name] = row.split(/\s{3,}/);
      objectToExtend[engineAndId] = name;
    }
  });

  return objectToExtend;
};

export const importScummvm = () => {
  const flatpakId = "org.scummvm.ScummVM";
  const isScummVmInstalled = checkFlatpakIsInstalled(flatpakId);

  if (isScummVmInstalled) {
    try {
      const data = spawnSync("flatpak", ["run", flatpakId, "--list-games"], {
        encoding: "utf-8",
        maxBuffer: 1000000000,
      }).stdout.toString();

      const result = extractGames(data);

      writeFile(result, nodepath.join(resultPath, "scummvm.json"));
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  } else {
    console.error("ScummVM is not installed");
    process.exit(1);
  }
};
