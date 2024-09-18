import { spawn } from "child_process";
import { configFolderPath, port } from "./config";

process.env.EMUZE_IGDB_DEVELOPMENT_URL = "http://localhost:8080/games";
process.env.EMUZE_DEBUG = "true";
process.env.EMUZE_CONFIG_PATH = configFolderPath;
process.env.PORT = port;

try {
  spawn("yarn serve:remix", {
    shell: true,
  });
} catch (e) {
  console.log(e);
}
