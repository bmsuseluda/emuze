import { fetchMetaDataForSystem } from "./igdb.js";
import { writeFile } from "../app/server/readWriteData.server.js";
import nodepath from "node:path";
import type { SystemId } from "../app/server/categoriesDB.server/systemId.js";
import { categories } from "../app/server/categoriesDB.server/index.js";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { normalizeString } from "../app/server/igdb.server.js";

import { fileURLToPath } from "node:url";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));

export type GameTrimmed = [name: string, cover: string];

const maxReleaseDates: Partial<Record<SystemId, number>> = {
  scumm: new Date(2015, 0).getTime() / 1000,
};

const getNameMapping = async (systemId: SystemId) => {
  const nameMappingPath = nodepath.join(
    __dirname,
    "nameMappings",
    `${systemId}.json`,
  );
  if (existsSync(nameMappingPath)) {
    const nameMapping: Record<string, string> = JSON.parse(
      await readFile(nodepath.join(nameMappingPath), {
        encoding: "utf8",
      }),
    );
    return Object.values(nameMapping);
  }
  return undefined;
};

const addNormalizedIfNotExist = (
  entries: Record<string, string>,
  gameName: string,
  cover: string,
  nameMapping?: string[],
) => {
  const gameNameNormalized = normalizeString(gameName);
  if (!(gameNameNormalized in entries)) {
    const isNameSupported = nameMapping
      ? !!nameMapping.includes(gameNameNormalized)
      : true;

    if (isNameSupported) {
      entries[gameNameNormalized] = cover;
    }
  }
};

export const fetchMetaData = async (systemId: SystemId) => {
  const filePath = nodepath.join(__dirname, "systems", `${systemId}.json`);

  if (!existsSync(filePath)) {
    const platformIds = categories[systemId].igdbPlatformIds;
    const nameMapping = await getNameMapping(systemId);
    const maxReleaseDate = maxReleaseDates[systemId];

    const result = await fetchMetaDataForSystem(platformIds, maxReleaseDate);

    const entries: Record<string, string> = {};

    for (const { cover, name } of result) {
      if (cover) {
        addNormalizedIfNotExist(entries, name, cover.image_id, nameMapping);
      }
    }

    for (const {
      cover,
      name,
      game_localizations,
      alternative_names,
    } of result) {
      if (cover) {
        game_localizations?.forEach((localization) => {
          if (localization.name && localization.name !== name) {
            addNormalizedIfNotExist(
              entries,
              localization.name,
              localization.cover?.image_id || cover.image_id,
              nameMapping,
            );
          }
        });
        alternative_names?.forEach((alternativeName) => {
          addNormalizedIfNotExist(
            entries,
            alternativeName.name,
            cover.image_id,
            nameMapping,
          );
        });
      }
    }

    writeFile(Object.entries(entries) as GameTrimmed[], filePath);
  }
};

export const fetchMetaDataForAllSystems = async () => {
  for (const { id } of Object.values(categories)) {
    if (id !== "lastPlayed") {
      await fetchMetaData(id)
        .then(() => {
          console.log(`fetchMetaData completed for ${id}`);
        })
        .catch((error) => {
          console.log(`error for ${id}`, error);
        });
    }
  }
};
