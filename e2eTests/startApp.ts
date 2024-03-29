import { _electron as electron } from "@playwright/test";

export const startApp = async (configPath: string) => {
  process.env.EMUZE_IGDB_DEVELOPMENT_URL = "http://localhost:8080/games";
  process.env.EMUZE_CONFIG_PATH = configPath;

  const app = await electron.launch({ args: ["."] });
  const page = await app.firstWindow();

  page.on("pageerror", (error) => {
    console.error(error);
  });
  page.on("console", console.log);

  return { app, page };
};
