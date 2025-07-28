import type { Sdl } from "@kmamal/sdl";
import {
  isGamecubeController,
  isSteamDeckController,
} from "../../types/gamepad.js";

/**
 * If one of the gamepads is the Steam Deck, it should be positioned last.
 */
export const sortSteamDeckLast = (
  gamepadA: Sdl.Joystick.Device | Sdl.Controller.Device,
  gamepadB: Sdl.Joystick.Device | Sdl.Controller.Device,
) => {
  if (isSteamDeckController(gamepadA)) {
    return 1;
  }

  if (isSteamDeckController(gamepadB)) {
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
  const aIsGamecubeController = isGamecubeController(a.name!);
  const bIsGamecubeController = isGamecubeController(b.name!);
  if (aIsGamecubeController === bIsGamecubeController) {
    return 0;
  }
  if (!aIsGamecubeController && bIsGamecubeController) {
    return -1;
  }
  return 1;
};
