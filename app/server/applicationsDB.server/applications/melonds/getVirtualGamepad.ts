import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import { getButtonIndex, isDpadHat } from "../../../../types/gamepad.js";
import { getControllers } from "../../../gamepad.server.js";
import type { ParamToReplace } from "../../configFile.js";
import type { MelonDsButtonId } from "./types.js";

const melonDsButtonMapping = {
  Up: "dpup",
  Left: "dpleft",
  Down: "dpdown",
  Right: "dpright",
  B: "a",
  A: "b",
  Y: "x",
  X: "y",
  Select: "back",
  Start: "start",
  L: "leftshoulder",
  R: "rightshoulder",
  HK_SwapScreens: "rightstick",
} satisfies Record<MelonDsButtonId, SdlButtonId>;

const getMelonDsDpadHatMapping = (melonDsButtonId: MelonDsButtonId) => {
  switch (melonDsButtonId) {
    case "Up":
      return 257;
    case "Down":
      return 260;
    case "Left":
      return 264;
    case "Right":
      return 258;
    default:
      return null;
  }
};

const getDpadButtonMapping = (
  mappingObject: SdlButtonMapping,
  melonDsButtonId: MelonDsButtonId,
): ParamToReplace => {
  const sdlButtonId = melonDsButtonMapping[melonDsButtonId];
  let buttonId;

  if (isDpadHat(mappingObject, sdlButtonId)) {
    buttonId = getMelonDsDpadHatMapping(melonDsButtonId);
  } else {
    buttonId = getButtonIndex(mappingObject, sdlButtonId);
  }

  return {
    keyValue: `${melonDsButtonId} = ${buttonId}`,
  };
};

const getButtonMapping = (
  mappingObject: SdlButtonMapping,
  melonDsButtonId: MelonDsButtonId,
): ParamToReplace => {
  const sdlButtonId = melonDsButtonMapping[melonDsButtonId];

  return {
    keyValue: `${melonDsButtonId} = ${getButtonIndex(mappingObject, sdlButtonId)}`,
  };
};

export const getVirtualGamepad = (): ParamToReplace[] => {
  const emuzeControllers = getControllers();
  if (emuzeControllers.length > 0) {
    const { mappingObject } = emuzeControllers[0];

    return [
      getDpadButtonMapping(mappingObject, "Up"),
      getDpadButtonMapping(mappingObject, "Down"),
      getDpadButtonMapping(mappingObject, "Left"),
      getDpadButtonMapping(mappingObject, "Right"),
      getButtonMapping(mappingObject, "A"),
      getButtonMapping(mappingObject, "B"),
      getButtonMapping(mappingObject, "X"),
      getButtonMapping(mappingObject, "Y"),
      getButtonMapping(mappingObject, "L"),
      getButtonMapping(mappingObject, "R"),
      getButtonMapping(mappingObject, "Select"),
      getButtonMapping(mappingObject, "Start"),
      getButtonMapping(mappingObject, "HK_SwapScreens"),
    ];
  }

  return [];
};
