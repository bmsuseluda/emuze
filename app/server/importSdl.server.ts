import type { SdlType } from "../types/sdl.js";

let sdl: SdlType;

export const getSdl = async () => {
  if (!sdl) {
    sdl = (await import("@kmamal/sdl")).default;
  }
  return sdl;
};
