import { findEntryName } from "../findEntryName.js";

const smashUltimateName =
  "Super Smash Bros. Ultimate [01006A800016E000][v0][BASE]";

describe("ryujinx", () => {
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
});
