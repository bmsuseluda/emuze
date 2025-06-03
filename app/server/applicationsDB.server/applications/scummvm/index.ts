import type { Application } from "../../types.js";

export const scummvm: Application = {
  id: "scummvm",
  name: "ScummVM",
  flatpakId: "org.scummvm.ScummVM",
  entryAsDirectory: true,
  omitAbsoluteEntryPathAsLastParam: true,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push(`--path=${absoluteEntryPath}`);
    optionParams.push("--auto-detect");
    return optionParams;
  },
};
