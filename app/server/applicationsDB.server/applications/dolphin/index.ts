import type { Application } from "../../types.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL } from "node:os";
import fs from "node:fs";
import { log } from "../../../debug.server.js";
import nodepath from "node:path";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { defaultGamepadSettings } from "./defaultGamepadSettings.js";
import { defaultHotkeys } from "./defaultHotkeys.js";
import type { ApplicationId } from "../../applicationId.js";
import { emulatorsDirectory } from "../../../homeDirectory.server.js";
import {
  getNameIndex,
  getPlayerIndexArray,
  isGamecubeController,
} from "../../../../types/gamepad.js";
import { defaultDolphinSettings } from "./defaultDolphinSettings.js";
import { keyboardConfig } from "./keyboardConfig.js";
import { isSteamOs, isWindows } from "../../../operationsystem.server.js";

const flatpakId = "org.DolphinEmu.dolphin-emu";
const applicationId: ApplicationId = "dolphin";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "Dolphin.exe");
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

export const getVirtualGamepad =
  (
    devices: Sdl.Joystick.Device[] | Sdl.Controller.Device[],
    playerIndexArray: number[],
  ) =>
  (controller: Sdl.Joystick.Device | Sdl.Controller.Device, index: number) => {
    log("debug", "gamepad", { index, controller });

    const deviceName = controller.name!;
    const nameIndex = getNameIndex(deviceName, index, devices);

    const gamecubeController = isGamecubeController(deviceName);

    return [
      `[GCPad${playerIndexArray[index] + 1}]`,
      `Device = SDL/${nameIndex}/${deviceName}`,
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
  const gamepads =
    isSteamOs() || isWindows() ? sdl.joystick.devices : sdl.controller.devices;
  const playerIndexArray = getPlayerIndexArray(sdl.joystick.devices);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(gamepads, playerIndexArray))
      : [keyboardConfig];

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
      (index: number): ParamToReplace => ({
        keyValue: `SIDevice${index} = 0`,
      }),
    ),
  ];

  return replaceSection(sections, "[Core]", siDevices);
};

export const replaceDolphinFile = () =>
  replaceConfigSections(
    dolphinConfigFileName,
    defaultDolphinSettings,
    replaceDolphinCoreSection,
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
      general: { categoriesPath },
    },
  }) => {
    replaceDolphinFile();
    replaceGamepadConfigFile();
    replaceHotkeysFile();

    const optionParams = [
      `--user=${configFolderPath}`,
      ...["--config", "Dolphin.Interface.ConfirmStop=False"],
      ...["--config", "Dolphin.Analytics.PermissionAsked=True"],
      ...["--config", "Dolphin.AutoUpdate.UpdateTrack="],
      ...["--config", `Dolphin.General.ISOPath0=${categoriesPath}`],
      ...["--config", "Dolphin.General.ISOPaths=1"],
      ...["--config", "Dolphin.General.RecursiveISOPaths=True"],
    ];

    if (fullscreen) {
      optionParams.push(...["--config", "Dolphin.Display.Fullscreen=True"]);
      optionParams.push("--batch");
    }

    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};
