import { fetchMetaDataForSystem } from "./igdb";
import { writeFile } from "../app/server/readWriteData.server";
import nodepath from "path";
import type { SystemId } from "../app/server/categoriesDB.server/systemId";
import { categories } from "../app/server/categoriesDB.server";
import { existsSync } from "node:fs";
import { readFile } from "fs/promises";
import { matchName } from "../app/server/igdb.server";

const nameMappings: Partial<Record<SystemId, string>> = {
  dos: "../app/server/applicationsDB.server/applications/dosbox/nameMapping/dos.json",
  scumm:
    "../app/server/applicationsDB.server/applications/scummvm/nameMapping/scummvm.json",
  sonyplaystation3:
    "../app/server/applicationsDB.server/applications/rpcs3/nameMapping/ps3.json",
  arcade:
    "../app/server/applicationsDB.server/applications/mame/nameMapping/mame.json",
};

export type GameTrimmed = [name: string, cover: string];

const filterWithNameMapping = async (systemId: SystemId) => {
  const nameMappingPath = nameMappings[systemId];
  if (nameMappingPath) {
    const nameMapping: Record<string, string> = JSON.parse(
      await readFile(nodepath.join(__dirname, nameMappingPath), {
        encoding: "utf8",
      }),
    );
    const supportedGames = Object.values(nameMapping);

    return (games: GameTrimmed[]) =>
      supportedGames.reduce<GameTrimmed[]>((accumulator, supportedGame) => {
        const match = games.find(([name]) => matchName(supportedGame, name));
        if (match) {
          accumulator.push(match);
        }

        return accumulator;
      }, []);
  }
  return null;
};

export const fetchMetaData = async (systemId: SystemId) => {
  const filePath = nodepath.join(__dirname, "systems", `${systemId}.json`);

  if (!existsSync(filePath)) {
    const platformIds = categories[systemId].igdbPlatformIds;
    const filterByNameMapping = await filterWithNameMapping(systemId);

    let entries = (await fetchMetaDataForSystem(platformIds)).reduce<
      GameTrimmed[]
    >((accumulator, { name, alternative_names, game_localizations, cover }) => {
      if (cover) {
        accumulator.push([name, cover.image_id]);
        alternative_names?.forEach((alternativeName) => {
          accumulator.push([alternativeName.name, cover.image_id]);
        });
        game_localizations?.forEach((localization) => {
          if (localization.name)
            accumulator.push([
              localization.name,
              localization.cover?.image_id || cover.image_id,
            ]);
        });
      }
      return accumulator;
    }, []);

    if (filterByNameMapping) {
      entries = filterByNameMapping(entries);
    }

    writeFile(entries, filePath);
  }
};

const fetchMetaDataForAllSystems = async () => {
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

fetchMetaDataForAllSystems();
