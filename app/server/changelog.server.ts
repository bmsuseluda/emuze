import { readFileSync } from "node:fs";
import { join } from "node:path";

let changelog: string;

export const loadChangelog = () => {
  if (!changelog) {
    changelog = readFileSync(join(process.env.APPDIR || "", "CHANGELOG.md"), {
      encoding: "utf8",
    });
  }

  return changelog;
};
