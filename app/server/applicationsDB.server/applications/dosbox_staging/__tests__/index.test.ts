import { excludeDosSecondaryFiles } from "../index.js";

describe("applicationsDB.dosbox", () => {
  describe("excludeDosSecondaryFiles", () => {
    it("Should return files that are not named like the folder", () => {
      const filenames = [
        "Dig Dogs/DIGDOGS.EXE",
        "Dig Dogs/S0.EXE",
        "Worms United/WORMS.BAT",
        "Worms United/BIN/WRMS.EXE",
      ];

      const filenamesToExclude = [
        "Dig Dogs/S0.EXE",
        "Worms United/BIN/WRMS.EXE",
      ];

      expect(excludeDosSecondaryFiles(filenames)).toEqual(filenamesToExclude);
    });
  });
});
