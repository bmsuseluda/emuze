import { excludeDosSecondaryFiles } from "..";

describe("applicationsDB.dosbox.server", () => {
  // TODO: redo
  describe("excludeDosSecondaryFiles", () => {
    it("Should return files that are not named like the folder", () => {
      const filenames = [
        "digdogs/DIGDOGS.EXE",
        "digdogs/S0.EXE",
        "digdogs/S1.EXE",
        "digdogs/S2.EXE",
        "digdogs/SPEAKER.EXE",
      ];

      const filenamesToExclude = [
        "digdogs/S0.EXE",
        "digdogs/S1.EXE",
        "digdogs/S2.EXE",
        "digdogs/SPEAKER.EXE",
      ];

      expect(excludeDosSecondaryFiles(filenames)).toEqual(filenamesToExclude);
    });
  });
});
