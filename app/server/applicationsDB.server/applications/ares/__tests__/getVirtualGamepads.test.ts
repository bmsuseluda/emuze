import { getVirtualGamepad } from "../getVirtualGamepads.js";
import { steamDeck } from "../../../../../types/gamepad.js";

vi.mock("@kmamal/sdl");

describe("ares", () => {
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
