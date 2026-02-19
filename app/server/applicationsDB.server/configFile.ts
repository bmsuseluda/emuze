import type { X2jOptions } from "fast-xml-parser";
import { XMLParser } from "fast-xml-parser";
import fs from "node:fs";
import nodepath from "node:path";
import { EOL } from "os";
import { log } from "../debug.server.js";

type Param = `${string}=${string}`;

export interface ParamToReplace {
  keyValue: Param;
  disableParamWithSameValue?: boolean;
}

/**
 * Removes old params if they should be set with the new params
 * Disables a param if the keybinding should be used for another param
 */
export const replaceParams = (
  params: string[],
  paramsToReplace: ParamToReplace[],
  removeOtherParams: boolean = false,
) => {
  const otherParams = removeOtherParams
    ? [params[0]]
    : params.reduce<string[]>((accumulator, param) => {
        const [id, value] = param.split("=");
        if (
          id.trim().length > 0 &&
          !paramsToReplace.find((paramToReplace) =>
            paramToReplace.keyValue.startsWith(id + "="),
          )
        ) {
          if (
            paramsToReplace.find(
              (paramToReplace) =>
                value &&
                paramToReplace.keyValue.includes(value) &&
                paramToReplace.disableParamWithSameValue,
            )
          ) {
            // Disable the param if it is used for another keybinding
            accumulator.push(id + "=");
          } else {
            accumulator.push(param);
          }
        }

        return accumulator;
      }, []);

  return [
    ...otherParams,
    ...paramsToReplace.map(({ keyValue }) => keyValue),
    "",
    "",
    "",
  ];
};

const newLineRegEx = /\r?\n/;

const splitByNewLine = (text: string) => text.split(newLineRegEx);
export const normalizeNewLines = (text: string) =>
  text.replaceAll(new RegExp(newLineRegEx, "g"), EOL);

export const replaceSection = (
  sections: string[],
  sectionName: string,
  paramsToSet: ParamToReplace[],
  removeOtherParams?: boolean,
) => {
  const sectionIndex = sections.findIndex((section) =>
    section.includes(sectionName),
  );

  if (sectionIndex !== -1) {
    const sectionRows = splitByNewLine(sections[sectionIndex]);
    const mergedSectionRows = replaceParams(
      sectionRows,
      paramsToSet,
      removeOtherParams,
    );
    sections.splice(sectionIndex, 1, mergedSectionRows.join(EOL));
    return sections;
  }

  return [
    ...sections,
    [sectionName, ...paramsToSet.map(({ keyValue }) => keyValue)].join(EOL),
  ];
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
export const splitConfigBySection = (config: string) => {
  return config.split(new RegExp(`${newLineRegEx.source}(?=\\[[^]+\\])`));
};

export const writeConfig = (filePath: string, content: string) => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(nodepath.dirname(filePath), { recursive: true });
  }
  fs.writeFileSync(filePath, content, "utf8");
};

export const replaceGamepadConfigSection =
  (
    virtualGamepads: string[],
    gamepadSectionName: string,
    isNoGamepadSection: (section: string) => boolean,
  ): SectionReplacement =>
  (sections) => {
    if (sections.find((section) => section.startsWith(gamepadSectionName))) {
      return sections.reduce<string[]>((accumulator, section) => {
        if (section.startsWith(gamepadSectionName)) {
          accumulator.push(...virtualGamepads);
        } else if (isNoGamepadSection(section)) {
          accumulator.push(section);
        }

        return accumulator;
      }, []);
    } else {
      return [...sections, virtualGamepads.join(EOL)];
    }
  };

export const readXmlConfigFile = (
  filePath: string,
  defaultConfig: string,
  parseOptions?: X2jOptions,
) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    ...(parseOptions || {}),
  });
  try {
    const file = fs.readFileSync(filePath, "utf8");
    return parser.parse(file);
  } catch (error) {
    log("debug", "config file can not be read.", filePath, error);

    return parser.parse(defaultConfig);
  }
};
