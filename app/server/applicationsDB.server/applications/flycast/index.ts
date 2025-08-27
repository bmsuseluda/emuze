import nodepath from "node:path";
import fs from "node:fs";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { log } from "../../../debug.server.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL } from "node:os";
import {
  getPlayerIndexArray,
  keyboardMapping,
  type EmuzeButtonId,
} from "../../../../types/gamepad.js";
import { isWindows } from "../../../operationsystem.server.js";

const flatpakId = "org.flycast.Flycast";
const applicationId: ApplicationId = "flycast";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "flycast.exe");

const { config } = envPaths("flycast", { suffix: "" });

const flycastButtonIds = {
  leftStickUp: { id: "btn_analog_up", bindIndex: 13 },
  leftStickDown: { id: "btn_analog_down", bindIndex: 10 },
  leftStickLeft: { id: "btn_analog_left", bindIndex: 0 },
  leftStickRight: { id: "btn_analog_right", bindIndex: 1 },
  dpadUp: { id: "btn_dpad1_up", bindIndex: 11 },
  dpadLeft: { id: "btn_dpad1_left", bindIndex: 2 },
  dpadDown: { id: "btn_dpad1_down", bindIndex: 3 },
  dpadRight: { id: "btn_dpad1_right", bindIndex: 4 },
  a: { id: "btn_a", bindIndex: 6 },
  b: { id: "btn_b", bindIndex: 7 },
  x: { id: "btn_x", bindIndex: 12 },
  y: { id: "btn_y", bindIndex: 5 },
  leftTrigger: { id: "btn_trigger_left", bindIndex: 8 },
  rightTrigger: { id: "btn_trigger_right", bindIndex: 9 },
  start: { id: "btn_start", bindIndex: 14 },
} satisfies Partial<Record<EmuzeButtonId, { id: string; bindIndex: number }>>;

const getWindowsConfigFolder = () =>
  nodepath.join(process.env.APPDIR || "", "emulators", applicationId);

const keyboardConfigFileName = "SDL_Keyboard.cfg";
export const getKeyboardConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(
      getWindowsConfigFolder(),
      "mappings",
      keyboardConfigFileName,
    );
  } else {
    return nodepath.join(config, "mappings", keyboardConfigFileName);
  }
};

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

const getKeyboardButtonMappings = (): ParamToReplace[] =>
  Object.entries(flycastButtonIds).map(
    ([sdlBttonId, { id: flycastButtonId, bindIndex }]) => {
      const sdlScancodeName: Sdl.Keyboard.ScancodeNames =
        keyboardMapping[sdlBttonId as EmuzeButtonId];
      const sdlScancode = sdl.keyboard.SCANCODE[sdlScancodeName];

      return {
        keyValue: `bind${bindIndex} = ${sdlScancode}:${flycastButtonId}`,
      };
    },
  );

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

export const flycast: Application = {
  id: applicationId,
  name: "Flycast",
  fileExtensions: [".cue", ".chd", ".gdi", ".cdi"],
  flatpakId,
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
  bundledPathLinux,
  bundledPathWindows,
};
