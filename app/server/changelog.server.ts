import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extraFilesPath } from "./operationsystem.server.js";

let changelog: string;

export const loadChangelog = () => {
  if (!changelog) {
    const file = join(extraFilesPath, "CHANGELOG.md");
    changelog = readFileSync(file, {
      encoding: "utf8",
    });
  }

  return changelog;
};
