import { splitConfigBySection } from "../../../configFile.js";
import {
  controllerPorts,
  getUnusedPad,
  hotkeys,
  hotkeysConfiguredNew,
  hotkeysMerged,
  main,
  pad1,
  ps4Mapped,
  pad2,
  steamDeckMapped,
  pad3,
  eightbitdoMapped,
  pad4,
  eightbitdo2Mapped,
  settings,
  settingsArray,
} from "../__testData__/settings.js";
import { replaceGamepadConfig, replaceHotkeyConfig } from "../index.js";

vi.mock("@kmamal/sdl");

describe("duckstation", () => {
  describe("splitConfigBySection", () => {
    it("Should split config by section", () => {
      expect(splitConfigBySection(settings)).toStrictEqual(settingsArray);
    });
  });

  describe("replaceHotkeyConfig", () => {
    it("Should add a hotkey section if it does not exist", () => {
      const settings = [main, controllerPorts];
      expect(replaceHotkeyConfig(settings)).toStrictEqual([
        main,
        controllerPorts,
        hotkeysConfiguredNew,
      ]);
    });

    it("Should merge the hotkey section if it does already exist", () => {
      const settings = [main, hotkeys, controllerPorts];
      expect(replaceHotkeyConfig(settings)).toStrictEqual([
        main,
        hotkeysMerged,
        controllerPorts,
      ]);
    });
  });

  describe("replaceGamepadConfig", () => {
    it("Should set the connected pads and reset the remaining", () => {
      const settings = [main, pad1, pad2, pad3, pad4, hotkeys];
      expect(replaceGamepadConfig(settings)).toStrictEqual([
        main,
        steamDeckMapped,
        ps4Mapped,
        eightbitdoMapped,
        eightbitdo2Mapped,
        getUnusedPad(5),
        getUnusedPad(6),
        getUnusedPad(7),
        getUnusedPad(8),
        hotkeys,
      ]);
    });
  });
});
