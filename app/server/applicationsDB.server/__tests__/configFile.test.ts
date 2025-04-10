import type { ParamToReplace } from "../configFile";
import { replaceParams } from "../configFile";

describe("configFile", () => {
  describe("replaceParams", () => {
    it("Should replace params", () => {
      const params = [
        "ConfirmShutdown = false",
        "PauseOnFocusLoss = false",
        "StartFullscreen = true",
      ];
      const paramsToReplace: ParamToReplace[] = [
        { keyValue: "ConfirmShutdown = true" },
      ];

      const result = replaceParams(params, paramsToReplace);

      expect(result).toEqual([
        "PauseOnFocusLoss = false",
        "StartFullscreen = true",
        "ConfirmShutdown = true",
        "",
        "",
        "",
      ]);
    });

    it("Should replace params and reset params with same value", () => {
      const params = [
        "OpenPauseMenu = Keyboard/Escape",
        "NextSaveStateSlot = Keyboard/F2",
      ];
      const paramsToReplace: ParamToReplace[] = [
        {
          keyValue: "OpenPauseMenu = Keyboard/F2",
          disableParamWithSameValue: true,
        },
      ];

      const result = replaceParams(params, paramsToReplace);

      expect(result).toEqual([
        "NextSaveStateSlot =",
        "OpenPauseMenu = Keyboard/F2",
        "",
        "",
        "",
      ]);
    });
  });
});
