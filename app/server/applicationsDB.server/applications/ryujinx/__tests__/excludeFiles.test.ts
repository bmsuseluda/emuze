import { excludeFiles } from "../excludeFiles.js";

const smashUltimateName =
  "Super Smash Bros. Ultimate [01006A800016E000][v0][BASE]";

describe("ryujinx", () => {
  describe("excludeFiles", () => {
    it("Should exclude update and dlc files", () => {
      const filepaths = [
        "Super Smash Bros. Ultimate 13.0.3 [01006A800016E800][v1900544][UPD].nsp",
        `${smashUltimateName}.nsp`,
        "Super Smash Bros. Ultimate [01006A800016F001][v65536][DLC].nsp",
      ];

      const excludedFiles = excludeFiles(filepaths);

      expect(excludedFiles).toStrictEqual([
        "Super Smash Bros. Ultimate 13.0.3 [01006A800016E800][v1900544][UPD].nsp",
        "Super Smash Bros. Ultimate [01006A800016F001][v65536][DLC].nsp",
      ]);
    });

    it("Should exclude digital files if physical file exists", () => {
      const filepaths = [
        `${smashUltimateName}.nsp`,
        "Super Smash Bros. Ultimate [01006A800016E000][v0][NT].xci",
      ];

      const excludedFiles = excludeFiles(filepaths);

      expect(excludedFiles).toStrictEqual([`${smashUltimateName}.nsp`]);
    });
  });
});
