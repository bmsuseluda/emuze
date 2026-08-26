import { cpSync } from "fs";
import nodepath from "node:path";
import { generateSystemDocs } from "./systems";

const __dirname = import.meta.dirname;
const projectPath = nodepath.join(__dirname, "..");
const docsPath = nodepath.join(projectPath, "docs");

const generateDocs = () => {
  cpSync(
    nodepath.join(projectPath, "public", "favicon.ico"),
    nodepath.join(docsPath, "public", "favicon.ico"),
    { force: true },
  );
  cpSync(
    nodepath.join(projectPath, "public", "AnnieUseYourTelescope-Regular.ttf"),
    nodepath.join(docsPath, "public", "AnnieUseYourTelescope-Regular.ttf"),
    { force: true },
  );
  cpSync(
    nodepath.join(projectPath, "artwork", "logo400x400.png"),
    nodepath.join(docsPath, "public", "logo400x400.png"),
    { force: true },
  );
  cpSync(
    nodepath.join(projectPath, "screenshots"),
    nodepath.join(docsPath, "public", "screenshots"),
    { force: true, recursive: true },
  );
  cpSync(
    nodepath.join(projectPath, "CHANGELOG.md"),
    nodepath.join(docsPath, "CHANGELOG.md"),
    { force: true },
  );

  generateSystemDocs();
};

generateDocs();
