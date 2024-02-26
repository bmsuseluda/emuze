import type { Application } from "~/server/applicationsDB.server/types";

export const punes: Application = {
  id: "punes",
  name: "puNES",
  fileExtensions: [".nes"],
  flatpakId: "io.github.punesemu.puNES",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
      optionParams.push("yes");
    }
    return optionParams;
  },
};
