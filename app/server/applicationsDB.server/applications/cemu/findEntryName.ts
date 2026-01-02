import nodepath from "node:path";
import wiiuGames from "./nameMapping/cemu.json" with { type: "json" };
import { log } from "../../../debug.server.js";
import type { FindEntryNameFunction } from "../../types.js";
import { readXmlConfigFile } from "../../configFile.js";

interface ConfigFile {
  "?xml": { "@_version": "1.0"; "@_encoding": "UTF-8" };
  app: {
    title_id: { "#text": string };
  };
}

export const defaultConfig = `<?xml version="1.0" encoding="UTF-8"?>
<app></app>`;

export const findWiiuSerial = (path: string): string | undefined => {
  const appConfigFile = readXmlConfigFile(
    nodepath.join(path, "code", "app.xml"),
    defaultConfig,
    {
      parseTagValue: true,
      numberParseOptions: {
        hex: true,
        leadingZeros: false,
      },
    },
  ) as ConfigFile;

  return `${appConfigFile?.app?.title_id?.["#text"]}`;
};

export const findWiiUGameName: FindEntryNameFunction = ({
  entry: { name, path },
  categoriesPath,
  categoryName,
}): string => {
  let entryName: string | null = null;

  const serial = findWiiuSerial(
    nodepath.join(categoriesPath, categoryName, path),
  );

  if (serial) {
    try {
      entryName = (wiiuGames as Record<string, string>)[serial];
    } catch (error) {
      log("error", "findWiiuGameName", error);
      return name;
    }
  }

  return entryName || name;
};
