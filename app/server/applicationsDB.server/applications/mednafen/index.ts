import type { Application, OptionParamFunction } from "../../types";
import { isWindows } from "../../../operationsystem.server";
import nodepath from "path";
import { log } from "../../../debug.server";
import { execFileSync } from "child_process";
import sdl from "@bmsuseluda/node-sdl";
import type { SdlButtonId, SdlButtonMapping } from "../../gamepads";
import { createSdlMappingObject, getButtonIndex } from "../../gamepads";

const getSharedMednafenOptionParams: OptionParamFunction = () => {
  // TODO: use sdl keyboard enum object
  // save state F1
  const hotkeySave = ["-command.save_state", "keyboard 0x0 62"];
  // load state F3
  const hotkeyLoad = ["-command.load_state", "keyboard 0x0 64"];

  return [
    //   TODO: set fullscreen?
    //   TODO: set help to F2
    ...hotkeySave,
    ...hotkeyLoad,
  ];
};

const findSdlGamepad = (gamepadId: GamepadID, index: number) => {
  const gamepads = sdl.controller.devices;

  const sdlGamepad = gamepads.find((gamepad) => {
    const openedDevice = sdl.controller.openDevice(gamepad);
    log("debug", "findSdlGamepad", gamepadId, gamepad, openedDevice);

    return (
      gamepad.name.toLowerCase().replaceAll(" ", "") ===
        gamepadId.name.toLowerCase().replaceAll(" ", "") ||
      openedDevice.controllerName.toLowerCase().replaceAll(" ", "") ===
        gamepadId.name.toLowerCase().replaceAll(" ", "")
    );
  });

  return sdlGamepad || gamepads.at(index);
};

const createButtonMapping = (
  index: number,
  system: string,
  gamepadID: GamepadID,
  mappingObject: SdlButtonMapping,
  mednafenButtonId: string,
  sdlButtonId: SdlButtonId,
) => {
  const buttonIndex = getButtonIndex(mappingObject, sdlButtonId);

  if (buttonIndex) {
    return [
      `-${system}.input.port${index + 1}.gamepad.${mednafenButtonId}`,
      `joystick ${gamepadID.id} button_${getButtonIndex(mappingObject, sdlButtonId)}`,
    ];
  }

  return [];
};

const createAbsMapping = (
  index: number,
  system: string,
  gamepadID: GamepadID,
  mappingObject: SdlButtonMapping,
  mednafenAbsId: string,
  sdlButtonId: SdlButtonId,
  axisPositive: boolean,
) => {
  const buttonIndex = getButtonIndex(mappingObject, sdlButtonId);

  if (buttonIndex) {
    return [
      `-${system}.input.port${index + 1}.gamepad.${mednafenAbsId}`,
      `joystick ${gamepadID.id} abs_${getButtonIndex(mappingObject, sdlButtonId)}${axisPositive ? "+" : "-"}`,
    ];
  }

  return [];
};

const disableButtonMapping = (
  index: number,
  system: string,
  mednafenButtonId: string,
) => [`-${system}.input.port${index + 1}.gamepad.${mednafenButtonId}`, " "];

export const getVirtualGamepadSaturn = (
  gamepadID: GamepadID,
  index: number,
) => {
  const sdlGamepad = findSdlGamepad(gamepadID, index);

  if (sdlGamepad) {
    log("debug", "gamepad", gamepadID, sdlGamepad);
    const mappingObject = createSdlMappingObject(sdlGamepad.mapping);
    const system = "ss";

    // TODO: map 3d pad as well?

    return [
      ...[`-${system}.input.port${index + 1}`, "gamepad"],
      ...createButtonMapping(index, system, gamepadID, mappingObject, "a", "a"),
      ...createButtonMapping(index, system, gamepadID, mappingObject, "b", "b"),
      ...createAbsMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "c",
        "lefttrigger",
        false,
      ),
      ...createButtonMapping(index, system, gamepadID, mappingObject, "x", "x"),
      ...createButtonMapping(index, system, gamepadID, mappingObject, "y", "y"),
      ...createAbsMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "z",
        "righttrigger",
        true,
      ),
      ...createButtonMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "start",
        "start",
      ),
      ...[
        `-${system}.input.port${index + 1}.gamepad.up`,
        `joystick ${gamepadID.id} abs_7-`,
      ],
      ...[
        `-${system}.input.port${index + 1}.gamepad.down`,
        `joystick ${gamepadID.id} abs_7+`,
      ],
      ...[
        `-${system}.input.port${index + 1}.gamepad.left`,
        `joystick ${gamepadID.id} abs_6-`,
      ],
      ...[
        `-${system}.input.port${index + 1}.gamepad.right`,
        `joystick ${gamepadID.id} abs_6+`,
      ],
      ...createButtonMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "ls",
        "leftshoulder",
      ),
      ...createButtonMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "rs",
        "rightshoulder",
      ),
    ];
  }

  return [];
};

