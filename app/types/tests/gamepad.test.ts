import type { Sdl } from "@kmamal/sdl";
import {
  convertToJoystick,
  eightBitDoPro2,
  gamecubeAdapter,
  gamepadPs3,
  gamepadPs4,
  getNameIndex,
  getPlayerIndexArray,
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
