import { gamepadPs4, steamDeck } from "../../types/gamepad.js";
import { getDeviceNameFromHid } from "../gamepad.server.js";

vi.mock("@kmamal/sdl");
vi.mock("node-hid");

describe("getDeviceNameFromHid", () => {
  it("Should return name for Steam Deck Controller", () => {
    expect(getDeviceNameFromHid(steamDeck)).toStrictEqual(
      "Microsoft X-Box 360 pad 0",
    );
  });

  // TODO: add test to check for second steam input pad

  it("Should return name for PS4 Controll", () => {
    expect(getDeviceNameFromHid(gamepadPs4)).toStrictEqual(
      "Wireless Controller",
    );
  });
});
