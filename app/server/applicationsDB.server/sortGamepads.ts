import type { Sdl } from "@kmamal/sdl";
import {
  isGamecubeController,
  isSteamDeckController,
} from "../../types/gamepad.js";

/**
 * If one of the gamepads is the Steam Deck, it should be positioned last.
 */
export const sortSteamDeckLast = (
  a: Sdl.Joystick.Device | Sdl.Controller.Device,
  b: Sdl.Joystick.Device | Sdl.Controller.Device,
) => sortLast(a, b, isSteamDeckController);

/**
 * If one of the gamepads is a GameCube Controller, it should be positioned last.
 */
export const sortGamecubeLast = (
  a: Sdl.Joystick.Device,
  b: Sdl.Joystick.Device,
) => sortLast(a.name!, b.name!, isGamecubeController);

export const sortLast = <T>(
  a: T,
  b: T,
  shouldBeLast: (element: T) => boolean,
) => {
  const aShouldBeLast = shouldBeLast(a);
  const bShouldBeLast = shouldBeLast(b);
  if (aShouldBeLast === bShouldBeLast) {
    return 0;
  }
  if (!aShouldBeLast && bShouldBeLast) {
    return -1;
  }
  return 1;
};
