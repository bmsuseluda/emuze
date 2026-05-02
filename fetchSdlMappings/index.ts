import nodepath from "node:path";
import { writeFile } from "../app/server/readWriteData.server.js";
import { gamecontrollerdbPath } from "../app/server/bundledEmulatorsPath.server.js";
import { mkdirSync, writeFileSync } from "node:fs";

const __dirname = import.meta.dirname;

const projectPath = nodepath.join(__dirname, "..");
const resultPath = nodepath.join(
  projectPath,
  "app",
  "server",
  "gamepadManager.server",
);

const url =
  "https://raw.githubusercontent.com/mdqinc/SDL_GameControllerDB/refs/heads/master/gamecontrollerdb.txt";

const fetchSdlMappings = () => {
  fetch(url).then((result) => {
    result.text().then((text) => {
      const mappings = text
        .split("\n")
        .filter((line) => line && !line.startsWith("#"));

      writeFile(mappings, nodepath.join(resultPath, "mappings.json"));

      const absoluteGamecontrollerdbPath = nodepath.join(
        projectPath,
        gamecontrollerdbPath,
      );
      mkdirSync(nodepath.dirname(absoluteGamecontrollerdbPath), {
        recursive: true,
      });
      writeFileSync(absoluteGamecontrollerdbPath, text);
    });
  });
};

fetchSdlMappings();
