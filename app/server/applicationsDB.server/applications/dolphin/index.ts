import type { Application } from "../../types";
import type { ParamToReplace, SectionReplacement } from "../../configFile";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile";
import { EOL } from "os";
import fs from "fs";
import { log } from "../../../debug.server";
import nodepath from "path";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads";
import { defaultGamepadSettings } from "./defaultGamepadSettings";
import { defaultHotkeys } from "./defaultHotkeys";
import type { ApplicationId } from "../../applicationId";
import { emulatorsDirectory } from "../../../homeDirectory.server";
import { isGamecubeController } from "../../gamepads";
import { defaultDolphinSettings } from "./defaultDolphinSettings";
import { keyboardConfig } from "./keyboardConfig";

const flatpakId = "org.DolphinEmu.dolphin-emu";
const applicationId: ApplicationId = "dolphin";
const bundledPathLinux = nodepath.join(
  applicationId,
  "Dolphin_Emulator-2503-187-anylinux.dwarfs-x86_64.AppImage",
);
const bundledPathWindows = nodepath.join(
  applicationId,
  "Dolphin-x64",
  "Dolphin.exe",
);
const configFolderPath = nodepath.join(emulatorsDirectory, applicationId);
const dolphinConfigFileName = nodepath.join(
  configFolderPath,
  "Config",
  "Dolphin.ini",
);
const gamepadConfigFileName = nodepath.join(
  configFolderPath,
  "Config",
  "GCPadNew.ini",
);
const hotkeysConfigFileName = nodepath.join(
  configFolderPath,
  "Config",
  "Hotkeys.ini",
);

export const getVirtualGamepad = (
  controller: Sdl.Joystick.Device,
  index: number,
) => {
  log("debug", "gamepad", { index, controller });

  const deviceName = controller.name;

  const gamecubeController = isGamecubeController(deviceName);

  return [
    `[GCPad${index + 1}]`,
    `Device = SDL/0/${deviceName}`,
    `Buttons/A = ${gamecubeController ? "`Button S`" : "`Button E`"}`,
    `Buttons/B = ${gamecubeController ? "`Button W`" : "`Button S`"}`,
    `Buttons/X = ${gamecubeController ? "`Button E`" : "`Button N`"}`,
    `Buttons/Y = ${gamecubeController ? "`Button N`" : "`Button W` | `Shoulder L`"}`,
    `Buttons/Z = \`Shoulder R\``,
    `Buttons/Start = Start`,
    `Main Stick/Up = \`Left Y+\``,
    `Main Stick/Down = \`Left Y-\``,
    `Main Stick/Left = \`Left X-\``,
    `Main Stick/Right = \`Left X+\``,
    `Main Stick/Modifier = \`Thumb L\``,
    `Main Stick/Calibration = 100.00 141.42 100.00 141.42 100.00 141.42 100.00 141.42`,
    `C-Stick/Up = \`Right Y+\``,
    `C-Stick/Down = \`Right Y-\``,
    `C-Stick/Left = \`Right X-\``,
    `C-Stick/Right = \`Right X+\``,
    `C-Stick/Modifier = \`Thumb R\``,
    `C-Stick/Calibration = 100.00 141.42 100.00 141.42 100.00 141.42 100.00 141.42`,
    `Triggers/L = \`Trigger L\``,
    `Triggers/R = \`Trigger R\``,
    `D-Pad/Up = \`Pad N\``,
    `D-Pad/Down = \`Pad S\``,
    `D-Pad/Left = \`Pad W\``,
    `D-Pad/Right = \`Pad E\``,
    `Triggers/L-Analog = \`Trigger L\``,
    `Triggers/R-Analog = \`Trigger R\``,
    `Rumble/Motor = \`Motor L\` | \`Motor R\``,
  ].join(EOL);
};

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [
    `[GCPad${gamepadIndex + 1}]`,
    "Device = XInput2/0/Virtual core pointer",
  ].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = sdl.joystick.devices;

  const virtualGamepads =
    gamepads.length > 0 ? gamepads.map(getVirtualGamepad) : [keyboardConfig];

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(4, gamepads.length, getVirtualGamepadReset),
  ];
};

export const replaceGamepadConfigSections: SectionReplacement = (sections) => [
  ...sections,
  getVirtualGamepads().join(EOL),
];

const readConfigFile = (filePath: string, fallback: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "dolphin",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return fallback;
  }
};

export const replaceGamepadConfigFile = () =>
  replaceConfigSections(
    gamepadConfigFileName,
    defaultGamepadSettings,
    replaceGamepadConfigSections,
  );

export const replaceHotkeysSection: SectionReplacement = (sections) =>
  replaceSection(sections, "[Hotkeys]", [
    { keyValue: "General/Toggle Pause = F2", disableParamWithSameValue: true },
    {
      keyValue: "General/Toggle Fullscreen = F11",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "Save State/Save State Slot 1 = F1",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "Load State/Load State Slot 1 = F3",
      disableParamWithSameValue: true,
    },
  ]);

export const replaceHotkeysFile = () =>
  replaceConfigSections(
    hotkeysConfigFileName,
    defaultHotkeys,
    replaceHotkeysSection,
  );

const setDeviceToStandardController = (index: number): ParamToReplace => ({
  keyValue: `SIDevice${index} = 6`,
});

export const replaceDolphinCoreSection: SectionReplacement = (sections) => {
  const gamepads = sdl.joystick.devices;
  const virtualGamepads = gamepads.length > 0 ? gamepads : ["keyboard"];
  const siDevices: ParamToReplace[] = [
    ...virtualGamepads.map((_, index) => setDeviceToStandardController(index)),
    ...resetUnusedVirtualGamepads(
      4,
      virtualGamepads.length,
      (index: number): ParamToReplace => ({ keyValue: `SIDevice${index} = 0` }),
    ),
  ];

  return replaceSection(sections, "[Core]", siDevices);
};

export const replaceDolphinAutoUpdateSection: SectionReplacement = (sections) =>
  replaceSection(sections, "[AutoUpdate]", [{ keyValue: "UpdateTrack = " }]);

export const replaceDolphinFile = () =>
  replaceConfigSections(
    dolphinConfigFileName,
    defaultDolphinSettings,
    replaceDolphinCoreSection,
    replaceDolphinAutoUpdateSection,
  );

export const replaceConfigSections = (
  filePath: string,
  fallback: string,
  ...replaceSectionFunctions: SectionReplacement[]
) => {
  const fileContent = readConfigFile(filePath, fallback);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    ...replaceSectionFunctions,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const dolphin: Application = {
  id: applicationId,
  name: "Dolphin",
  fileExtensions: [".iso", ".rvz"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    replaceDolphinFile();
    replaceGamepadConfigFile();
    replaceHotkeysFile();

    const optionParams = [
      "--config",
      "Dolphin.Interface.ConfirmStop=False",
      `--user=${configFolderPath}`,
      "--config",
      "Dolphin.Analytics.PermissionAsked=True",
    ];

    if (fullscreen) {
      optionParams.push("--config");
      optionParams.push("Dolphin.Display.Fullscreen=True");
      optionParams.push("--batch");
    }

    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};
