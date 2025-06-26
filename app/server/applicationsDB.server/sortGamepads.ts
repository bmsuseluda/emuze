import type { Sdl } from "@bmsuseluda/sdl";
import { isGamecubeController, steamDeck } from "../../types/gamepad.js";

/**
 * If one of the gamepads is the Steam Deck, it should be positioned last.
 */
export const sortSteamDeckLast = (
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

/**
 * If one of the gamepads is a GameCube Controller, it should be positioned last.
 */
export const sortGamecubeLast = (
  a: Sdl.Joystick.Device,
  b: Sdl.Joystick.Device,
) => {
  const aIsGamecubeController = isGamecubeController(a.name);
  const bIsGamecubeController = isGamecubeController(b.name);
  if (aIsGamecubeController === bIsGamecubeController) {
    return 0;
  }
  if (!aIsGamecubeController && bIsGamecubeController) {
    return -1;
  }
  return 1;
};
