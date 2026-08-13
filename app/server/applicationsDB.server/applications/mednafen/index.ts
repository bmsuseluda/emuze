import type { Application, OptionParamFunction } from "../../types.js";
import { isWindows } from "../../../operationsystem.server.js";
import nodepath from "node:path";
import { getVirtualGamepadsSaturn } from "./VirtualGamepadSaturn.js";
import { getVirtualGamepadsPcEngine } from "./VirtualGamepadPcEngine.js";
import { getKeyboardKey } from "./keyboardConfig.js";
import { applicationId, bundledPath } from "./definitions.js";
import { log } from "../../../debug.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { homedir } from "node:os";
import { normalizeString } from "../../../igdb.server.js";
import { getMappedGamepads } from "./initGamepadIDs.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const getSharedMednafenOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
}) => {
  const hotkeySave = ["-command.save_state", getKeyboardKey("F1")];
  const hotkeyLoad = ["-command.load_state", getKeyboardKey("F3")];
  const hotkeyHelp = ["-command.toggle_help", getKeyboardKey("F2")];
  const hotkeyCommandKey = ["-command.input_configc", getKeyboardKey("F4")];
  const hotkeySyncAnalog = ["-command.input_config_abd", getKeyboardKey("F5")];
  const hotkeyFullscreen = ["-command.toggle_fs", getKeyboardKey("F11")];
  const disabledHotkeys = [
    "-command.togglenetview",
    "",
    "-command.0",
    "",
    "-command.8",
    "",
    "-command.9",
    "",
  ];
  const soundDevice = !isWindows()
    ? ["-sound.device", "sexyal-literal-default"]
    : [];
  const setFullscreen = fullscreen ? ["-video.fs", "1"] : ["-video.fs", "0"];

  return [
    ...hotkeyHelp,
    ...hotkeyCommandKey,
    ...hotkeyFullscreen,
    ...hotkeySyncAnalog,
    ...disabledHotkeys,
    ...hotkeySave,
    ...hotkeyLoad,
    ...soundDevice,
    ...setFullscreen,
  ];
};

const getConfigFileBasePath = () =>
  isWindows()
    ? nodepath.join(bundledEmulatorsPathBase, applicationId)
    : nodepath.join(homedir(), `.${applicationId}`);

export const mednafen: Application = {
  id: applicationId,
  name: "Mednafen",
  fileExtensions: [".cue", ".zip"],
  configFile: {
    basePath: getConfigFileBasePath(),
    files: ["mednafen.cfg", "cheats", "firmware", "sav"],
  },
  defineEnvironmentVariables: () => {
    const environmentVariables: Record<string, string> = {
      ...sdlGameControllerConfig,
      SDL_ENABLE_SCREEN_KEYBOARD: "0",
    };

    if (isWindows()) {
      environmentVariables.MEDNAFEN_HOME = nodepath.dirname(
        nodepath.join(bundledEmulatorsPathBase, bundledPath),
      );
      environmentVariables.MEDNAFEN_NOPOPUPS = "1";
    }
    return environmentVariables;
  },
  createOptionParams: getSharedMednafenOptionParams,
  bundledPath,
};

const hiresGames = [
  "Dead or Alive",
  "DecAthlete",
  "Fighting Vipers",
  "Fighters Megamix",
  "Last Bronx",
  "Virtua Fighter 2",
  "Winter Heat",
].map(normalizeString);

const fixInterlacingSaturn = (gameName: string) => {
  const gameNameNormalized = normalizeString(gameName);
  if (hiresGames.includes(gameNameNormalized)) {
    return ["-video.deinterlacer", "bob_offset"];
  }

  return [];
};

const saturnBiosTypes = {
  us: "na_eu",
  japan: "jp",
};
export const mednafenSaturn: Application = {
  ...mednafen,
  createOptionParams: (props) => {
    const mappedGamepads = getMappedGamepads();
    const virtualGamepadsSaturn = getVirtualGamepadsSaturn(mappedGamepads);
    log("debug", "createOptionParams", virtualGamepadsSaturn);
    return [
      ...["-force_module", "ss"],
      ...props.biosFiles!.flatMap(({ type, filePath }) => [
        `-ss.bios_${type}`,
        filePath,
      ]),
      ...fixInterlacingSaturn(props.entryData.name),
      ...mednafen.createOptionParams!(props),
      ...virtualGamepadsSaturn,
    ];
  },
  biosFiles: [
    {
      type: saturnBiosTypes.us,
      requiredFiles: [
        {
          filename: "mpr-17933.bin",
          hash: "96e106f740ab448cf89f0dd49dfbac7fe5391cb6bd6e14ad5e3061c13330266f",
        },
      ],
    },
    {
      type: saturnBiosTypes.japan,
      requiredFiles: [
        {
          filename: "sega_101.bin",
          hash: "dcfef4b99605f872b6c3b6d05c045385cdea3d1b702906a0ed930df7bcb7deac",
        },
      ],
    },
  ],
};

export const mednafenPcEngineCD: Application = {
  ...mednafen,
  createOptionParams: (props) => {
    const mappedGamepads = getMappedGamepads();
    const virtualGamepadsPcEngine = getVirtualGamepadsPcEngine(mappedGamepads);
    log("debug", "createOptionParams", virtualGamepadsPcEngine);
    return [
      ...["-force_module", "pce"],
      ...["-pce.cdbios", props.biosFiles!.at(0)!.filePath],
      ...["-pce.cddavolume", "100"], // music
      ...["-pce.cdpsgvolume", "50"], // shooting
      ...["-pce.adpcmvolume", "50"], // explosions
      ...mednafen.createOptionParams!(props),
      ...virtualGamepadsPcEngine,
    ];
  },
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        /** Japan */
        {
          filename: "syscard3.pce",
          hash: "e11527b3b96ce112a037138988ca72fd117a6b0779c2480d9e03eaebece3d9ce",
        },
        /** US */
        {
          filename: "syscard3.pce",
          hash: "cadac2725711b3c442bcf237b02f5a5210c96f17625c35fa58f009e0ed39e4db",
        },
        {
          filename: "syscard2.pce",
          hash: "7abb2f2241d78b105aa63efb43c3c2bae1a94ebfd25376fdd17172c947b6267f",
        },
        /** Japan */
        {
          filename: "syscard1.pce",
          hash: "afe9f27f91ac918348555b86298b4f984643eafa2773196f2c5441ea84f0c3bb",
        },
        /** US */
        {
          filename: "syscard1.pce",
          hash: "bdd98396a3a81e61456599df0c5156aa2164fb64b5c303830f0254b3697b6290",
        },
      ],
    },
  ],
};
