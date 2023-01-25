import fs from "fs";
import nodepath from "path";
import { XMLParser } from "fast-xml-parser";
import { readFilenames, writeFile } from "../app/server/readWriteData.server";

type Result = Record<string, string | number>;

const xmlParser = new XMLParser({ ignoreAttributes: false });

const projectPath = nodepath.join(__dirname, "..", "..", "..");
const hashPath = nodepath.join(projectPath, "mameImport", "hash");
const resultPath = nodepath.join(projectPath, "app", "server", "mameMappings");

const readFile = (path: string): MameXmlStructure | null => {
  try {
    const data = fs.readFileSync(path, "utf8");
    return xmlParser.parse(data);
  } catch (error) {
    return null;
  }
};

type Game = {
  "@_name": string;
  description: string | number;
};

type MameXmlStructure = {
  softwarelist: {
    software: Game | Game[];
  };
};

const removeBrackets = (a: string) => a.replace(/\(.*\)/gi, "").trim();
const removeAdditionalNames = (a: string) => a.split(" / ")[0].trim();

const filterDescription = (description: string) =>
  removeAdditionalNames(removeBrackets(description));

const addToObject = (
  objectToExtend: Result,
  { "@_name": name, description }: Game
) => {
  if (name && description) {
    objectToExtend[name] =
      typeof description === "string"
        ? filterDescription(description)
        : description;
  }
};

const extractGames = (objectToExtend: Result, path: string) => {
  const software = readFile(path)?.softwarelist.software;
  if (software) {
    if (Array.isArray(software)) {
      software?.forEach((game) => {
        addToObject(objectToExtend, game);
      });
    } else {
      addToObject(objectToExtend, software);
    }
  }
};

const filenameExcludes = [
  "snes",
  "nes",
  "neocd",
  "neogeo",
  "n64",
  "megadriv",
  "megacd",
  "segacd",
  "gameboy",
  "gamegear",
  "famicom",
  "gba",
  "cd32",
  "vboy",
  "wswan",
  "wscolor",
  "sms",
  "pce",
  "pcfx",
  "msx",
  "svmu",
  "z80",
  "zx8",
  "vtech",
  "mac",
  "spectrum",
  "saturn",
  "sat_",
  "psx",
  "ngp",
  "3do",
  "apple",
  "zorba",
  "x1",
  "electron_cass",
  "bbc_cass",
];

const importMame = () => {
  const filenames = readFilenames(hashPath, [".xml"]);
  const result = filenames.reduce<Result>((accumulator, filename) => {
    if (
      !filenameExcludes.find((name) =>
        filename.startsWith(nodepath.join(hashPath, name))
      )
    ) {
      extractGames(accumulator, filename);
    }

    return accumulator;
  }, {});

  writeFile(result, nodepath.join(resultPath, "mameMapping.json"));
};

const importNeoGeo = () => {
  const result: Result = {};
  extractGames(result, nodepath.join(hashPath, "neogeo.xml"));
  writeFile(result, nodepath.join(resultPath, "neogeoMapping.json"));
};

// TODO: the software lists are not complete
// importMame();
importNeoGeo();
