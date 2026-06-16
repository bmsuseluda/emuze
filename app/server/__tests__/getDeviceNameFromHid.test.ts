import { gamepadPs4Joystick, steamDeckJoystick } from "../../types/gamepad.js";
import { getDeviceNameFromHid } from "../getDeviceNameFromHid.js";

vi.mock("@kmamal/sdl");
vi.mock("node-hid");

describe("getDeviceNameFromHid", () => {
  it("Should return name for Steam Deck Controller", () => {
    expect(getDeviceNameFromHid(steamDeckJoystick)).toStrictEqual(
      "Microsoft X-Box 360 pad 0",
    );
  });

  // TODO: add test to check for second steam input pad

  it("Should return name for PS4 Controll", () => {
    expect(getDeviceNameFromHid(gamepadPs4Joystick)).toStrictEqual(
      "Wireless Controller",
    );
  });
});
