import {
  filterGameNameFromFileName,
  readEntries,
  readEntriesWithMetaData,
} from "../importCategory.server.js";
import { readFilenames } from "../readWriteData.server.js";
import {
  addIndex,
  bladerunner,
  blazingstar,
  createAbsoluteEntryPath,
  doomEvilution,
  doomPlutonium,
  dos,
  ehrgeiz,
  ehrgeizJapan,
  finalfantasy7disc1,
  finalfantasy7disc2,
  finalfantasy7disc3,
  hugo,
  hugo2,
  neogeo,
  playstation,
  playstation3,
  psallstars,
  psallstarsDigital,
  psallstarsDisc,
  psallstarsManual,
  scumm,
} from "../__testData__/category.js";
import type { Entry, MetaData } from "../../types/jsonFiles/category.js";
import { general } from "../__testData__/general.js";
import { fetchMetaDataFromDB } from "../igdb.server.js";
import { categories as categoriesDB } from "../categoriesDB.server/index.js";
import { getExpiresOn } from "../getExpiresOn.server.js";
import { mameNeoGeo } from "../applicationsDB.server/applications/mame/index.js";
import { duckstation } from "../applicationsDB.server/applications/duckstation/index.js";
import { dosboxstaging } from "../applicationsDB.server/applications/dosbox/index.js";
import { rpcs3 } from "../applicationsDB.server/applications/rpcs3/index.js";
import { scummvm } from "../applicationsDB.server/applications/scummvm/index.js";

vi.mock("@kmamal/sdl");
vi.mock("../readWriteData.server");
vi.mock("../applications.server");
vi.mock("../openDialog.server.ts");
vi.mock("node:fs");
vi.mock("../igdb.server.ts");
vi.mock("../settings.server.ts", () => ({
  readGeneral: () => general,
}));
vi.mock("../getExpiresOn.server.ts", () => {
  const getFutureDate = () => {
    const now = new Date();
    now.setDate(now.getDate() + 10);
    now.setSeconds(0);
    return now.getTime();
  };
  const futureDate = getFutureDate();
  return {
    getExpiresOn: () => futureDate,
  };
});

