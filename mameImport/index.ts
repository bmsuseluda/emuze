import nodepath from "path";
import { XMLParser } from "fast-xml-parser";
import { writeFile } from "../app/server/readWriteData.server";
import { spawnSync } from "child_process";

type Result = Record<string, string | number>;

const xmlParser = new XMLParser({ ignoreAttributes: false });

const projectPath = nodepath.join(__dirname, "..");
const resultPath = nodepath.join(projectPath, "app", "server", "mameMappings");

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

const addToObject = (
  objectToExtend: Result,
  { "@_name": name, description }: Game,
) => {
  if (name && description) {
    const descriptionAsString =
      typeof description === "number" ? description.toString() : description;

    objectToExtend[name] = filterDescription(descriptionAsString);
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
  machine?.forEach((game) => {
    addToObject(objectToExtend, game);
  });

  return objectToExtend;
};

const importMame = () => {
  try {
    const xmlData = spawnSync(
      "flatpak",
      ["run", "org.mamedev.MAME", "-listxml"],
      {
        encoding: "utf-8",
        maxBuffer: 1000000000,
      },
    ).stdout.toString();

    const result = extractGames(xmlData);

    writeFile(result, nodepath.join(resultPath, "mameMapping.json"));
  } catch (error) {
    console.log(error);
  }
};

importMame();
