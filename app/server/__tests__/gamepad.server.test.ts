import {
  gamepadPs4,
  removeVendorFromGuid,
  steamDeck,
  steamDeckJoystick,
} from "../../types/gamepad.js";
import { emuzeControllersSteamInput } from "../__testData__/emuzeControllers.js";
import {
  getControllers,
  getDeviceNameFromHid,
  getSdlGuidIndex,
} from "../gamepad.server.js";

vi.mock("@kmamal/sdl");
vi.mock("node-hid");

describe("gamepad.server", () => {
  describe("getControllers", () => {
    it("Should return steam deck last", () => {
      const result = getControllers();
      expect(result.length).toBe(4);
      expect(result.at(-1)?.joystickName).toBe(steamDeckJoystick.name);
    });
  });

  describe("getSdlGuidIndex with vendor removed", () => {
    it("Should return 2 for player 3 if all players have the same guid", () => {
      const result = getSdlGuidIndex(
        emuzeControllersSteamInput,
        removeVendorFromGuid,
      )(emuzeControllersSteamInput[2].guid, 2);

      expect(result).toBe(2);
    });

    it("Should return 3 for player 4 if all players have the same guid", () => {
      const result = getSdlGuidIndex(
        emuzeControllersSteamInput,
        removeVendorFromGuid,
      )(emuzeControllersSteamInput[3].guid, 3);

      expect(result).toBe(3);
    });
  });

  describe("getDeviceNameFromHid", () => {
    it("Should return name for Steam Deck Controller", () => {
      expect(getDeviceNameFromHid(steamDeck, 0)).toStrictEqual(
        "Microsoft X-Box 360 pad 0",
      );
    });

    it("Should return name for PS4 Controller", () => {
      expect(getDeviceNameFromHid(gamepadPs4, 0)).toStrictEqual(
        "Wireless Controller",
      );
    });
  });
});
