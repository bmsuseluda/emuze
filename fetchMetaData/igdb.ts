import apicalypse from "apicalypse";
import {retryPromise} from "../app/retryPromise/index.js";

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

const fetchMetaDataForSystemWithOffset = async (
  platformId: number,
  offset: number,
  maxReleaseDate?: number,
): Promise<Game[]> => {
  const gamesResponse = await retryPromise(
    () =>
      client
        .fields([
          "name",
          "cover.image_id",
          "alternative_names.name",
          "game_localizations.name",
          "game_localizations.cover.image_id",
        ])
        .where(
          `platforms=(${platformId})${getFilterMaxReleaseDate(maxReleaseDate)}`,
        )
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
      ...(await fetchMetaDataForSystemWithOffset(
        platformId,
        offset + igdbResponseLimit,
        maxReleaseDate,
      )),
    ];
  }

  return gamesResponse.data;
};

export const fetchMetaDataForSystem = async (
  platformIds: number[],
  maxReleaseDate?: number,
) => {
  const entriesWithMetaData: Game[] = [];

  for (const platformId of platformIds) {
    entriesWithMetaData.push(
      ...(await fetchMetaDataForSystemWithOffset(
        platformId,
        0,
        maxReleaseDate,
      )),
    );
  }

  return entriesWithMetaData;
};
