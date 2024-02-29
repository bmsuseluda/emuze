import nodepath from "path";
// Import can't be shortend because path aliases do not work
import { writeFile } from "../../app/server/readWriteData.server";
import { spawnSync } from "child_process";

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
      const [, id] = engineAndId.split(":");
      objectToExtend[id] = name;
    }
  });

  return objectToExtend;
};

const importScummvm = () => {
  try {
    const data = spawnSync(
      "flatpak",
      ["run", "org.scummvm.ScummVM", "--list-games"],
      {
        encoding: "utf-8",
        maxBuffer: 1000000000,
      },
    ).stdout.toString();

    const result = extractGames(data);

    writeFile(result, nodepath.join(resultPath, "scummvm.json"));
  } catch (error) {
    console.log(error);
  }
};

importScummvm();
