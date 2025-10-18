import type { Application } from "../../types.js";

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
