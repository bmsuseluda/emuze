import { when } from "vitest-when";
import nodepath from "path";

import {
  importCategories,
  importEntries,
  paths,
  readEntries,
  readEntriesWithMetaData,
} from "../categories.server";
import { paths as lastPlayedPaths } from "../lastPlayed.server";
import {
  readDirectorynames,
  readFileHome,
  readFilenames,
  writeFileHome,
} from "../readWriteData.server";
import {
  addIndex,
  blazingstar,
  cotton,
  createAbsoluteEntryPath,
  createCategoryPath,
  doomEvilution,
  doomPlutonium,
  dos,
  ehrgeiz,
  ehrgeizJapan,
  finalfantasy7disc1,
  finalfantasy7disc2,
  finalfantasy7disc3,
  gateofthunder,
  hugo,
  hugo2,
  metroidsamusreturns,
  neogeo,
  nintendo3ds,
  pcenginecd,
  playstation,
  playstation3,
  psallstars,
  psallstarsDigital,
  psallstarsDisc,
  psallstarsManual,
} from "../__testData__/category";
import { applications as applicationsTestData } from "../__testData__/applications";
import type { Entry, MetaData } from "../../types/jsonFiles/category";
import { general } from "../__testData__/general";
import { fetchMetaData } from "../igdb.server";
import { categories as categoriesDB } from "../categoriesDB.server";
import { lime3ds } from "../applicationsDB.server";
import { getInstalledApplicationForCategory } from "../applications.server";
import { getExpiresOn } from "../getExpiresOn.server";
import { mameNeoGeo } from "../applicationsDB.server/applications/mame";
import { duckstation } from "../applicationsDB.server/applications/duckstation";
import { dosboxstaging } from "../applicationsDB.server/applications/dosbox";
import { rpcs3 } from "../applicationsDB.server/applications/rpcs3";
import { mednafen } from "../applicationsDB.server/applications/mednafen";

vi.mock("@bmsuseluda/node-sdl");
vi.mock("../readWriteData.server");
vi.mock("../applications.server");
vi.mock("../openDialog.server.ts");
vi.mock("fs");
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

describe("categories.server", () => {
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
        applicationId: mameNeoGeo.id,
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
        applicationId: duckstation.id,
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
        applicationId: duckstation.id,
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
        applicationId: duckstation.id,
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
        applicationId: rpcs3.id,
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
        applicationId: dosboxstaging.id,
        oldEntries,
      });

      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("readEntriesWithMetaData", () => {
    it("Should only fetch metaData for entries without metaData", async () => {
      const fetchMetaDataMock = vi.fn().mockResolvedValue(
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
      vi.mocked(fetchMetaData).mockImplementation(fetchMetaDataMock);

      const result = await readEntriesWithMetaData(
        categoriesDB.sonyplaystation.igdbPlatformIds,
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
        categoriesDB.sonyplaystation.igdbPlatformIds,
        addIndex([finalfantasy7disc1, hugo]),
      );
    });
  });

  describe("importCategories", () => {
    it("Should import 3ds and pcengine data", async () => {
      // evaluate
      vi.mocked(readDirectorynames).mockReturnValueOnce([
        nodepath.join(general.categoriesPath, nintendo3ds.name),
        "unknown category",
        createCategoryPath(pcenginecd.name),
      ]);
      when(readFilenames, { times: 1 })
        .calledWith({
          path: createCategoryPath(nintendo3ds.name),
          fileExtensions: lime3ds.fileExtensions,
        })
        .thenReturn([
          createAbsoluteEntryPath(nintendo3ds.name, metroidsamusreturns.path),
        ]);
      when(readFilenames, { times: 1 })
        .calledWith({
          path: createCategoryPath(pcenginecd.name),
          fileExtensions: mednafen.fileExtensions,
        })
        .thenReturn([
          createAbsoluteEntryPath(pcenginecd.name, cotton.path),
          createAbsoluteEntryPath(pcenginecd.name, gateofthunder.path),
        ]);
      vi.mocked(readFileHome).mockReturnValueOnce(pcenginecd);
      vi.mocked(readFileHome).mockReturnValueOnce(nintendo3ds);

      when(fetchMetaData)
        .calledWith(categoriesDB.pcenginecd.igdbPlatformIds, pcenginecd.entries)
        .thenResolve(pcenginecd.entries);
      when(fetchMetaData)
        .calledWith(
          categoriesDB.nintendo3ds.igdbPlatformIds,
          nintendo3ds.entries,
        )
        .thenResolve(nintendo3ds.entries);

      vi.mocked(getInstalledApplicationForCategory).mockReturnValueOnce(
        applicationsTestData.lime3ds,
      );
      vi.mocked(getInstalledApplicationForCategory).mockReturnValueOnce(
        applicationsTestData.mednafen,
      );

      // execute
      await importCategories();

      // expect
      expect(writeFileHome).toBeCalledTimes(7);
      expect(writeFileHome).toHaveBeenNthCalledWith(1, [], paths.categories);
      expect(writeFileHome).toHaveBeenNthCalledWith(
        2,
        nintendo3ds,
        nodepath.join(paths.entries, `${nintendo3ds.id}.json`),
      );
      // last played cache warmup
      expect(writeFileHome).toHaveBeenNthCalledWith(
        3,
        [],
        lastPlayedPaths.lastPlayed,
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        4,
        [],
        lastPlayedPaths.lastPlayed,
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        5,
        pcenginecd,
        nodepath.join(paths.entries, `${pcenginecd.id}.json`),
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        6,
        [],
        lastPlayedPaths.lastPlayed,
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        7,
        [
          {
            id: nintendo3ds.id,
            name: nintendo3ds.name,
          },
          {
            id: pcenginecd.id,
            name: pcenginecd.name,
          },
        ],
        paths.categories,
      );
    });
  });

  describe("importEntries", () => {
    it("Should update entries and keep general category data", async () => {
      // evaluate
      vi.mocked(readFileHome).mockReturnValueOnce(playstation);
      vi.mocked(readFilenames).mockReturnValueOnce([
        createAbsoluteEntryPath(playstation.name, hugo.path),
        createAbsoluteEntryPath(playstation.name, hugo2.path),
      ]);
      vi.mocked(fetchMetaData).mockResolvedValueOnce(playstation.entries);
      vi.mocked(getInstalledApplicationForCategory).mockReturnValueOnce(
        applicationsTestData.duckstation,
      );

      // execute
      await importEntries(playstation.id);

      // expect
      expect(writeFileHome).toHaveBeenCalledWith(
        playstation,
        nodepath.join(paths.entries, `${playstation.id}.json`),
      );
    });
  });
});
