import nodepath from "node:path";
import fs from "node:fs";
import sdl from "@kmamal/sdl";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { log } from "../../../debug.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL } from "node:os";
import { getPlayerIndexArray } from "../../../../types/gamepad.js";
import { isWindows } from "../../../operationsystem.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { getKeyboardButtonMappings } from "./keyboardConfig.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const flatpakId = "org.flycast.Flycast";
const applicationId: ApplicationId = "flycast";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "flycast.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const keyboardConfigFileName = "SDL_Keyboard.cfg";
const keyboardConfigPathRelative = nodepath.join(
  "mappings",
  keyboardConfigFileName,
);
export const getKeyboardConfigFilePath = () =>
  nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
    keyboardConfigPathRelative,
  );

const readKeyboardConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "flycast",
      "keyboard config file can not be read. defaultSettings will be used.",
      error,
    );
    return ``;
  }
};

const replaceKeyboardDigitalConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[digital]", [
    ...getKeyboardButtonMappings(),
    { keyValue: `bind15 = ${sdl.keyboard.SCANCODE.F1}:btn_quick_save` },
    { keyValue: `bind16 = ${sdl.keyboard.SCANCODE.F2}:btn_menu` },
    { keyValue: `bind17 = ${sdl.keyboard.SCANCODE.F3}:btn_jump_state` },
  ]);

const replaceKeyboardEmulatorConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[emulator]", [
    { keyValue: "mapping_name = Keyboard" },
    { keyValue: "version = 3" },
  ]);

const replaceKeyboardConfigFile = () => {
  const filePath = getKeyboardConfigFilePath();
  const fileContent = readKeyboardConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceKeyboardDigitalConfig,
    replaceKeyboardEmulatorConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getJoystickBindIndices = () => {
  const playerIndexArray = getPlayerIndexArray(sdl.joystick.devices);
  log("debug", "flycast", "joysticks", sdl.joystick.devices, playerIndexArray);

  return playerIndexArray.flatMap((playerIndex, sdlIndex) => [
    // set order of gamepads
    ...["--config", `input:maple_sdl_joystick_${sdlIndex}=${playerIndex}`],
    // map to Sega Controller
    ...["--config", `input:device${sdlIndex + 1}=0`],
    // set VMU
    ...["--config", `input:device${sdlIndex + 1}.1=1`],
    // set rumble
    ...["--config", `input:device${sdlIndex + 1}.2=3`],
  ]);
};

const getConfigFileBasePath = () => {
  const windowsConfigFolder = nodepath.join(
    bundledEmulatorsPathBase,
    applicationId,
  );
  const { config } = envPaths("flycast", { suffix: "" });

  return isWindows()
    ? nodepath.join(windowsConfigFolder)
    : nodepath.join(config);
};

export const flycast: Application = {
  id: applicationId,
  name: "Flycast",
  fileExtensions: [".cue", ".chd", ".gdi", ".cdi"],
  flatpakId,
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: ["emu.cfg", keyboardConfigPathRelative],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    replaceKeyboardConfigFile();

    const keyboardBindIndex = ["--config", `input:maple_sdl_keyboard=0`];

    const contentPath = [
      "--config",
      `config:Dreamcast.ContentPath=${nodepath.join(categoriesPath, categoryData.name)}`,
    ];

    const optionParams = [
      ...contentPath,
      ...getJoystickBindIndices(),
      ...keyboardBindIndex,
    ];
    if (fullscreen) {
      optionParams.push("--config");
      optionParams.push("window:fullscreen=yes");
    }
    return optionParams;
  },
  bundledPath,
};
