import {
  convertToJoystick,
  eightBitDoPro2,
  gamepadPs3,
  gamepadPs4,
  getNameIndex,
  getPlayIndexArray,
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
  it("Should return the last index as playerIndex for steamd deck", () => {
    expect(
      getPlayIndexArray([
        convertToJoystick(steamDeck),
        convertToJoystick(gamepadPs4),
        convertToJoystick(gamepadPs4),
        convertToJoystick(eightBitDoPro2),
      ]),
    ).toStrictEqual([3, 0, 1, 2]);
  });

  it("Should return the indexes untouched if there is no steam deck", () => {
    expect(
      getPlayIndexArray([
        convertToJoystick(gamepadPs3),
        convertToJoystick(gamepadPs4),
        convertToJoystick(gamepadPs4),
        convertToJoystick(eightBitDoPro2),
      ]),
    ).toStrictEqual([0, 1, 2, 3]);
  });
});
