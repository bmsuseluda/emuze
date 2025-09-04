import { getVirtualGamepadsSaturn } from "../VirtualGamepadSaturn.js";
import {
  eightBitDoPro2,
  eightBitDoPro2SecondDevice,
  gamepadPs4,
  steamDeck,
} from "./testData.js";

vi.mock("@kmamal/sdl");
vi.mock("node-hid");

describe("VirtualGamepadSaturn", () => {
  describe("getVirtualGamepadsSaturn", () => {
    it("Should map gamepads", () => {
      const result = getVirtualGamepadsSaturn([
        steamDeck,
        gamepadPs4,
        eightBitDoPro2,
        eightBitDoPro2SecondDevice,
      ]);

      // steam deck is configured as last input
      const steamDeckDpadUpIndex = result.findIndex(
        (line) => line === "-ss.input.port4.3dpad.up",
      );
      expect(steamDeckDpadUpIndex).toBeGreaterThan(-1);
      expect(result.at(steamDeckDpadUpIndex + 1)).toContain(steamDeck.id);

      const ps4DpadUpIndex = result.findIndex(
        (line) => line === "-ss.input.port1.3dpad.up",
      );
      expect(ps4DpadUpIndex).toBeGreaterThan(-1);
      expect(result.at(ps4DpadUpIndex + 1)).toContain(gamepadPs4.id);
    });
  });
});
