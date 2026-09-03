import { cpSync } from "fs";
import nodepath from "node:path";
import { generateSystemDocs } from "./systems";

const __dirname = import.meta.dirname;
const projectPath = nodepath.join(__dirname, "..");
const docsPath = nodepath.join(projectPath, "docs");
const docsReactrouterPath = nodepath.join(projectPath, "docs_reactrouter");

const generateDocsForPath = (destinationPath: string) => {
  cpSync(
    nodepath.join(projectPath, "public", "favicon.ico"),
    nodepath.join(destinationPath, "public", "favicon.ico"),
    { force: true },
  );
  cpSync(
    nodepath.join(projectPath, "public", "AnnieUseYourTelescope-Regular.ttf"),
    nodepath.join(
      destinationPath,
      "public",
      "AnnieUseYourTelescope-Regular.ttf",
    ),
    { force: true },
  );
  cpSync(
    nodepath.join(projectPath, "artwork", "logo400x400.png"),
    nodepath.join(destinationPath, "public", "logo400x400.png"),
    { force: true },
  );
  cpSync(
    nodepath.join(projectPath, "screenshots"),
    nodepath.join(destinationPath, "public", "screenshots"),
    { force: true, recursive: true },
  );
  cpSync(
    nodepath.join(projectPath, "CHANGELOG.md"),
    nodepath.join(destinationPath, "CHANGELOG.md"),
    { force: true },
  );

  generateSystemDocs(nodepath.join(destinationPath, "systems"));
};

const generateDocs = () => {
  generateDocsForPath(docsPath);
  generateDocsForPath(docsReactrouterPath);
};

generateDocs();
