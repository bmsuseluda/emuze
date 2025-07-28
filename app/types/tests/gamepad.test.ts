import { gamepadPs4, getNameIndex, steamDeck } from "../gamepad.js";

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
