import type { Sdl } from "@kmamal/sdl";
import { gamepadPs3, gamepadPs4, steamDeck } from "../../../types/gamepad.js";
import { sortSteamDeckLast } from "../sortGamepads.js";

describe("sortGamepads", () => {
  it("should sort the steam deck last", () => {
    const gamepads: Sdl.Controller.Device[] = [
      steamDeck,
      gamepadPs4,
      gamepadPs3,
    ];

    const sortedGamepads = [gamepadPs4, gamepadPs3, steamDeck];

    expect(gamepads.sort(sortSteamDeckLast)).toStrictEqual(sortedGamepads);
  });
});
