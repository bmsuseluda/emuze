import {
  excludeDosSecondaryFiles,
  excludePlaystationFiles,
  findPlaystation3Serial,
} from "~/server/applicationsDB.server";

describe("applicationsDB.server", () => {
  describe("findPlaystation3Serial", () => {
    it("Should return serial for digital game", () => {
      expect(
        findPlaystation3Serial("dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN"),
      ).toBe("NPUB30493");
    });

    it("Should return serial for physical game", () => {
      expect(
        findPlaystation3Serial(
          "/games/BLES01658-[Dragon Ball Z Budokai HD Collection]/PS3_GAME/USRDIR/EBOOT.BIN",
        ),
      ).toBe("BLES01658");
    });
  });

  describe("excludePlaystationFiles", () => {
    it("Should return files that do not have a serial in path", () => {
      const filenames = [
        "dev_hdd0/game/BLES00441/USRDIR/EBOOT.BIN",
        "dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN",
        "dev_hdd0/game/Test12345dfs/USRDIR/EBOOT.BIN",
      ];

      const filenamesToExclude = [
        "dev_hdd0/game/Test12345dfs/USRDIR/EBOOT.BIN",
      ];

      expect(excludePlaystationFiles(filenames)).toEqual(filenamesToExclude);
    });

    it("Should return files that are just update files for physical games", () => {
      const filenames = [
        "dev_hdd0/game/BLES00441-MORTAL/USRDIR/EBOOT.BIN",
        "dev_hdd0/game/BLES00635/USRDIR/EBOOT.BIN",
        "dev_hdd0/game/BLES01702/USRDIR/EBOOT.BIN",
        "dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN",
        "dev_hdd0/game/NPUB30624/USRDIR/EBOOT.BIN",
        "games/BLES00441-[Mortal Kombat vs DC Universe]/PS3_GAME/USRDIR/EBOOT.BIN",
        "games/BLES00635-[TEKKEN 6]/PS3_GAME/USRDIR/EBOOT.BIN",
        "games/BLES01702-[TEKKEN TAG TOURNAMENT 2]/PS3_GAME/USRDIR/EBOOT.BIN",
      ];

      const filenamesToExclude = [
        "dev_hdd0/game/BLES00441-MORTAL/USRDIR/EBOOT.BIN",
        "dev_hdd0/game/BLES00635/USRDIR/EBOOT.BIN",
        "dev_hdd0/game/BLES01702/USRDIR/EBOOT.BIN",
      ];

      expect(excludePlaystationFiles(filenames)).toEqual(filenamesToExclude);
    });
  });

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
