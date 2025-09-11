import type { Application } from "./types.js";
import { scummvm } from "./applications/scummvm/index.js";
import { dosboxstaging } from "./applications/dosbox/index.js";
import { mame, mameNeoGeo, mameNeoGeoCD } from "./applications/mame/index.js";
import { rpcs3 } from "./applications/rpcs3/index.js";
import {
  ares,
  aresGameBoyColor,
  aresMegaDrive,
  aresSega32x,
  aresSegaCd,
  aresSegaMegaLd,
  aresSuperGrafx,
  aresSuperNintendo,
} from "./applications/ares/index.js";
import { duckstation } from "./applications/duckstation/index.js";
import { pcsx2 } from "./applications/pcsx2/index.js";
import { ryujinx } from "./applications/ryujinx/index.js";
import { dolphin } from "./applications/dolphin/index.js";
import {
  mednafen,
  mednafenPcEngineCD,
  mednafenSaturn,
} from "./applications/mednafen/index.js";
import { azahar } from "./applications/azahar/index.js";
import { ppsspp } from "./applications/ppsspp/index.js";
import { flycast } from "./applications/flycast/index.js";
import { xemu } from "./applications/xemu/index.js";
import { melonds } from "./applications/melonds/index.js";
import { cemu } from "./applications/cemu/index.js";

export const applications = {
  duckstation,
  pcsx2,
  rpcs3,
  ppsspp,
  azahar,
  melonds,
  dolphin,
  ryujinx,
  cemu,
  mednafen,
  mednafenSaturn,
  mednafenPcEngineCD,
  mame,
  mameNeoGeo,
  mameNeoGeoCD,
  ares,
  aresGameBoyColor,
  aresSuperNintendo,
  aresMegaDrive,
  aresSegaCd,
  aresSegaMegaLd,
  aresSega32x,
  aresSuperGrafx,
  flycast,
  dosboxstaging,
  scummvm,
  xemu,
} satisfies Record<string, Application>;
