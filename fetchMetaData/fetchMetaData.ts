import { fetchMetaDataForSystem } from "./igdb";
import { writeFile } from "../app/server/readWriteData.server";
import nodepath from "path";
import type { SystemId } from "../app/server/categoriesDB.server/systemId";
import { categories } from "../app/server/categoriesDB.server";
import { existsSync } from "node:fs";

export const fetchMetaData = async (systemId: SystemId) => {
  const filePath = nodepath.join(__dirname, "systems", `${systemId}.json`);

  if (!existsSync(filePath)) {
    const platformIds = categories[systemId].igdbPlatformIds;
    const entries = await fetchMetaDataForSystem(platformIds);
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
