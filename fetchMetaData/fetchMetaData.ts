import { fetchMetaDataForSystem } from "./igdb";
import { writeFile } from "../app/server/readWriteData.server";
import nodepath from "path";
import type { SystemId } from "../app/server/categoriesDB.server/systemId";
import { categories } from "../app/server/categoriesDB.server";
import { existsSync } from "node:fs";
import { readFile } from "fs/promises";
import { normalizeString } from "../app/server/igdb.server";

export type GameTrimmed = [name: string, cover: string];

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
  checkNotIfExist: boolean,
  entries: Record<string, string>,
  gameName: string,
  cover: string,
  nameMapping?: string[],
) => {
  const gameNameNormalized = normalizeString(gameName);
  if (checkNotIfExist || !(gameNameNormalized in entries)) {
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

    let entries = (await fetchMetaDataForSystem(platformIds)).reduce<
      Record<string, string>
    >((accumulator, { name, alternative_names, game_localizations, cover }) => {
      if (cover) {
        addNormalizedIfNotExist(
          true,
          accumulator,
          name,
          cover.image_id,
          nameMapping,
        );
        game_localizations?.forEach((localization) => {
          if (localization.name && localization.name !== name) {
            addNormalizedIfNotExist(
              false,
              accumulator,
              localization.name,
              localization.cover?.image_id || cover.image_id,
              nameMapping,
            );
          }
        });
        alternative_names?.forEach((alternativeName) => {
          addNormalizedIfNotExist(
            false,
            accumulator,
            alternativeName.name,
            cover.image_id,
            nameMapping,
          );
        });
      }
      return accumulator;
    }, {});

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
          error().catch((error: { response: object }) => {
            console.log(`error for ${id}`, error.response);
          });
        });
    }
  }
};
