import type { Sdl } from "@kmamal/sdl";
import {
  convertToJoystick,
  eightBitDoPro2,
  gamecubeAdapter,
  gamepadN64,
  gamepadPs3,
  gamepadPs4,
  getNameIndex,
  getPlayerIndexArray,
  removeVendorFromGuid,
  sortSteamDeckLast,
  steamDeck,
} from "../gamepad.js";

describe("getNameIndex", () => {
  it("Should return the index based on the name of the joystick", () => {
    const devices: { name: string }[] = [
      { name: gamepadPs4.name },
      { name: steamDeck.name },
      { name: gamepadPs4.name },
    ];
    expect(getNameIndex(gamepadPs4.name, 0, devices)).toBe(0);
    expect(getNameIndex(steamDeck.name, 1, devices)).toBe(0);
    expect(getNameIndex(gamepadPs4.name, 2, devices)).toBe(1);
  });
});

describe("getPlayerIndexArray", () => {
  it("Should return the last index as playerIndex for steam deck", () => {
    expect(
      getPlayerIndexArray([
        convertToJoystick(steamDeck),
        convertToJoystick(gamepadPs4),
        convertToJoystick(gamepadPs4),
        convertToJoystick(eightBitDoPro2),
      ]),
    ).toStrictEqual([3, 0, 1, 2]);
  });

  it("Should return the last index as playerIndex for steam deck and gamecube before that", () => {
    expect(
      getPlayerIndexArray([
        convertToJoystick(steamDeck),
        convertToJoystick(gamecubeAdapter),
        convertToJoystick(gamecubeAdapter),
        convertToJoystick(gamecubeAdapter),
        convertToJoystick(gamecubeAdapter),
        convertToJoystick(gamepadPs4),
        convertToJoystick(gamepadPs4),
        convertToJoystick(eightBitDoPro2),
      ]),
    ).toStrictEqual([7, 3, 4, 5, 6, 0, 1, 2]);
  });

  it("Should return the indexes untouched if there is no steam deck", () => {
    expect(
      getPlayerIndexArray([
        convertToJoystick(gamepadPs3),
        convertToJoystick(gamepadPs4),
        convertToJoystick(gamepadPs4),
        convertToJoystick(eightBitDoPro2),
      ]),
    ).toStrictEqual([0, 1, 2, 3]);
  });
});

describe("sortGamepads", () => {
  it("should sort the steam deck last", () => {
    const gamepads: Sdl.Joystick.Device[] = [
      convertToJoystick(steamDeck),
      convertToJoystick(gamepadPs4),
      convertToJoystick(gamepadPs3),
    ];

    const sortedGamepads: Sdl.Joystick.Device[] = [
      convertToJoystick(gamepadPs4),
      convertToJoystick(gamepadPs3),
      convertToJoystick(steamDeck),
    ];

    expect(gamepads.sort(sortSteamDeckLast)).toStrictEqual(sortedGamepads);
  });
});

describe("removeVendorFromGuid", () => {
  const testCases = [
    {
      name: "8BitDo Pro 2 Controller",
      input: eightBitDoPro2.guid,
      expected: "050000005e040000e002000003090000",
    },
    {
      name: "Steam Deck",
      input: steamDeck.guid,
      expected: "03000000de280000ff11000001000000",
    },
    {
      name: "PS4 Controller",
      input: gamepadPs4.guid,
      expected: "050000004c050000c405000000810000",
    },
    {
      name: "PS3 Controller",
      input: gamepadPs3.guid,
      expected: "050000004c0500006802000000800000",
    },
    {
      name: "GameCube Adapter",
      input: gamecubeAdapter.guid,
      expected: "03000000790000004318000010010000",
    },
    {
      name: "N64 Controller",
      input: gamepadN64.guid,
      expected: "050000007e0500001920000001800000",
    },
    {
      name: "Already normalized GUID",
      input: "050000005e040000e002000003090000",
      expected: "050000005e040000e002000003090000",
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(`should replace vendor ID with '0000' for ${name}`, () => {
      expect(removeVendorFromGuid(input)).toBe(expected);
    });
  });
});
