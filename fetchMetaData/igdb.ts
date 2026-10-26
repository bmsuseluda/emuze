import apicalypse from "apicalypse";
import { retryPromise } from "../app/retryPromise/index.js";

interface GameLocalization {
  name?: string;
  cover?: {
    image_id: string;
  };
}

export interface Game {
  cover?: {
    image_id: string;
  };
  name: string;
  alternative_names?: [{ name: string }];
  game_localizations?: GameLocalization[];
}

export const url =
  process.env.EMUZE_IGDB_DEVELOPMENT_URL || "http://localhost:8080/games";

const client = apicalypse({
  method: "POST",
  headers: {
    "Accept-Encoding": "gzip",
  },
});

const igdbResponseLimit = 500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getFilterMaxReleaseDate = (maxReleaseDate?: number) =>
  maxReleaseDate ? ` & first_release_date < ${maxReleaseDate}` : "";

const filterMultitap =
  "& (multiplayer_modes.offlinemax > 2 | multiplayer_modes.offlinecoopmax > 2)";

const fetchMetaDataForPlatformIdWithOffset = async (
  platformId: number,
  fields: string | string[],
  where: string | string[],
  offset: number,
): Promise<Game[]> => {
  const gamesResponse = await retryPromise(
    () =>
      client
        .fields(fields)
        .where(`platforms=(${platformId})${where}`)
        .limit(igdbResponseLimit)
        .offset(offset)
        .sort("id")
        .request(url),
    3,
    4000,
  );

  console.log("debug", "igdb request games", platformId, offset);
  console.log(
    "debug",
    "igdb response",
    gamesResponse.status,
    gamesResponse.headers,
    gamesResponse.data.length,
    `with offset ${offset}`,
  );

  const headers = gamesResponse.headers;
  if (Number(headers["ratelimit-remaining"]) < 5) {
    const waitFor = Number(headers["ratelimit-reset"]);
    await delay(waitFor * 1000);
  }

  if (gamesResponse.data.length === igdbResponseLimit) {
    return [
      ...gamesResponse.data,
      ...(await fetchMetaDataForPlatformIdWithOffset(
        platformId,
        fields,
        where,
        offset + igdbResponseLimit,
      )),
    ];
  }

  return gamesResponse.data;
};

export const fetchMetaDataForPlatformId = async (
  platformIds: number[],
  fields: string | string[],
  where: string | string[],
) => {
  const entriesWithMetaData: Game[] = [];

  for (const platformId of platformIds) {
    entriesWithMetaData.push(
      ...(await fetchMetaDataForPlatformIdWithOffset(
        platformId,
        fields,
        where,
        0,
      )),
    );
  }

  return entriesWithMetaData;
};

export const fetchNameAndCoverForPlatformIds = async (
  platformIds: number[],
  maxReleaseDate?: number,
) => {
  const fields = [
    "name",
    "cover.image_id",
    "alternative_names.name",
    "game_localizations.name",
    "game_localizations.cover.image_id",
  ];
  const where = getFilterMaxReleaseDate(maxReleaseDate);

  return fetchMetaDataForPlatformId(platformIds, fields, where);
};

export const fetchMultitapGamesForPlatformIds = async (
  platformIds: number[],
) => {
  const fields = [
    "name",
    "alternative_names.name",
    "game_localizations.name",
    "multiplayer_modes.offlinemax",
    "multiplayer_modes.offlinecoopmax",
  ];
  const where = filterMultitap;

  return fetchMetaDataForPlatformId(platformIds, fields, where);
};
