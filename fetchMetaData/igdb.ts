import type { Apicalypse } from "apicalypse";
import apicalypse from "apicalypse";
import { retryPromise } from "../app/retryPromise";

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

export interface GamesResponse {
  data: Game[];
  config?: {
    data?: unknown;
  };
  status?: unknown;
  headers: ResponseHeader;
  request?: unknown;
}

const igdbResponseLimit = 500;

interface ResponseHeader {
  "ratelimit-reset": string;
  "ratelimit-remaining": string;
  "x-count": "string";
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMetaDataForSystemWithOffset = async (
  client: Apicalypse,
  platformId: number[],
  offset: number = 0,
): Promise<Game[]> => {
  const gamesResponse: GamesResponse = await retryPromise(
    () =>
      client
        .fields([
          "name",
          "cover.image_id",
          "alternative_names.name",
          "game_localizations.name",
          "game_localizations.cover.image_id",
        ])
        .where(`platforms=(${platformId})`)
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
        client,
        platformId,
        offset + igdbResponseLimit,
      )),
    ];
  }

  return gamesResponse.data;
};

export const fetchMetaDataForSystem = async (platformId: number[]) => {
  const client = apicalypse({
    method: "POST",
    headers: {
      "Accept-Encoding": "gzip",
    },
  });

  const entriesWithMetaData = await fetchMetaDataForSystemWithOffset(
    client,
    platformId,
  );

  return entriesWithMetaData;
};
