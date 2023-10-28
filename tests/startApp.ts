import { _electron as electron } from "@playwright/test";
import nodepath from "path";

export const startApp = async (configPath?: string) => {
  process.env.EMUZE_CONFIG_PATH =
    configPath || nodepath.join(__dirname, "config");

  const app = await electron.launch({ args: ["."] });
  const page = await app.firstWindow();

  page.on("pageerror", (error) => {
    console.error(error);
  });
  page.on("console", console.log);

  return { app, page };
};
