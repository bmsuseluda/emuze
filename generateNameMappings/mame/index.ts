import nodepath from "node:path";
import { XMLParser } from "fast-xml-parser";
import { writeFile } from "../../app/server/readWriteData.server.js";
import { spawnSync } from "node:child_process";

import { fileURLToPath } from "node:url";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));

type Result = Record<string, string | number>;

const xmlParser = new XMLParser({ ignoreAttributes: false });

const projectPath = nodepath.join(__dirname, "..", "..");
const resultPath = nodepath.join(
  projectPath,
  "app",
  "server",
  "applicationsDB.server",
  "applications",
  "mame",
  "nameMapping",
);

type Game = {
  "@_name": string;
  description: string | number;
};

type MameListXmlStructure = {
  mame: {
    machine: Game[];
  };
};

const removeBrackets = (a: string) => a.replace(/\(.*\)/gi, "").trim();
const removeAdditionalNames = (a: string) => a.split(" / ")[0].trim();

const filterDescription = (description: string) =>
  removeAdditionalNames(removeBrackets(description));

const descriptionPatches: Record<string, string> = {
  ironclad: "Chotetsu Brikin'ger",
  twocrude: "Two Crude Dudes",
  twocrudea: "Two Crude Dudes",
};

const addToObject = (
  objectToExtend: Result,
  { "@_name": name, description }: Game,
) => {
  if (name && description) {
    const descriptionAsString =
      typeof description === "number" ? description.toString() : description;

    objectToExtend[name] =
      descriptionPatches[name] || filterDescription(descriptionAsString);
  }
};

const parseXmlData = (xmlData: string): MameListXmlStructure | null => {
  try {
    return xmlParser.parse(xmlData);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const extractGames = (xmlData: string) => {
  const objectToExtend: Result = {};
  const machine = parseXmlData(xmlData)?.mame?.machine;
  // TODO: filter machines out that have a softwarelist
  machine?.forEach((game) => {
    addToObject(objectToExtend, game);
  });

  return objectToExtend;
};

const importMame = () => {
  try {
    const result = spawnSync("mame", ["-listxml"], {
      encoding: "utf-8",
      maxBuffer: 10000000000000,
    });
    if (result.stderr) {
      console.log(result.stderr);
    }
    const xmlData = result.stdout.toString();

    const extractedGames = extractGames(xmlData);

    writeFile(extractedGames, nodepath.join(resultPath, "mame.json"));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

importMame();
