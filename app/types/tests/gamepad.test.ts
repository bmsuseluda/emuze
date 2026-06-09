import type { Sdl } from "@kmamal/sdl";
import {
  eightBitDoPro2Joystick,
  gamecubeAdapter,
  gamepadN64,
  gamepadPs3Joystick,
  gamepadPs4Joystick,
  getNameIndex,
  getPlayerIndexArray,
  removeVendorFromGuid,
  sortSteamDeckLast,
  steamDeckJoystick,
} from "../gamepad.js";

describe("getNameIndex", () => {
  it("Should return the index based on the name of the joystick", () => {
    const devices: { name: string }[] = [
      { name: gamepadPs4Joystick.name },
      { name: steamDeckJoystick.name },
      { name: gamepadPs4Joystick.name },
    ];
    expect(getNameIndex(gamepadPs4Joystick.name, 0, devices)).toBe(0);
    expect(getNameIndex(steamDeckJoystick.name, 1, devices)).toBe(0);
    expect(getNameIndex(gamepadPs4Joystick.name, 2, devices)).toBe(1);
  });
});

describe("getPlayerIndexArray", () => {
  it("Should return the last index as playerIndex for steam deck", () => {
    expect(
      getPlayerIndexArray([
        steamDeckJoystick,
        gamepadPs4Joystick,
        { ...gamepadPs4Joystick },
        eightBitDoPro2Joystick,
      ]),
    ).toStrictEqual([3, 0, 1, 2]);
  });

  it("Should return the last index as playerIndex for steam deck and gamecube before that", () => {
    expect(
      getPlayerIndexArray([
        steamDeckJoystick,
        gamecubeAdapter,
        { ...gamecubeAdapter },
        { ...gamecubeAdapter },
        { ...gamecubeAdapter },
        gamepadPs4Joystick,
        { ...gamepadPs4Joystick },
        eightBitDoPro2Joystick,
      ]),
    ).toStrictEqual([7, 3, 4, 5, 6, 0, 1, 2]);
  });

  it("Should return the indexes untouched if there is no steam deck", () => {
    expect(
      getPlayerIndexArray([
        gamepadPs3Joystick,
        gamepadPs4Joystick,
        { ...gamepadPs4Joystick },
        eightBitDoPro2Joystick,
      ]),
    ).toStrictEqual([0, 1, 2, 3]);
  });
});

describe("sortGamepads", () => {
  it("should sort the steam deck last", () => {
    const gamepads: Sdl.Joystick.Device[] = [
      steamDeckJoystick,
      gamepadPs4Joystick,
      gamepadPs3Joystick,
    ];

    const sortedGamepads: Sdl.Joystick.Device[] = [
      gamepadPs4Joystick,
      gamepadPs3Joystick,
      steamDeckJoystick,
    ];

    expect(gamepads.sort(sortSteamDeckLast)).toStrictEqual(sortedGamepads);
  });
});

describe("removeVendorFromGuid", () => {
  const testCases = [
    {
      name: "8BitDo Pro 2 Controller",
      input: eightBitDoPro2Joystick.guid,
      expected: "050000005e040000e002000003090000",
    },
    {
      name: "Steam Deck",
      input: steamDeckJoystick.guid,
      expected: "03000000de280000ff11000001000000",
    },
    {
      name: "PS4 Controller",
      input: gamepadPs4Joystick.guid,
      expected: "030000004c050000c405000000006800",
    },
    {
      name: "PS3 Controller",
      input: gamepadPs3Joystick.guid,
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
