import type { SystemId } from "../app/server/categoriesDB.server/systemId.js";
import { readFile } from "node:fs/promises";
import nodepath from "node:path";
import { writeFile } from "../app/server/readWriteData.server.js";
import { normalizeString } from "../app/server/igdb.server.js";

import { fileURLToPath } from "node:url";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));

const nameMappings: [SystemId, string][] = [
  [
    "arcade",
    "../app/server/applicationsDB.server/applications/mame/nameMapping/mame.json",
  ],
  [
    "dos",
    "../app/server/applicationsDB.server/applications/dosbox/nameMapping/dos.json",
  ],
  [
    "nintendowiiu",
    "../app/server/applicationsDB.server/applications/cemu/nameMapping/cemu.json",
  ],
  [
    "scumm",
    "../app/server/applicationsDB.server/applications/scummvm/nameMapping/scummvm.json",
  ],
  [
    "sonyplaystation3",
    "../app/server/applicationsDB.server/applications/rpcs3/nameMapping/ps3.json",
  ],
];
const getNameMapping = async (path: string) => {
  const nameMapping: Record<string, string> = JSON.parse(
    await readFile(nodepath.join(__dirname, path), {
      encoding: "utf8",
    }),
  );
  return Object.values(nameMapping);
};

const prepareNameMapping = async (systemId: SystemId, path: string) => {
  const filePath = nodepath.join(__dirname, "nameMappings", `${systemId}.json`);
  const nameMapping = await getNameMapping(path);
  const nameMappingTrimmed = Array.from(new Set(nameMapping));
  const entries = nameMappingTrimmed.map(normalizeString);
  writeFile(entries, filePath);
};

const prepareNameMappings = async () => {
  nameMappings.forEach(([systemId, path]) => {
    prepareNameMapping(systemId, path);
  });
};

prepareNameMappings();
