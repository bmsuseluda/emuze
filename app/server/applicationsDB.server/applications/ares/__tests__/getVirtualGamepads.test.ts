import { createDeviceId, getVirtualGamepad } from "../getVirtualGamepads.js";
import {
  gamepadPs3,
  gamepadPs4,
  steamDeck,
} from "../../../../../types/gamepad.js";

vi.mock("@kmamal/sdl");

describe("ares", () => {
  describe("createDeviceId", () => {
    it("Should create a device id for the Steam Deck internal controls (id 0)", () => {
      const result = createDeviceId(steamDeck, 0);
      expect(result).toBe("0x128de1205");
    });

    it("Should create a device id for the DualShock 4  (id 1)", () => {
      const result = createDeviceId(gamepadPs4, 1);
      expect(result).toBe("0x2054c05c4");
    });

    it("Should create a device id for the DualShock 3  (id 2)", () => {
      const result = createDeviceId(gamepadPs3, 2);
      expect(result).toBe("0x3054c0268");
    });
  });

  describe("getVirtualGamepad", () => {
    it("Should position the Steam Deck controls on first position if there are no other gamepads connected", () => {
      const result = getVirtualGamepad(
        "nintendoentertainmentsystem",
        true,
        [0],
      )(steamDeck, 0);

      expect(result.at(1)).toContain("VirtualPad1");
      expect(result.at(1)).toContain("0x128de1205");
    });

    it("Should position the Steam Deck controls on last position if there are other gamepads connected", () => {
      const result = getVirtualGamepad(
        "nintendoentertainmentsystem",
        true,
        [4, 0, 1, 2, 3],
      )(steamDeck, 0);

      expect(result.at(1)).toContain("VirtualPad5");
      expect(result.at(1)).toContain("0x128de1205");
    });
  });
});
