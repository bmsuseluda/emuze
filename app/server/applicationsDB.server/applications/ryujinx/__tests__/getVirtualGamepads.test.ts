import { createControllerId } from "../getVirtualGamepads.js";
import { gamepadPs3, steamDeck } from "../../../../../types/gamepad.js";

describe("ryujinx", () => {
  describe("createControllerId", () => {
    it("Should create controller IDs", () => {
      const controllerIds: { name: string }[] = [];

      expect(createControllerId(controllerIds, steamDeck.guid)).toBe(
        "0-00000003-28de-0000-ff11-000001000000",
      );
      expect(createControllerId(controllerIds, gamepadPs3.guid)).toBe(
        "0-00000005-054c-0000-6802-000000800000",
      );
      expect(createControllerId(controllerIds, gamepadPs3.guid)).toBe(
        "1-00000005-054c-0000-6802-000000800000",
      );
      expect(createControllerId(controllerIds, steamDeck.guid)).toBe(
        "1-00000003-28de-0000-ff11-000001000000",
      );
    });
  });
});
