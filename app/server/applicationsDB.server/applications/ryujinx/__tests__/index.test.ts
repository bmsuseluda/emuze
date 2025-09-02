import { createControllerId, excludeFiles, findEntryName } from "../index.js";
import { gamepadPs3, steamDeck } from "../../../../../types/gamepad.js";

const smashUltimateName =
  "Super Smash Bros. Ultimate [01006A800016E000][v0][BASE]";

describe("ryujinx", () => {
  describe("createControllerId", () => {
    it("Should create controller IDs", () => {
      const controllerIds: { name: string }[] = [];

      expect(createControllerId(controllerIds, steamDeck.guid)).toBe(
        "0-00000003-28de-0000-ff11-000001000000",
      );
      expect(createControllerId(controllerIds, gamepadPs3.guid)).toBe(
        "0-00000005-054c-0000-6802-000000800000",
      );
      expect(createControllerId(controllerIds, gamepadPs3.guid)).toBe(
        "1-00000005-054c-0000-6802-000000800000",
      );
      expect(createControllerId(controllerIds, steamDeck.guid)).toBe(
        "1-00000003-28de-0000-ff11-000001000000",
      );
    });
  });

  describe("findEntryName", () => {
    [
      { name: smashUltimateName, optimizedName: "Super Smash Bros. Ultimate" },
      {
        name: "1993 Shenandoah [010075601150A000][v0][BASE].nsp",
        optimizedName: "1993 Shenandoah",
      },
      {
        name: "SUPER BOMBERMAN R 2.2 [01007AD00013E800][v720896][NT]",
        optimizedName: "SUPER BOMBERMAN R",
      },
    ].forEach(({ name, optimizedName }) => {
      it(`Should optimize the name to ${optimizedName}`, () => {
        const result = findEntryName({
          entry: { name, path: name, id: name },
          categoryName: "Switch",
          categoriesPath: "/roms",
        });

        expect(result).toBe(optimizedName);
      });
    });
  });

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