describe("importCategory.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("readEntries", () => {
    it("Should filter excluded filenames (neogeo.zip) and find entryName from json file", () => {
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(neogeo.name, blazingstar.path),
        createAbsoluteEntryPath(neogeo.name, "neogeo.zip"),
      ]);

      const expectedResult: Entry[] = [
        { ...blazingstar, name: "Blazing Star", id: `${blazingstar.id}0` },
      ];

      const result = readEntries({
        categoryName: neogeo.name,
        application: mameNeoGeo,
      });

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return old meta data if exist", () => {
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(playstation.name, hugo.path),
        createAbsoluteEntryPath(playstation.name, hugo2.path),
      ]);

      const hugoMetaData: MetaData = {
        imageUrl: "https://www.allImagesComeFromHere.com/hugo.webp",
        expiresOn: getExpiresOn(),
      };

      const oldEntries: Entry[] = addIndex([
        {
          ...hugo,
          metaData: hugoMetaData,
        },
      ]);

      const expectedResult: Entry[] = addIndex([
        { ...hugo, metaData: hugoMetaData, subEntries: undefined },
        { ...hugo2 },
      ]);

      const result = readEntries({
        categoryName: playstation.name,
        application: duckstation,
        oldEntries,
      });

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should replace old meta data if expired", () => {
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(playstation.name, hugo.path),
        createAbsoluteEntryPath(playstation.name, hugo2.path),
      ]);

      const hugoMetaData: MetaData = {
        imageUrl: "https://www.allImagesComeFromHere.com/hugo.webp",
        expiresOn: 12121,
      };

      const oldEntries: Entry[] = addIndex([
        {
          ...hugo,
          id: "This should be overwritten",
          subEntries: [
            {
              id: "This should be removed",
              name: "This should be removed",
              path: "This should be removed",
            },
          ],
          metaData: hugoMetaData,
        },
      ]);

      const expectedResult: Entry[] = addIndex([
        { ...hugo, metaData: hugoMetaData },
        { ...hugo2 },
      ]);

      const result = readEntries({
        categoryName: playstation.name,
        application: duckstation,
        oldEntries,
      });

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should remove old data if it does not exist anymore", () => {
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(playstation.name, hugo.path),
      ]);

      const oldEntries: Entry[] = addIndex([hugo, hugo2]);

      const expectedResult: Entry[] = addIndex([{ ...hugo }]);

      const result = readEntries({
        categoryName: playstation.name,
        application: duckstation,
        oldEntries,
      });

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return game with game versions", () => {
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(playstation.name, ehrgeiz.path),
        createAbsoluteEntryPath(playstation.name, ehrgeizJapan.path),
        createAbsoluteEntryPath(playstation.name, finalfantasy7disc1.path),
        createAbsoluteEntryPath(playstation.name, finalfantasy7disc2.path),
        createAbsoluteEntryPath(playstation.name, finalfantasy7disc3.path),
      ]);

      const oldEntries: Entry[] = addIndex([
        {
          ...finalfantasy7disc1,
        },
      ]);

      const expectedResult: Entry[] = addIndex([
        {
          ...ehrgeiz,
          subEntries: [ehrgeiz, ehrgeizJapan],
        },
        {
          ...finalfantasy7disc1,
          subEntries: [
            finalfantasy7disc1,
            finalfantasy7disc2,
            finalfantasy7disc3,
          ],
        },
      ]);

      const result = readEntries({
        categoryName: playstation.name,
        application: duckstation,
        oldEntries,
      });

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return ps3 game with game versions in different folders", () => {
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(playstation3.name, psallstarsDisc.path),
        createAbsoluteEntryPath(playstation3.name, psallstarsDigital.path),
        createAbsoluteEntryPath(playstation3.name, psallstarsManual.path),
      ]);

      const oldEntries: Entry[] = addIndex([
        {
          ...psallstarsDisc,
        },
        {
          ...psallstarsManual,
        },
      ]);

      const expectedResult: Entry[] = [psallstars];

      const result = readEntries({
        categoryName: playstation3.name,
        application: rpcs3,
        oldEntries,
      });

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return dos game with game versions", () => {
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(dos.name, doomPlutonium.path),
        createAbsoluteEntryPath(dos.name, doomEvilution.path),
      ]);

      const oldEntries: Entry[] = addIndex([
        {
          ...doomPlutonium,
        },
        {
          ...doomEvilution,
        },
      ]);

      const expectedResult: Entry[] = addIndex([
        {
          ...doomPlutonium,
          subEntries: [doomPlutonium, doomEvilution],
        },
      ]);

      const result = readEntries({
        categoryName: dos.name,
        application: dosboxstaging,
        oldEntries,
      });

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should read filenames for a system with entry as folder", () => {
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(scumm.name, bladerunner.path),
      ]);

      const expectedResult: Entry[] = [
        { ...bladerunner, name: "bladerunner", id: `${bladerunner.id}0` },
      ];

      const result = readEntries({
        categoryName: scumm.name,
        application: scummvm,
      });

      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("readEntriesWithMetaData", () => {
    it("Should only fetch metaData for entries without metaData", async () => {
      const fetchMetaDataMock = vi.fn().mockReturnValue(
        addIndex([
          {
            ...finalfantasy7disc1,
            metaData: {
              imageUrl: "https://www.allImagesComeFromHere.com/ff7.webp",
              expiresOn: getExpiresOn(),
            },
          },
          {
            ...hugo,
            metaData: {
              imageUrl: "https://www.allImagesComeFromHere.com/hugo2.webp",
              expiresOn: getExpiresOn(),
            },
          },
        ]),
      );
      vi.mocked(fetchMetaDataFromDB).mockImplementation(fetchMetaDataMock);

      const result = await readEntriesWithMetaData(
        "sonyplaystation",
        addIndex([
          {
            ...finalfantasy7disc1,
            metaData: {
              imageUrl: "https://www.allImagesComeFromHere.com/ff7.webp",
              expiresOn: new Date(2022).getTime(),
            },
          },
          hugo,
          {
            ...hugo2,
            metaData: {
              imageUrl: "https://www.allImagesComeFromHere.com/hugo2.webp",
              expiresOn: getExpiresOn(),
            },
          },
        ]),
      );

      expect(result).toStrictEqual(
        addIndex([
          {
            ...finalfantasy7disc1,
            metaData: {
              imageUrl: "https://www.allImagesComeFromHere.com/ff7.webp",
              expiresOn: getExpiresOn(),
            },
          },
          {
            ...hugo,
            metaData: {
              imageUrl: "https://www.allImagesComeFromHere.com/hugo2.webp",
              expiresOn: getExpiresOn(),
            },
          },
          {
            ...hugo2,
            metaData: {
              imageUrl: "https://www.allImagesComeFromHere.com/hugo2.webp",
              expiresOn: getExpiresOn(),
            },
          },
        ]),
      );
      expect(fetchMetaDataMock).toHaveBeenCalledWith(
        categoriesDB.sonyplaystation.id,
        addIndex([finalfantasy7disc1, hugo]),
      );
    });
  });

  describe("filterGameNameFromFileName", () => {
    [
      { filename: "Halo.iso", gamename: "Halo" },
      { filename: "Halo 2.xiso.iso", gamename: "Halo 2" },
      { filename: "Monkey Island.tar.gz", gamename: "Monkey Island" },
      { filename: "Super Mario Bros..nes", gamename: "Super Mario Bros." },
      { filename: "dsd . sdfs.nes", gamename: "dsd . sdfs" },
      { filename: "dsd_._sdfs.nes", gamename: "dsd_._sdfs" },
      {
        filename: "Clockwork Knight/Clockwork Knight.cue",
        gamename: "Clockwork Knight",
      },
      {
        filename: "Scumm/Beneath a Steel Sky",
        gamename: "Beneath a Steel Sky",
      },
      {
        filename: "Wii U/BAYONETTA 2 [AQUE0101]",
        gamename: "BAYONETTA 2 [AQUE0101]",
      },
    ].forEach(({ filename, gamename }) => {
      it(`should return gamename ${gamename} for filename ${filename}`, () => {
        expect(filterGameNameFromFileName(filename)).toBe(gamename);
      });
    });
  });
});
