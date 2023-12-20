import { _electron as electron } from "@playwright/test";
import nodepath from "path";

export const startApp = async (configPath: string) => {
  process.env.EMUZE_IGDB_DEVELOPMENT_URL = "http://localhost:8080/games";
  process.env.EMUZE_CONFIG_PATH = configPath;
  process.env.EMUZE_TEST_DATA_PATH = nodepath.join(__dirname, "testData");

  const app = await electron.launch({ args: ["."] });
  const page = await app.firstWindow();

  page.on("pageerror", (error) => {
    console.error(error);
  });
  page.on("console", console.log);

  return { app, page };
};
