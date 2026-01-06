import nodepath from "node:path";
import { writeFile } from "../../app/server/readWriteData.server.js";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { retryPromise } from "../../app/retryPromise/index.js";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));
const projectPath = nodepath.join(__dirname, "..", "..");
const resultPath = nodepath.join(
  projectPath,
  "app",
  "server",
  "applicationsDB.server",
  "applications",
  "rpcs3",
  "nameMapping",
);
const nameMappingsFilePath = nodepath.join(resultPath, "ps3.json");

const apiBaseUrl =
  "http://api.serialstation.com/titles/?format=json&systems=e80a9d68-aef2-4e23-8768-27ac0e5d9f25";

type SystemName = "PlayStation 3" | "PlayStation Portable";

interface GameData {
  id: string;
  title_id_type: string;
  title_id_number: string;
  name: {
    default_value: string;
    translations: {
      language: string;
      value: string;
      romanized_value: string;
    }[];
  };
  content_type: "Game" | "PS1 Classic";
  systems: SystemName[];
}

interface Result {
  count: number;
  next?: string;
  previous?: string;
  results: GameData[];
}

type NameMappings = Record<string, string>;

const createSerialFromGameData = (gameData: GameData) =>
  `${gameData.title_id_type}${gameData.title_id_number}`;

const filterNewData = (
  nameMappings: NameMappings,
  result: Result,
): NameMappings => {
  const resultsFiltered = result.results.filter(
    (gameData: GameData) =>
      (gameData.content_type === "Game" ||
        gameData.content_type === "PS1 Classic") &&
      gameData.systems.includes("PlayStation 3") &&
      !gameData.name.default_value.endsWith("(Minis)") &&
      !gameData.name.default_value.endsWith("(PS2 Classic)") &&
      !gameData.name.default_value.endsWith("(PS2)") &&
      !gameData.name.default_value.startsWith("YouTube") &&
      !gameData.name.default_value.startsWith("Vidzone") &&
      !nameMappings[createSerialFromGameData(gameData)],
  );

  return resultsFiltered.reduce<NameMappings>(
    (newNameMappings, gameData: GameData) => {
      newNameMappings[createSerialFromGameData(gameData)] =
        gameData.name.default_value
          .replace("(PSOne Classic)", "")
          .replace("(PSONE CLASSIC)", "")
          .replace("(PS3/PSP/PS Vita)", "")
          .replace("(PS3/PSP/VITA)", "")
          .replace("(PS3/PSP)", "")
          .replace("(PS3 only)", "")
          .replace("(for PS3™/PSP®)", "")
          .replace("(For PS3)", "")
          .replace("(German)", "")
          .replace("(Danish)", "")
          .replace("（PS3版＋PSP版）", "")
          .replace(
            "MAD STALKER -FULL METAL FORCE-",
            "Mad Stalker: Full Metal Force",
          )
          .replace("Pong", "Pong: The Next Level")
          .replace("SuikodenII", "Suikoden II")
          .replace(
            "Wing Commander IV",
            "Wing Commander IV: The Price of Freedom",
          )
          .replace("full game", "")
          .replaceAll("®", "")
          .replaceAll("™", "")
          .replaceAll("\n", " ")
          .trim();
      return newNameMappings;
    },
    {},
  );
};

const fetchPromise = async (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok) {
      console.error(
        `${url} failed. ${response.status}. ${response.statusText}`,
      );
      throw new Error(
        `${url} failed. ${response.status}. ${response.statusText}`,
      );
    }
    return response;
  });

const fetchDataFromSerialStation = async (
  nameMappings: NameMappings,
  url: string = apiBaseUrl,
): Promise<NameMappings> => {
  const response = await retryPromise(() => fetchPromise(url), 3, 4000);

  if (!response.ok) {
    console.error(`${url} failed. ${response.status}. ${response.statusText}`);
    process.exit(1);
  }

  const result: Result = await response.json();
  console.log(`${url} successful. ${result.count}`);
  const resultFiltered = filterNewData(nameMappings, result);
  if (result.next) {
    const nextData = await fetchDataFromSerialStation(
      nameMappings,
      result.next,
    );

    return {
      ...resultFiltered,
      ...nextData,
    };
  }

  return resultFiltered;
};

const importRpcs3NameMappings = async () => {
  const nameMappingsData = readFileSync(nameMappingsFilePath, "utf8");
  const nameMappings: NameMappings = JSON.parse(nameMappingsData);

  const newNameMappings = await fetchDataFromSerialStation(nameMappings);

  const nameMappingsUpdated = { ...nameMappings, ...newNameMappings };
  writeFile(nameMappingsUpdated, nameMappingsFilePath);
};

importRpcs3NameMappings();
