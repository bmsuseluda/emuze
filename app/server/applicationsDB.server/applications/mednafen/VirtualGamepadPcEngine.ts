import { log } from "../../../debug.server.js";
import { VirtualGamepad } from "./VirtualGamepad.js";
import { getKeyboardMapping } from "./keyboardConfig.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { getPhysicalGamepad } from "./getPhysicalGamepad.js";
import {
  DetectSdlGuidIndex,
  EmuzeController,
  getSdlGuidIndex,
} from "../../../gamepad.server.js";

type MednafenButtonIdPcEngine =
  | "up"
  | "down"
  | "left"
  | "right"
  | "i"
  | "ii"
  | "iii"
  | "iv"
  | "v"
  | "vi"
  | "select"
  | "run"
  | "mode_select"
  | "rapid_i"
  | "rapid_ii";

const system = "pce";

export const getVirtualGamepadReset = (index: number) => {
  const { disableButtonMapping } = new VirtualGamepad<MednafenButtonIdPcEngine>(
    index,
    system,
  );
  return [
    ...disableButtonMapping("up"),
    ...disableButtonMapping("down"),
    ...disableButtonMapping("left"),
    ...disableButtonMapping("right"),
    ...disableButtonMapping("i"),
    ...disableButtonMapping("ii"),
    ...disableButtonMapping("iii"),
    ...disableButtonMapping("iv"),
    ...disableButtonMapping("v"),
    ...disableButtonMapping("vi"),
    ...disableButtonMapping("rapid_i"),
    ...disableButtonMapping("rapid_ii"),
    ...disableButtonMapping("mode_select"),
    ...disableButtonMapping("select"),
    ...disableButtonMapping("run"),
  ];
};

export const getKeyboardPcEngine = () => {
  const { initialize, createButtonMapping, disableButtonMapping } =
    new VirtualGamepad<MednafenButtonIdPcEngine>(0, system);
  return [
    ...initialize(),
    ...createButtonMapping(
      "up",
      getKeyboardMapping("dpadUp"),
      getKeyboardMapping("leftStickUp"),
    ),
    ...createButtonMapping(
      "down",
      getKeyboardMapping("dpadDown"),
      getKeyboardMapping("leftStickDown"),
    ),
    ...createButtonMapping(
      "left",
      getKeyboardMapping("dpadLeft"),
      getKeyboardMapping("leftStickLeft"),
    ),
    ...createButtonMapping(
      "right",
      getKeyboardMapping("dpadRight"),
      getKeyboardMapping("leftStickRight"),
    ),
    ...createButtonMapping("i", getKeyboardMapping("b")),
    ...createButtonMapping("ii", getKeyboardMapping("a")),
    ...disableButtonMapping("iii"),
    ...disableButtonMapping("iv"),
    ...disableButtonMapping("v"),
    ...disableButtonMapping("vi"),
    ...createButtonMapping("rapid_i", getKeyboardMapping("y")),
    ...createButtonMapping("rapid_ii", getKeyboardMapping("x")),
    ...disableButtonMapping("mode_select"),
    ...createButtonMapping("select", getKeyboardMapping("back")),
    ...createButtonMapping("run", getKeyboardMapping("start")),
  ];
};

export const getVirtualGamepadPcEngine =
  (detectSdlGuidIndex: DetectSdlGuidIndex) =>
  (emuzeController: EmuzeController, index: number) => {
    log("debug", "gamepad", emuzeController);
    const { initialize, createButtonMapping, disableButtonMapping } =
      new VirtualGamepad<MednafenButtonIdPcEngine>(
        emuzeController.player,
        system,
      );
    const physicalGamepad = getPhysicalGamepad(
      emuzeController,
      detectSdlGuidIndex,
      index,
    );

    return [
      ...initialize(),
      ...createButtonMapping(
        "up",
        physicalGamepad.getDpadUp(),
        physicalGamepad.getLeftStickUp(),
      ),
      ...createButtonMapping(
        "down",
        physicalGamepad.getDpadDown(),
        physicalGamepad.getLeftStickDown(),
      ),
      ...createButtonMapping(
        "left",
        physicalGamepad.getDpadLeft(),
        physicalGamepad.getLeftStickLeft(),
      ),
      ...createButtonMapping(
        "right",
        physicalGamepad.getDpadRight(),
        physicalGamepad.getLeftStickRight(),
      ),
      ...createButtonMapping("i", physicalGamepad.getB()),
      ...createButtonMapping("ii", physicalGamepad.getA()),
      ...disableButtonMapping("iii"),
      ...disableButtonMapping("iv"),
      ...disableButtonMapping("v"),
      ...disableButtonMapping("vi"),
      ...createButtonMapping("rapid_i", physicalGamepad.getY()),
      ...createButtonMapping("rapid_ii", physicalGamepad.getX()),
      ...disableButtonMapping("mode_select"),
      ...createButtonMapping("select", physicalGamepad.getBack()),
      ...createButtonMapping("run", physicalGamepad.getStart()),
    ];
  };

export const getVirtualGamepadsPcEngine = (gamepads: EmuzeController[]) => {
  const detectSdlGuidIndex = getSdlGuidIndex(gamepads);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepadPcEngine(detectSdlGuidIndex))
      : getKeyboardPcEngine();
  log("debug", "gamepads", gamepads.length);

  return [
    ...virtualGamepads.flat(),
    ...resetUnusedVirtualGamepads(
      5,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ).flat(),
  ];
};
