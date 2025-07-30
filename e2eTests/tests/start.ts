import { spawn } from "node:child_process";
import type { TestName } from "./ports.js";
import { ports } from "./ports.js";

export const startReactRouter = (testName: TestName) => {
  process.env.EMUZE_IGDB_DEVELOPMENT_URL = "http://localhost:8080/games";
  process.env.EMUZE_DEBUG = "true";
  process.env.PORT = ports[testName].toString();

  try {
    const child = spawn("yarn serve:remix", {
      shell: true,
    });
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (data) {
      console.log("stdout: " + data);
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function (data) {
      console.log("stderr: " + data);
    });
  } catch (e) {
    console.log("error: " + e);
  }
};
