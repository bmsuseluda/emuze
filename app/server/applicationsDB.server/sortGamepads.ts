import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { isGamecubeController, steamDeck } from "./gamepads";

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
  a: Sdl.Controller.Device,
  b: Sdl.Controller.Device,
) => {
  const aOpened = sdl.controller.openDevice(a);
  const bOpened = sdl.controller.openDevice(b);
  const aIsGamecubeController = isGamecubeController(aOpened.device.name);
  const bIsGamecubeController = isGamecubeController(bOpened.device.name);
  if (aIsGamecubeController === bIsGamecubeController) {
    return 0;
  }
  if (!aIsGamecubeController && bIsGamecubeController) {
    return -1;
  }
  return 1;
};
