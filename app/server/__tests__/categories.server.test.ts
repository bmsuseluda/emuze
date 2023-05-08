import { when } from "jest-when";
import nodepath from "path";

import {
  importCategories,
  importEntries,
  paths,
  readEntriesWithMetaData,
} from "../categories.server";
import {
  readDirectorynames,
  readFileHome,
  readFilenames,
} from "~/server/readWriteData.server";
import {
  addIndex,
  blazingstar,
  cotton,
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
import type { Category, Entry } from "~/types/jsonFiles/category";
import { general } from "../__testData__/general";
import { fetchMetaData } from "~/server/igdb.server";
import { categories as categoriesDB } from "../categoriesDB.server";
import {
  citra,
  duckstation,
  mameNeoGeo,
  mednafen,
} from "~/server/applicationsDB.server";
import { getApplicationForCategory } from "~/server/applications.server";
import type { Application } from "~/types/jsonFiles/applications";

const writeFileMock = jest.fn();
jest.mock("~/server/readWriteData.server", () => ({
  readFileHome: jest.fn(),
  readDirectorynames: jest.fn(),
  readFilenames: jest.fn(),
  writeFileHome: (object: unknown, path: string) => writeFileMock(object, path),
}));

jest.mock("~/server/applications.server", () => ({
  getApplicationForCategory: jest.fn(),
}));

jest.mock("~/server/settings.server.ts", () => ({
  readGeneral: () => general,
}));

jest.mock("~/server/openDialog.server.ts", () => ({
  openErrorDialog: jest.fn(),
}));

jest.mock("fs");

jest.mock("~/server/igdb.server.ts", () => ({
  fetchMetaData: jest.fn(),
}));

describe("categories.server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("readEntriesWithMetaData", () => {
    it("Should filter excluded filenames (neogeo.zip) and find entryName from json file", async () => {
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(neogeo.entryPath, mameNeoGeo.fileExtensions)
        .mockReturnValueOnce([
          blazingstar.path,
          "F:/games/Emulation/roms/Neo Geo/neogeo.zip",
        ]);

      const expectedResult: Entry[] = [
        { ...blazingstar, name: "Blazing Star", id: `${blazingstar.id}0` },
      ];

      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockResolvedValueOnce(
        expectedResult
      );

      const result = await readEntriesWithMetaData(
        neogeo.id,
        neogeo.entryPath,
        categoriesDB.neogeo.igdbPlatformIds,
        neogeo.application.id
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should only fetch metaData for entries without metaData", async () => {
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(playstation.entryPath, duckstation.fileExtensions)
        .mockReturnValueOnce([hugo.path, hugo2.path]);

      const fetchMetaDataMock = jest.fn().mockResolvedValue(
        addIndex([
          {
            ...hugo,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
        ])
      );
      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockImplementation(
        fetchMetaDataMock
      );

      const result = await readEntriesWithMetaData(
        playstation.id,
        playstation.entryPath,
        categoriesDB.sonyplaystation.igdbPlatformIds,
        playstation.application.id,
        addIndex([
          hugo,
          {
            ...hugo2,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
        ])
      );

      expect(result).toStrictEqual(
        addIndex([
          {
            ...hugo,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
          {
            ...hugo2,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
        ])
      );
      expect(fetchMetaDataMock).toHaveBeenCalledWith(
        categoriesDB.sonyplaystation.igdbPlatformIds,
        addIndex([hugo])
      );
    });

    it("Should fetch metaData for all entries if there is no oldCategoryData", async () => {
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(playstation.entryPath, duckstation.fileExtensions)
        .mockReturnValueOnce([hugo.path, hugo2.path]);

      const fetchMetaDataMock = jest.fn().mockResolvedValue(
        addIndex([
          {
            ...hugo,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
          {
            ...hugo2,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
        ])
      );
      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockImplementation(
        fetchMetaDataMock
      );

      const result = await readEntriesWithMetaData(
        playstation.id,
        playstation.entryPath,
        categoriesDB.sonyplaystation.igdbPlatformIds,
        playstation.application.id
      );

      expect(result).toStrictEqual(
        addIndex([
          {
            ...hugo,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
          {
            ...hugo2,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
        ])
      );
      expect(fetchMetaDataMock).toHaveBeenCalledWith(
        categoriesDB.sonyplaystation.igdbPlatformIds,
        addIndex([hugo, hugo2])
      );
    });
  });

  describe("importCategories", () => {
    it("Should import 3ds and pcengine data", async () => {
      // evaluate
      (readDirectorynames as jest.Mock<string[]>).mockReturnValueOnce([
        nintendo3ds.entryPath,
        "unknown category",
        pcenginecd.entryPath,
      ]);
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(nintendo3ds.entryPath, citra.fileExtensions)
        .mockReturnValueOnce([metroidsamusreturns.path]);
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(pcenginecd.entryPath, mednafen.fileExtensions)
        .mockReturnValueOnce([cotton.path, gateofthunder.path]);
      (readFileHome as jest.Mock<Category>).mockReturnValueOnce(nintendo3ds);
      (readFileHome as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);
      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockResolvedValueOnce(
        nintendo3ds.entries
      );
      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockResolvedValueOnce(
        pcenginecd.entries
      );
      (getApplicationForCategory as jest.Mock<Application>).mockReturnValueOnce(
        applicationsTestData.citra
      );
      (getApplicationForCategory as jest.Mock<Application>).mockReturnValueOnce(
        applicationsTestData.mednafen
      );

      // execute
      await importCategories();

      // expect
      expect(writeFileMock).toBeCalledTimes(4);
      expect(writeFileMock).toHaveBeenNthCalledWith(1, [], paths.categories);
      expect(writeFileMock).toHaveBeenNthCalledWith(
        2,
        nintendo3ds,
        nodepath.join(paths.entries, `${nintendo3ds.id}.json`)
      );
      expect(writeFileMock).toHaveBeenNthCalledWith(
        3,
        pcenginecd,
        nodepath.join(paths.entries, `${pcenginecd.id}.json`)
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
        paths.categories
      );
    });
  });

  describe("importEntries", () => {
    it("Should update entries and keep general category data", async () => {
      // evaluate
      (readFileHome as jest.Mock<Category>).mockReturnValueOnce(playstation);
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        hugo.path,
        hugo2.path,
      ]);
      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockResolvedValueOnce(
        playstation.entries
      );
      (getApplicationForCategory as jest.Mock<Application>).mockReturnValueOnce(
        applicationsTestData.duckstation
      );

      // execute
      await importEntries(playstation.id);

      // expect
      expect(writeFileMock).toHaveBeenCalledWith(
        playstation,
        nodepath.join(paths.entries, `${playstation.id}.json`)
      );
    });
  });
});
