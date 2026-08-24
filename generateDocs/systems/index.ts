import Handlebars from "handlebars";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import nodepath from "node:path";

import { categories } from "../../app/server/categoriesDB.server/index.js";
import { emulatorVersions } from "../../downloadEmulators/applications.js";
import {
  checkIsBiosNeeded,
  getEmulatorNameString,
} from "../../readme/scripts.js";

const __dirname = import.meta.dirname;
const projectPath = nodepath.join(__dirname, "..", "..");
const systemDocsPath = nodepath.join(projectPath, "docs", "systems");

interface Emulator {
  name: string;
  version: string;
}

interface SystemTemplate {
  name: string;
  emulator: Emulator;
  emulatorAlternative?: Emulator;
  isBiosNeeded: string;
  openSourceBios?: {
    name: string;
    version?: string;
    homepage: string;
  };
}

const template = Handlebars.compile<SystemTemplate>(
  readFileSync(nodepath.join(__dirname, "system.md.hbs"), "utf8"),
);

export const generateSystemDocs = () => {
  rmSync(systemDocsPath, { recursive: true, force: true });
  mkdirSync(systemDocsPath, { recursive: true });

  Object.values(categories).forEach(({ id, names, getApplication }) => {
    if (id !== "lastPlayed") {
      const name = names.at(0)!;
      const application = getApplication();
      const emulatorName = getEmulatorNameString(application);
      const bundledVersion = emulatorVersions[application.id];
      const isBiosNeeded = checkIsBiosNeeded(application) ? "Yes" : "No";

      writeFileSync(
        nodepath.join(systemDocsPath, `${id}.md`),
        template({
          name,
          emulator: { name: emulatorName, version: bundledVersion },
          isBiosNeeded,
        }),
      );
    }
  });
};
