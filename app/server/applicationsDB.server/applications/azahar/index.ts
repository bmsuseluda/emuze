import type { Application } from "../../types";
import type { ApplicationId } from "../../applicationId";
import nodepath from "path";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../../../debug.server";
import { EOL } from "os";
import { keyboardConfig } from "./keyboardConfig";
import type { ParamToReplace, SectionReplacement } from "../../configFile";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile";
import fs from "fs";
import { defaultSettings } from "./defaultSettings";
import { app } from "electron";
import { commandLineOptions } from "../../../commandLine.server";
import envPaths from "env-paths";
import { isWindows } from "../../../operationsystem.server";

const flatpakId = "io.github.lime3ds.Lime3DS";
const applicationId: ApplicationId = "azahar";
const bundledPathLinux = nodepath.join(
  applicationId,
  "azahar-2120.3-linux-appimage",
  "azahar.AppImage",
);
const bundledPathWindows = nodepath.join(
  applicationId,
  "azahar-2120.3-windows-msvc",
  "azahar.exe",
);

const configFileName = "qt-config.ini";

export const getVirtualGamepad = (
  sdlDevice: Sdl.Controller.Device,
): ParamToReplace[] => {
  log("debug", "gamepad", { sdlDevice });

  const guid = sdlDevice.guid;

  return [
    { keyValue: "profile=0" },
    { keyValue: "profile\\default=false" },
    {
      keyValue: `profiles\\1\\button_a="button:1,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_a\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_b="button:0,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_b\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_debug="code:79,engine:keyboard"`,
    },
    {
      keyValue: `profiles\\1\\button_debug\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_down="direction:down,engine:sdl,guid:${guid},hat:0,port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_down\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_gpio14="code:80,engine:keyboard"`,
    },
    {
      keyValue: `profiles\\1\\button_gpio14\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_home="button:10,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_home\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_l="button:4,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_l\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_left="direction:left,engine:sdl,guid:${guid},hat:0,port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_left\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_power="code:86,engine:keyboard"`,
    },
    {
      keyValue: `profiles\\1\\button_power\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_r="button:5,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_r\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_right="direction:right,engine:sdl,guid:${guid},hat:0,port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_right\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_select="button:6,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_select\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_start="button:7,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_start\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_up="direction:up,engine:sdl,guid:${guid},hat:0,port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_up\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_x="button:3,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_x\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_y="button:2,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_y\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_zl="axis:2,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_zl\\default=false`,
    },
    {
      keyValue: `profiles\\1\\button_zr="axis:5,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\button_zr\\default=false`,
    },
    {
      keyValue: `profiles\\1\\c_stick="axis_x:3,axis_y:4,deadzone:0.100000,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\c_stick\\default=false`,
    },
    {
      keyValue: `profiles\\1\\circle_pad="axis_x:0,axis_y:1,deadzone:0.100000,engine:sdl,guid:${guid},port:0"`,
    },
    {
      keyValue: `profiles\\1\\circle_pad\\default=false`,
    },
  ];
};

export const replaceGamepadConfig: SectionReplacement = (sections) => {
  const gamepads = sdl.controller.devices;
  const virtualGamepad =
    gamepads.length > 0 ? getVirtualGamepad(gamepads[0]) : keyboardConfig;

  return replaceSection(sections, "[Controls]", virtualGamepad);
};

export const replaceMiscellaneousConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Miscellaneous]", [
    { keyValue: "check_for_update_on_start=false" },
    { keyValue: "check_for_update_on_start\\default=false" },
  ]);

// TODO: add default programmatically
export const replaceUiConfig =
  (n3dsRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[UI]", [
      { keyValue: "confirmClose=false" },
      { keyValue: "confirmClose\\default=false" },
      { keyValue: "Shortcuts\\Main%20Window\\Fullscreen\\KeySeq=F2" },
      {
        keyValue: "Shortcuts\\Main%20Window\\Fullscreen\\KeySeq\\default=false",
      },
      {
        keyValue:
          "Shortcuts\\Main%20Window\\Save%20to%20Oldest%20Slot\\KeySeq=F1",
      },
      {
        keyValue:
          "Shortcuts\\Main%20Window\\Save%20to%20Oldest%20Slot\\KeySeq\\default=false",
      },
      {
        keyValue:
          "Shortcuts\\Main%20Window\\Load%20from%20Newest%20Slot\\KeySeq=F3",
      },
      {
        keyValue:
          "Shortcuts\\Main%20Window\\Load%20from%20Newest%20Slot\\KeySeq\\default=false",
      },
      { keyValue: "Shortcuts\\Main%20Window\\Load%20Amiibo\\KeySeq=" },
      {
        keyValue:
          "Shortcuts\\Main%20Window\\Load%20Amiibo\\KeySeq\\default=false",
      },
      { keyValue: "Shortcuts\\Main%20Window\\Remove%20Amiibo\\KeySeq=" },
      {
        keyValue:
          "Shortcuts\\Main%20Window\\Remove%20Amiibo\\KeySeq\\default=false",
      },
      { keyValue: `Paths\\romsPath=${n3dsRomsPath}` },
      {
        keyValue: "firstStart=false",
      },
      {
        keyValue: "firstStart\\default=false",
      },
      { keyValue: "fullscreen\\default=true" },
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
    const { config } = envPaths("Azahar", { suffix: "" });
    return nodepath.join(config, configFileName);
  } else {
    const { config } = envPaths("azahar", { suffix: "emu" });
    return nodepath.join(config, configFileName);
  }
};

export const replaceConfigSections = (n3dsRomsPath: string) => {
  const filePath = getConfigFilePath(configFileName);
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceUiConfig(n3dsRomsPath),
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
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const n3dsRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(n3dsRomsPath);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};

export const isLime3dsFor3ds = () =>
  app?.commandLine.hasSwitch(commandLineOptions.lime3ds.id) ||
  process.env.EMUZE_LIME3DS === "true";
