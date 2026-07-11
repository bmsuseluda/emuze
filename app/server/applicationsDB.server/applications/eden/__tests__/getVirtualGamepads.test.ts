import { emuzeControllersSteamInput } from "../../../../__testData__/emuzeControllers.js";
import { getSdlGuidIndex } from "../getVirtualGamepads.js";

describe("getVirtualGamepads", () => {
  describe("getSdlGuidIndex", () => {
    it("Should return 2 for player 3 if all players have the same guid", () => {
      const result = getSdlGuidIndex(emuzeControllersSteamInput)(
        emuzeControllersSteamInput[2].guid,
        2,
      );

      expect(result).toBe(2);
    });

    it("Should return 3 for player 4 if all players have the same guid", () => {
      const result = getSdlGuidIndex(emuzeControllersSteamInput)(
        emuzeControllersSteamInput[3].guid,
        3,
      );

      expect(result).toBe(3);
    });
  });
});
