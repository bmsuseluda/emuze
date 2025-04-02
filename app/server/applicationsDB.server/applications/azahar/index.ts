import type { Application } from "../../types";
import type { ApplicationId } from "../../applicationId";
import nodepath from "path";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../../../debug.server";
import { EOL, homedir } from "os";
import { keyboardConfig } from "./keyboardConfig";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads";
import type { SectionReplacement } from "../../configFile";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile";
import fs from "fs";
import { defaultSettings } from "./defaultSettings";
import { isWindows } from "../../../operationsystem.server";

const flatpakId = "io.github.lime3ds.Lime3DS";
const applicationId: ApplicationId = "azahar";
const bundledPathLinux = nodepath.join(
  applicationId,
  "azahar-2120.2-linux-appimage",
  "azahar.AppImage",
);
const bundledPathWindows = nodepath.join(
  applicationId,
  "azahar-2120.2-windows-msvc",
  "azahar.exe",
);

const configFileName = "qt-config.ini";

// TODO: implement
export const getVirtualGamepad = (
  sdlDevice: Sdl.Controller.Device,
  index: number,
) => {
  log("debug", "gamepad", { index, sdlDevice });

  return ["", "", ""].join(EOL);
};

// TODO: implement
const getVirtualGamepadReset = (gamepadIndex: number) =>
  [`[Pad${gamepadIndex + 1}]`, "Type = None", "", "", ""].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = sdl.controller.devices;

  const virtualGamepads =
    gamepads.length > 0 ? gamepads.map(getVirtualGamepad) : [keyboardConfig];

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(
      8,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ),
  ];
};

export const replaceGamepadConfig: SectionReplacement = (sections) => {
  if (sections.find((section) => section.startsWith("[Pad1]"))) {
    return sections.reduce<string[]>((accumulator, section) => {
      if (section.startsWith("[Pad1]")) {
        accumulator.push(...getVirtualGamepads());
      } else if (section.startsWith("[Pad]") || !section.startsWith("[Pad")) {
        accumulator.push(section);
      }

      return accumulator;
    }, []);
  } else {
    return [...sections, getVirtualGamepads().join(EOL)];
  }
};

export const replaceMiscellaneousConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Miscellaneous]", [
    "check_for_update_on_start=false",
  ]);

export const replaceUiConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[UI]", [
    "confirmClose=false",
    "Shortcuts\\Main%20Window\\Fullscreen\\KeySeq=F11",
    "Shortcuts\\Main%20Window\\Save%20to%20Oldest%20Slot\\KeySeq=F1",
    "Shortcuts\\Main%20Window\\Load%20from%20Newest%20Slot\\KeySeq=F3",
    // TODO: implement
    `Paths\\romsPath=`,
  ]);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "azahar",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

export const getConfigFilePath = (configFileName: string) => {
  if (isWindows()) {
    // TODO: Check if this is correct
    return nodepath.join(homedir(), "Documents", "azahar-emu", configFileName);
  } else {
    return nodepath.join(homedir(), ".config", "azahar-emu", configFileName);
  }
};

export const replaceConfigSections = () => {
  const filePath = getConfigFilePath(configFileName);
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceUiConfig,
    replaceGamepadConfig,
    replaceMiscellaneousConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const azahar: Application = {
  id: applicationId,
  name: "Azahar",
  fileExtensions: [".cci"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    replaceConfigSections();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};
