import type { Sdl } from "@kmamal/sdl";
import { steamDeck } from "./gamepads";

/**
 * If one of the gamepads is the Steam Deck, it should be positioned last.
 */
export const sortGamepads = (
  gamepadA: Sdl.Controller.Device,
  gamepadB: Sdl.Controller.Device,
) => {
  if (gamepadA.mapping === steamDeck.mapping) {
    return 1;
  }

  if (gamepadB.mapping === steamDeck.mapping) {
    return -1;
  }

  return gamepadA.id - gamepadB.id;
};
