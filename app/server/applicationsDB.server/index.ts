import type { Application } from "./types";
import { scummvm } from "./applications/scummvm";
import { dosboxstaging } from "./applications/dosbox";
import { mame, mameNeoGeo, mameNeoGeoCD } from "./applications/mame";
import { rpcs3 } from "./applications/rpcs3";
import {
  ares,
  aresGameBoyColor,
  aresMegaDrive,
  aresSega32x,
  aresSegaCd,
  aresSuperNintendo,
} from "./applications/ares";
import { duckstation } from "./applications/duckstation";
import { pcsx2 } from "./applications/pcsx2";
import { ryujinx } from "./applications/ryujinx";
import { dolphin } from "./applications/dolphin";
import {
  mednafen,
  mednafenPcEngineCD,
  mednafenPcEngineSuperGrafx,
  mednafenSaturn,
} from "./applications/mednafen";
import { azahar } from "./applications/azahar";

export const ppsspp: Application = {
  id: "ppsspp",
  name: "PPSSPP",
  fileExtensions: [".chd", ".cso", ".iso"],
  flatpakId: "org.ppsspp.PPSSPP",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--pause-menu-exit");
    return optionParams;
  },
};

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

export const flycast: Application = {
  id: "flycast",
  name: "Flycast",
  fileExtensions: [".cue", ".chd", ".gdi", ".cdi"],
  flatpakId: "org.flycast.Flycast",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--config");
      optionParams.push("window:fullscreen=yes");
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
  mednafenPcEngineSuperGrafx,
  mame,
  mameNeoGeo,
  mameNeoGeoCD,
  ares,
  aresGameBoyColor,
  aresSuperNintendo,
  aresMegaDrive,
  aresSegaCd,
  aresSega32x,
  rosaliesMupenGui,
  mgba,
  flycast,
  dosboxstaging,
  scummvm,
} satisfies Record<string, Application>;
