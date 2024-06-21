import { log } from "../../debug.server";

export const findGameNameById = (
  id: string,
  mapping: Record<string, string>,
  applicationName: string,
) => {
  let gameName: string;
  try {
    gameName = mapping[id];
  } catch (error) {
    log("error", "findGameNameById", applicationName, error);
    return id;
  }

  return gameName || id;
};