export const getVirtualGamepadPcEngine = (
  gamepadID: GamepadID,
  index: number,
) => {
  const sdlGamepad = findSdlGamepad(gamepadID, index);

  if (sdlGamepad) {
    log("debug", "gamepad", gamepadID, sdlGamepad);
    const mappingObject = createSdlMappingObject(sdlGamepad.mapping);
    const system = "pce";

    return [
      ...[`-${system}.input.port${index + 1}`, "gamepad"],
      ...createButtonMapping(index, system, gamepadID, mappingObject, "i", "b"),
      ...createButtonMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "ii",
        "a",
      ),
      ...disableButtonMapping(index, system, "iii"),
      ...disableButtonMapping(index, system, "iv"),
      ...disableButtonMapping(index, system, "v"),
      ...disableButtonMapping(index, system, "vi"),
      ...disableButtonMapping(index, system, "mode_select"),
      ...createButtonMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "rapid_ii",
        "x",
      ),
      ...createButtonMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "rapid_i",
        "y",
      ),
      ...createButtonMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "select",
        "back",
      ),
      ...createButtonMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "run",
        "start",
      ),
      ...[
        `-${system}.input.port${index + 1}.gamepad.up`,
        `joystick ${gamepadID.id} abs_7-`,
      ],
      //   TODO: combine with dpad if analog stick is available
      ...createAbsMapping(
        index,
        system,
        gamepadID,
        mappingObject,
        "up",
        "lefty",
        false,
      ),
      ...[
        `-${system}.input.port${index + 1}.gamepad.down`,
        `joystick ${gamepadID.id} abs_7+`,
      ],
      ...[
        `-${system}.input.port${index + 1}.gamepad.left`,
        `joystick ${gamepadID.id} abs_6-`,
      ],
      ...[
        `-${system}.input.port${index + 1}.gamepad.right`,
        `joystick ${gamepadID.id} abs_6+`,
      ],
    ];
  }

  return [];
};

interface MednafenError {
  stdout: string;
}

const isMednafenError = (e: any): e is MednafenError =>
  typeof e.stdout === "string";

const extractGamepadIDs = (error: MednafenError): GamepadID[] =>
  error.stdout
    .split("\n")
    .filter((line) => line.trim().startsWith("ID: "))
    .map((line) => {
      const [id, name] = line.trim().split("ID: ")[1].split(" - ");
      return {
        id,
        name,
      };
    });

interface GamepadID {
  id: string;
  name: string;
}

const getGamepads = (applicationPath?: string) => {
  try {
    if (isWindows() && applicationPath) {
      execFileSync(applicationPath, ["wrong"], {
        encoding: "utf8",
      });
    } else {
      execFileSync(
        "flatpak",
        ["run", "--command=mednafen", "com.github.AmatCoder.mednaffe", "wrong"],
        {
          encoding: "utf8",
        },
      );
    }
  } catch (e) {
    if (isMednafenError(e)) {
      const gamepadsIDs = extractGamepadIDs(e);
      log("debug", "mednafen gamepad IDs", gamepadsIDs);
      return gamepadsIDs;
    }
  }
  return [];
};

export const mednafen: Application = {
  id: "mednafen",
  name: "Mednafen",
  fileExtensions: [".cue", ".pce", ".nes", ".sms", ".gg"],
  flatpakId: "com.github.AmatCoder.mednaffe",
  flatpakOptionParams: ["--command=mednafen"],
  defineEnvironmentVariables: ({ applicationPath }) => {
    const environmentVariables = {};
    if (isWindows() && applicationPath) {
      return {
        ...environmentVariables,
        MEDNAFEN_HOME: nodepath.dirname(applicationPath),
      };
    }
    return environmentVariables;
  },
  createOptionParams: getSharedMednafenOptionParams,
};

export const mednafenSaturn: Application = {
  ...mednafen,
  id: "mednafenSaturn",
  createOptionParams: (props) => {
    const virtualGamepads = getGamepads().flatMap(getVirtualGamepadSaturn);
    return [...getSharedMednafenOptionParams(props), ...virtualGamepads];
  },
};

export const mednafenPcEngineCD: Application = {
  ...mednafen,
  id: "mednafenPcEngineCD",
  createOptionParams: (props) => {
    const virtualGamepads = getGamepads().flatMap(getVirtualGamepadPcEngine);
    return [...getSharedMednafenOptionParams(props), ...virtualGamepads];
  },
};

export const mednafenPcEngineSuperGrafx: Application = {
  ...mednafen,
  id: "mednafenPcEngineSuperGrafx",
};
