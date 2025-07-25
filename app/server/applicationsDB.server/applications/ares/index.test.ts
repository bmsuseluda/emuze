import { createDeviceId, getVirtualGamepad } from "./index.js";
import {
  gamepadPs3,
  gamepadPs4,
  steamDeck,
} from "../../../../types/gamepad.js";

vi.mock("@kmamal/sdl");

describe("ares", () => {
  describe("createDeviceId", () => {
    it("Should create a device id for the Steam Deck internal controls (id 0)", () => {
      const result = createDeviceId(steamDeck);
      expect(result).toBe("0x128de11ff");
    });

    it("Should create a device id for the DualShock 4  (id 1)", () => {
      const result = createDeviceId(gamepadPs4);
      expect(result).toBe("0x2054c05c4");
    });

    it("Should create a device id for the DualShock 3  (id 2)", () => {
      const result = createDeviceId(gamepadPs3);
      expect(result).toBe("0x3054c0268");
    });
  });

  describe("getVirtualGamepad", () => {
    it("Should position the Steam Deck controls on first position if there are no other gamepdads connected", () => {
      const result = getVirtualGamepad(true)(steamDeck, 0);

      expect(result.at(1)).toContain("VirtualPad1");
      expect(result.at(1)).toContain("0x128de11ff");
    });

    it("Should position the Steam Deck controls on last position if there are other gamepdads connected", () => {
      const result = getVirtualGamepad(true)(steamDeck, 4);

      expect(result.at(1)).toContain("VirtualPad5");
      expect(result.at(1)).toContain("0x128de11ff");
    });
  });
});
