import nodepath from "path";

import type { Application } from "./types";
import { scummvm } from "./applications/scummvm";
import { dosboxstaging } from "./applications/dosbox";
import { mame, mameNeoGeo, mameNeoGeoCD } from "./applications/mame";
import { rpcs3 } from "./applications/rpcs3";
import {
  ares,
  aresMegaDrive,
  aresSega32x,
  aresSegaCd,
  aresSuperNintendo,
} from "./applications/ares";
import { punes } from "./applications/punes";
import { isWindows } from "~/server/operationsystem.server";

export const pcsx2: Application = {
  id: "pcsx2",
  name: "PCSX2",
  fileExtensions: [".chd", ".iso"],
  flatpakId: "net.pcsx2.PCSX2",
  flatpakOptionParams: ["--command=pcsx2-qt"],
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
};

export const blastem: Application = {
  id: "blastem",
  name: "BlastEm",
  fileExtensions: [".68K", ".bin", ".sgd", ".smd", ".sms", ".gg"],
  flatpakId: "com.retrodev.blastem",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
    }
    return optionParams;
  },
};

export const bsnes: Application = {
  id: "bsnes",
  name: "BSNES",
  fileExtensions: [".sfc", ".smc"],
  flatpakId: "dev.bsnes.bsnes",
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

export const duckstation: Application = {
  id: "duckstation",
  name: "DuckStation",
  fileExtensions: [".chd", ".cue"],
  flatpakId: "org.duckstation.DuckStation",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
};

export const play: Application = {
  id: "play",
  name: "Play!",
  fileExtensions: [".iso", ".chd"],
  flatpakId: "org.purei.Play",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--disc");
    return optionParams;
  },
};

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

export const snes9x: Application = {
  id: "snes9x",
  name: "Snes9x",
  fileExtensions: [".sfc", ".smc"],
  flatpakId: "com.snes9x.Snes9x",
};

export const citra: Application = {
  id: "citra",
  name: "Citra",
  fileExtensions: [".3ds"],
  flatpakId: "org.citra_emu.citra",
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

export const desmume: Application = {
  id: "desmume",
  name: "DeSmuME",
  fileExtensions: [".nds"],
  flatpakId: "org.desmume.DeSmuME",
};

export const dolphin: Application = {
  id: "dolphin",
  name: "Dolphin",
  fileExtensions: [".iso", ".rvz"],
  flatpakId: "org.DolphinEmu.dolphin-emu",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--config");
      optionParams.push("Dolphin.Display.Fullscreen=True");
    }
    optionParams.push("--batch");
    return optionParams;
  },
};

export const yuzu: Application = {
  id: "yuzu",
  name: "yuzu",
  fileExtensions: [".xci", ".nsp"],
  flatpakId: "org.yuzu_emu.yuzu",
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

export const ryujinx: Application = {
  id: "ryujinx",
  name: "Ryujinx",
  fileExtensions: [".xci", ".nsp"],
  flatpakId: "org.ryujinx.Ryujinx",
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

export const nestopia: Application = {
  id: "nestopia",
  name: "Nestopia",
  fileExtensions: [".nes"],
  flatpakId: "ca._0ldsk00l.Nestopia",
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

export const mednafen: Application = {
  id: "mednafen",
  name: "Mednafen",
  fileExtensions: [".cue", ".pce", ".nes", ".sms", ".gg"],
  flatpakId: "com.github.AmatCoder.mednaffe",
  flatpakOptionParams: ["--command=mednafen"],
  environmentVariables: ({ application }) => {
    const environmentVariables = {};
    if (isWindows() && application?.path) {
      return {
        ...environmentVariables,
        MEDNAFEN_HOME: nodepath.dirname(application.path),
      };
    }
    return environmentVariables;
  },
};

export const mupen64plus: Application = {
  id: "mupen64plus",
  name: "Mupen64Plus",
  fileExtensions: [".z64"],
  flatpakId: "io.github.simple64.simple64",
};

export const rosaliesMupenGui: Application = {
  id: "rosaliesMupenGui",
  name: "Rosalie's Mupen GUI",
  executable: "rmg.exe",
  fileExtensions: [".z64"],
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
  fileExtensions: [".gb", ".gba"],
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
  play,
  rpcs3,
  ppsspp,
  blastem,
  bsnes,
  snes9x,
  citra,
  lime3ds,
  melonds,
  desmume,
  dolphin,
  yuzu,
  ryujinx,
  cemu,
  nestopia,
  punes,
  mednafen,
  mame,
  mameNeoGeo,
  mameNeoGeoCD,
  ares,
  aresSuperNintendo,
  aresMegaDrive,
  aresSegaCd,
  aresSega32x,
  mupen64plus,
  rosaliesMupenGui,
  mgba,
  flycast,
  dosboxstaging,
  scummvm,
} satisfies Record<string, Application>;
