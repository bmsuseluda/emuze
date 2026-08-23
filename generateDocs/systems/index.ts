import Handlebars from "handlebars";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import nodepath from "node:path";

import { categories } from "../../app/server/categoriesDB.server/index.js";

const __dirname = import.meta.dirname;
const projectPath = nodepath.join(__dirname, "..", "..");
const systemDocsPath = nodepath.join(projectPath, "docs", "systems");

const template = Handlebars.compile(
  readFileSync(nodepath.join(__dirname, "system.md.hbs"), "utf8"),
);

rmSync(systemDocsPath, { recursive: true, force: true });
mkdirSync(systemDocsPath, { recursive: true });

Object.values(categories).forEach(
  ({ id, names, getApplication, hasAnalogStick }) => {
    const name = names.at(0);
    const application = getApplication().name;

    writeFileSync(
      nodepath.join(systemDocsPath, `${id}.md`),
      template({ name, emulator: application }),
    );
  },
);
