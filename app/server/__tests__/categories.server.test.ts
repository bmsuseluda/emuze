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
} from "~/server/readWriteData.server";
import {
  addIndex,
  blazingstar,
  cotton,
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
import type { Category, Entry } from "~/types/jsonFiles/category";
import { general } from "../__testData__/general";
import { fetchMetaData } from "~/server/igdb.server";
import { categories as categoriesDB } from "../categoriesDB.server";
import { citra, mameNeoGeo, mednafen } from "~/server/applicationsDB.server";
import { getInstalledApplicationForCategory } from "~/server/applications.server";
import type { Application } from "~/types/jsonFiles/applications";
import { getExpiresOn } from "~/server/getExpiresOn.server";
import type { Mock } from "vitest";

const writeFileMock = vi.fn();
vi.mock("~/server/readWriteData.server", () => ({
  readFileHome: vi.fn(),
  readDirectorynames: vi.fn(),
  readFilenames: vi.fn(),
  writeFileHome: (object: unknown, path: string) => writeFileMock(object, path),
}));

vi.mock("~/server/applications.server", () => ({
  getInstalledApplicationForCategory: vi.fn(),
}));

vi.mock("~/server/settings.server.ts", () => ({
  readGeneral: () => general,
}));

vi.mock("~/server/openDialog.server.ts", () => ({
  openErrorDialog: vi.fn(),
}));

vi.mock("fs");

vi.mock("~/server/igdb.server.ts", () => ({
  fetchMetaData: vi.fn(),
}));

vi.mock("~/server/getExpiresOn.server.ts", () => {
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
      when(readFilenames as Mock<any, string[]>)
        .calledWith(neogeo.entryPath, mameNeoGeo.fileExtensions)
        .mockReturnValueOnce([
          blazingstar.path,
          "F:/games/Emulation/roms/Neo Geo/neogeo.zip",
        ]);

      const expectedResult: Entry[] = [
        { ...blazingstar, name: "Blazing Star", id: `${blazingstar.id}0` },
      ];

      const result = readEntries(neogeo.entryPath, neogeo.application.id);

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
        nintendo3ds.entryPath,
        "unknown category",
        pcenginecd.entryPath,
      ]);
      when(readFilenames as Mock<any, string[]>)
        .calledWith(nintendo3ds.entryPath, citra.fileExtensions)
        .mockReturnValueOnce([metroidsamusreturns.path]);
      when(readFilenames as Mock<any, string[]>)
        .calledWith(pcenginecd.entryPath, mednafen.fileExtensions)
        .mockReturnValueOnce([cotton.path, gateofthunder.path]);
      (readFileHome as Mock<any, Category>).mockReturnValueOnce(nintendo3ds);
      (readFileHome as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
      (fetchMetaData as Mock<any, Promise<Entry[]>>).mockResolvedValueOnce(
        nintendo3ds.entries,
      );
      (fetchMetaData as Mock<any, Promise<Entry[]>>).mockResolvedValueOnce(
        pcenginecd.entries,
      );
      (
        getInstalledApplicationForCategory as Mock<any, Application>
      ).mockReturnValueOnce(applicationsTestData.citra);
      (
        getInstalledApplicationForCategory as Mock<any, Application>
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
        hugo.path,
        hugo2.path,
      ]);
      (fetchMetaData as Mock<any, Promise<Entry[]>>).mockResolvedValueOnce(
        playstation.entries,
      );
      (
        getInstalledApplicationForCategory as Mock<any, Application>
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
