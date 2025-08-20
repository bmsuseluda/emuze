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

export const lime3ds: Application = {
  id: "lime3ds",
  name: "Lime3DS",
  fileExtensions: [".3ds"],
  flatpakId: "io.github.lime3ds.Lime3DS",
};

export const melonds: Application = {
  id: "melonds",
  name: "MelonDS",
  fileExtensions: [".nds"],
  flatpakId: "net.kuribo64.melonDS",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const cemu: Application = {
  id: "cemu",
  name: "Cemu",
  fileExtensions: [".wud", ".wux", ".wua", ".rpx"],
  flatpakId: "info.cemu.Cemu",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-f");
    }
    optionParams.push("-g");
    return optionParams;
  },
};

export const rosaliesMupenGui: Application = {
  id: "rosaliesMupenGui",
  name: "Rosalie's Mupen GUI",
  executable: "rmg.exe",
  fileExtensions: [".z64", ".n64", ".v64"],
  flatpakId: "com.github.Rosalie241.RMG",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const mgba: Application = {
  id: "mgba",
  name: "mgba",
  fileExtensions: [".gb", ".gbc", ".gba"],
  flatpakId: "io.mgba.mGBA",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
};

export const applications = {
  duckstation,
  pcsx2,
  rpcs3,
  ppsspp,
  lime3ds,
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
  aresSega32x,
  aresSuperGrafx,
  rosaliesMupenGui,
  mgba,
  flycast,
  dosboxstaging,
  scummvm,
  xemu,
} satisfies Record<string, Application>;
