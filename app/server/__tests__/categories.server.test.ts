import { when } from "jest-when";
import nodepath from "path";

import {
  importCategories,
  importEntries,
  paths,
  readEntries,
  readEntriesWithMetaData,
} from "../categories.server";
import {
  readDirectorynames,
  readFileHome,
  readFilenames,
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
import type { Category, Entry, MetaData } from "../../types/jsonFiles/category";
import { general } from "../__testData__/general";
import { fetchMetaData } from "../igdb.server";
import { categories as categoriesDB } from "../categoriesDB.server";
import { lime3ds, mednafen } from "../applicationsDB.server";
import { getInstalledApplicationForCategory } from "../applications.server";
import { getExpiresOn } from "../getExpiresOn.server";
import type { Mock } from "vitest";
import { mameNeoGeo } from "../applicationsDB.server/applications/mame";
import { duckstation } from "../applicationsDB.server/applications/duckstation";
import type { InstalledApplication } from "../applicationsDB.server/types";

vi.mock("@kmamal/sdl");

const writeFileMock = vi.fn();
vi.mock("../readWriteData.server", () => ({
  readFileHome: vi.fn(),
  readDirectorynames: vi.fn(),
  readFilenames: vi.fn(),
  writeFileHome: (object: unknown, path: string) => writeFileMock(object, path),
}));

vi.mock("../applications.server", () => ({
  getInstalledApplicationForCategory: vi.fn(),
}));

vi.mock("../settings.server.ts", () => ({
  readGeneral: () => general,
}));

vi.mock("../openDialog.server.ts", () => ({
  openErrorDialog: vi.fn(),
}));

vi.mock("fs");

vi.mock("../igdb.server.ts", () => ({
  fetchMetaData: vi.fn(),
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
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
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
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        createAbsoluteEntryPath(playstation.name, hugo.path),
        createAbsoluteEntryPath(playstation.name, hugo2.path),
      ]);

      const hugoMetaData: MetaData = {
        imageUrl: "https://www.allImagesComeFromHere.com/hugo.webp",
        expiresOn: getExpiresOn(),
      };

      const oldEntries: Entry[] = [
        {
          ...hugo,
          id: `${hugo.id}0`,
          metaData: hugoMetaData,
        },
      ];

      const expectedResult: Entry[] = [
        { ...hugo, metaData: hugoMetaData, id: `${hugo.id}0` },
        { ...hugo2, id: `${hugo2.id}1` },
      ];

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
      (fetchMetaData as Mock<any, Promise<Entry[]>>).mockImplementation(
        fetchMetaDataMock,
      );

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
      (readDirectorynames as Mock<any, string[]>).mockReturnValueOnce([
        nodepath.join(general.categoriesPath, nintendo3ds.name),
        "unknown category",
        createCategoryPath(pcenginecd.name),
      ]);
      when(readFilenames as Mock<any, string[]>)
        .calledWith({
          path: createCategoryPath(nintendo3ds.name),
          fileExtensions: lime3ds.fileExtensions,
        })
        .mockReturnValueOnce([
          createAbsoluteEntryPath(nintendo3ds.name, metroidsamusreturns.path),
        ]);
      when(readFilenames as Mock<any, string[]>)
        .calledWith({
          path: createCategoryPath(pcenginecd.name),
          fileExtensions: mednafen.fileExtensions,
        })
        .mockReturnValueOnce([
          createAbsoluteEntryPath(pcenginecd.name, cotton.path),
          createAbsoluteEntryPath(pcenginecd.name, gateofthunder.path),
        ]);
      (readFileHome as Mock<any, Category>).mockReturnValueOnce(nintendo3ds);
      (readFileHome as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
      (fetchMetaData as Mock<any, Promise<Entry[]>>).mockResolvedValueOnce(
        nintendo3ds.entries,
      );
      (fetchMetaData as Mock<any, Promise<Entry[]>>).mockResolvedValueOnce(
        pcenginecd.entries,
      );
      (
        getInstalledApplicationForCategory as Mock<any, InstalledApplication>
      ).mockReturnValueOnce(applicationsTestData.lime3ds);
      (
        getInstalledApplicationForCategory as Mock<any, InstalledApplication>
      ).mockReturnValueOnce(applicationsTestData.mednafen);

      // execute
      await importCategories();

      // expect
      expect(writeFileMock).toBeCalledTimes(4);
      expect(writeFileMock).toHaveBeenNthCalledWith(1, [], paths.categories);
      expect(writeFileMock).toHaveBeenNthCalledWith(
        2,
        nintendo3ds,
        nodepath.join(paths.entries, `${nintendo3ds.id}.json`),
      );
      expect(writeFileMock).toHaveBeenNthCalledWith(
        3,
        pcenginecd,
        nodepath.join(paths.entries, `${pcenginecd.id}.json`),
      );
      expect(writeFileMock).toHaveBeenNthCalledWith(
        4,
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
      (readFileHome as Mock<any, Category>).mockReturnValueOnce(playstation);
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        createAbsoluteEntryPath(playstation.name, hugo.path),
        createAbsoluteEntryPath(playstation.name, hugo2.path),
      ]);
      (fetchMetaData as Mock<any, Promise<Entry[]>>).mockResolvedValueOnce(
        playstation.entries,
      );
      (
        getInstalledApplicationForCategory as Mock<any, InstalledApplication>
      ).mockReturnValueOnce(applicationsTestData.duckstation);

      // execute
      await importEntries(playstation.id);

      // expect
      expect(writeFileMock).toHaveBeenCalledWith(
        playstation,
        nodepath.join(paths.entries, `${playstation.id}.json`),
      );
    });
  });
});
