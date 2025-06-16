import type { SdlType } from "../types/gamepad.js";

let sdl: SdlType;

// TODO: remove
export const getSdl = async () => {
  if (!sdl) {
    sdl = (await import("@kmamal/sdl")).default;
  }
  return sdl;
};
