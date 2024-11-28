import { spawnSync } from "child_process";
import fs, { readdirSync } from "fs";
import nodepath from "path";
import { EOL } from "os";

/**
 * Removes old params if
 * - they should be set with the new params
 * - The keybinding should be used for another param
 *
 * @param params
 * @param paramsToReplace
 */
const replaceParams = (params: string[], paramsToReplace: string[]) => [
  ...params.reduce<string[]>((accumulator, param) => {
    const [id, value] = param.split("=");
    if (
      !paramsToReplace.find(
        (paramToReplace) =>
          paramToReplace.startsWith(id.trim()) ||
          (value && paramToReplace.includes(value.trim())),
      )
    ) {
      accumulator.push(param);
    }

    return accumulator;
  }, []),
  ...paramsToReplace,
  "",
  "",
  "",
];

export const replaceSection = (
  sections: string[],
  sectionName: string,
  paramsToSet: string[],
) => {
  const sectionIndex = sections.findIndex((section) =>
    section.startsWith(sectionName),
  );

  if (sectionIndex !== -1) {
    const sectionRows = sections[sectionIndex].split(EOL);
    const mergedSectionRows = replaceParams(sectionRows, paramsToSet);
    sections.splice(sectionIndex, 1, mergedSectionRows.join(EOL));
    return sections;
  }

  return [...sections, [sectionName, ...paramsToSet].join(EOL)];
};

export type SectionReplacement = (sections: string[]) => string[];

export const chainSectionReplacements = (
  sections: string[],
  ...sectionReplacements: SectionReplacement[]
) =>
  sectionReplacements.reduce(
    (accumulator, sectionReplacement) => sectionReplacement(accumulator),
    sections,
  );

/**
 * Split by new line characters that are followed by a section header (e.g. [Pad1])
 */
export const splitConfigBySection = (config: string) =>
  config.split(new RegExp(`${EOL}(?=\\[[^]+])`));

export const findConfigFile = (path: string, fileName: string) =>
  readdirSync(path, { encoding: "utf8", withFileTypes: true, recursive: true })
    .filter((file) => file.isFile() && file.name === fileName)
    .map(({ name, path }) => nodepath.join(path, name))
    .at(0);

export const getFlatpakConfigPath = (flatpakId: string) =>
  spawnSync("flatpak", [
    "run",
    "--command=bash",
    flatpakId,
    "-c",
    "echo $XDG_CONFIG_HOME",
  ])
    .stdout.toString()
    .trim();

export const getFlatpakDataPath = (flatpakId: string) =>
  spawnSync("flatpak", [
    "run",
    "--command=bash",
    flatpakId,
    "-c",
    "echo $XDG_DATA_HOME",
  ])
    .stdout.toString()
    .trim();

export const writeConfig = (filePath: string, content: string) => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(nodepath.dirname(filePath), { recursive: true });
  }
  fs.writeFileSync(filePath, content, "utf8");
};
