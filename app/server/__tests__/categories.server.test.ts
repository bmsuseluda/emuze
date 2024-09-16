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
  finalfantasy7,
  gateofthunder,
  hugo,
  hugo2,
  metroidsamusreturns,
  neogeo,
  nintendo3ds,
  pcenginecd,
  playstation,
} from "../__testData__/category";
import { applications as applicationsTestData } from "../__testData__/applications";
import type { Entry, MetaData } from "../../types/jsonFiles/category";
import { general } from "../__testData__/general";
import { fetchMetaData } from "../igdb.server";
import { categories as categoriesDB } from "../categoriesDB.server";
import { lime3ds, mednafen } from "../applicationsDB.server";
import { getInstalledApplicationForCategory } from "../applications.server";
import { getExpiresOn } from "../getExpiresOn.server";
import { mameNeoGeo } from "../applicationsDB.server/applications/mame";
import { duckstation } from "../applicationsDB.server/applications/duckstation";

vi.mock("@kmamal/sdl");
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

    it("Should return oldData if exist", () => {
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
  });

  describe("readEntriesWithMetaData", () => {
    it("Should only fetch metaData for entries without metaData", async () => {
      const fetchMetaDataMock = vi.fn().mockResolvedValue(
        addIndex([
          {
            ...finalfantasy7,
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
            ...finalfantasy7,
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
            ...finalfantasy7,
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
        addIndex([finalfantasy7, hugo]),
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
      vi.mocked(readFileHome).mockReturnValueOnce(nintendo3ds);
      vi.mocked(readFileHome).mockReturnValueOnce(pcenginecd);
      vi.mocked(fetchMetaData).mockResolvedValueOnce(nintendo3ds.entries);
      vi.mocked(fetchMetaData).mockResolvedValueOnce(pcenginecd.entries);
      vi.mocked(getInstalledApplicationForCategory).mockReturnValueOnce(
        applicationsTestData.lime3ds,
      );
      vi.mocked(getInstalledApplicationForCategory).mockReturnValueOnce(
        applicationsTestData.mednafen,
      );

      // execute
      await importCategories();

      // expect
      expect(writeFileHome).toBeCalledTimes(6);
      expect(writeFileHome).toHaveBeenNthCalledWith(1, [], paths.categories);
      expect(writeFileHome).toHaveBeenNthCalledWith(
        2,
        nintendo3ds,
        nodepath.join(paths.entries, `${nintendo3ds.id}.json`),
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        3,
        [],
        lastPlayedPaths.lastPlayed,
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        4,
        pcenginecd,
        nodepath.join(paths.entries, `${pcenginecd.id}.json`),
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        5,
        [],
        lastPlayedPaths.lastPlayed,
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        6,
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
