import Handlebars from "handlebars";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import nodepath from "node:path";

import { categories } from "../../app/server/categoriesDB.server/index.js";
import { emulatorVersions } from "../../downloadEmulators/applications.js";
import {
  checkIsBiosNeeded,
  getEmulatorAlternative,
  getEmulatorNameString,
} from "../../readme/scripts.js";
import { SystemId } from "../../app/server/categoriesDB.server/systemId.js";

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

const getEmulatorElternativeForTemplate = (
  id: SystemId,
): Emulator | undefined => {
  const emulatorAlternative = getEmulatorAlternative(id);
  if (emulatorAlternative) {
    const bundledVersion = emulatorVersions[emulatorAlternative.id];
    return {
      name: emulatorAlternative.name,
      version: bundledVersion,
    };
  }
  return undefined;
};

export const generateSystemDocs = () => {
  rmSync(systemDocsPath, { recursive: true, force: true });
  mkdirSync(systemDocsPath, { recursive: true });

  Object.values(categories).forEach(({ id, names, getApplication }) => {
    if (id !== "lastPlayed") {
      const name = names.at(0)!;
      const application = getApplication();
      const emulatorName = getEmulatorNameString(application);
      const emulatorAlternative = getEmulatorElternativeForTemplate(id);
      const bundledVersion = emulatorVersions[application.id];
      const isBiosNeeded = checkIsBiosNeeded(application) ? "Yes" : "No";

      writeFileSync(
        nodepath.join(systemDocsPath, `${id}.md`),
        template({
          name,
          emulator: { name: emulatorName, version: bundledVersion },
          emulatorAlternative,
          isBiosNeeded,
        }),
      );
    }
  });
};
