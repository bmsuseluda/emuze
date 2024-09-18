import { spawn } from "child_process";
import { configFolderPath, e2ePath, port } from "./config";
import nodepath from "path";

process.env.EMUZE_IGDB_DEVELOPMENT_URL = "http://localhost:8080/games";
process.env.EMUZE_DEBUG = "true";
process.env.EMUZE_CONFIG_PATH = configFolderPath;
process.env.EMUZE_TEST_ROMS_PATH = nodepath.join(e2ePath, "testRoms");

process.env.PORT = port;

try {
  spawn("yarn serve:remix", {
    shell: true,
  });
} catch (e) {
  console.log(e);
}
