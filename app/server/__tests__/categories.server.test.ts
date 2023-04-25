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
import { readApplications } from "~/server/applications.server";
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
import type { Applications } from "~/types/applications";
import { applications } from "../__testData__/applications";
import type { Category, Entry } from "~/types/category";
import { general } from "../__testData__/general";
import { fetchMetaData } from "~/server/igdb.server";

const writeFileMock = jest.fn();
jest.mock("~/server/readWriteData.server", () => ({
  readFileHome: jest.fn(),
  readDirectorynames: jest.fn(),
  readFilenames: jest.fn(),
  writeFileHome: (object: unknown, path: string) => writeFileMock(object, path),
}));

jest.mock("~/server/applications.server", () => ({
  readApplications: jest.fn(),
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
        .calledWith(neogeo.entryPath, neogeo.fileExtensions)
        .mockReturnValueOnce([
          blazingstar.path,
          "F:/games/Emulation/roms/Neo Geo/neogeo.zip",
        ]);
      (readFileHome as jest.Mock<Category>).mockReturnValueOnce(neogeo);

      const expectedResult: Entry[] = [
        { ...blazingstar, name: "Blazing Star", id: `${blazingstar.id}0` },
      ];

      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockResolvedValueOnce(
        expectedResult
      );

      const result = await readEntriesWithMetaData(
        neogeo.id,
        neogeo.entryPath,
        neogeo.igdbPlatformIds,
        neogeo.applicationId
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should only fetch metaData for entries without metaData", async () => {
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(playstation.entryPath, playstation.fileExtensions)
        .mockReturnValueOnce([hugo.path, hugo2.path]);
      (readFileHome as jest.Mock<Category>).mockReturnValueOnce({
        ...playstation,
        entries: addIndex([
          hugo,
          {
            ...hugo2,
            imageUrl: "https://www.allImagesComeFromHere.com/hugo2.png",
          },
        ]),
      });

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
        playstation.igdbPlatformIds,
        playstation.applicationId
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
        playstation.igdbPlatformIds,
        addIndex([hugo])
      );
    });

    it("Should fetch metaData for all entries if there is no oldCategoryData", async () => {
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(playstation.entryPath, playstation.fileExtensions)
        .mockReturnValueOnce([hugo.path, hugo2.path]);
      (readFileHome as jest.Mock<Category | null>).mockReturnValue(null);

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
        playstation.igdbPlatformIds,
        playstation.applicationId
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
        playstation.igdbPlatformIds,
        addIndex([hugo, hugo2])
      );
    });
  });

  describe("importCategories", () => {
    it("Should import 3ds and pcengine data", async () => {
      // evaluate
      (readApplications as jest.Mock<Applications>).mockReturnValueOnce(
        applications
      );
      (readDirectorynames as jest.Mock<string[]>).mockReturnValueOnce([
        nintendo3ds.entryPath,
        "unknown category",
        pcenginecd.entryPath,
      ]);
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(nintendo3ds.entryPath, nintendo3ds.fileExtensions)
        .mockReturnValueOnce([metroidsamusreturns.path]);
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(pcenginecd.entryPath, pcenginecd.fileExtensions)
        .mockReturnValueOnce([cotton.path, gateofthunder.path]);
      (readFileHome as jest.Mock<Category>).mockReturnValueOnce(nintendo3ds);
      (readFileHome as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);
      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockResolvedValueOnce(
        nintendo3ds.entries!
      );
      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockResolvedValueOnce(
        pcenginecd.entries!
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
      // TODO: Remove if double call is not necessary
      (readFileHome as jest.Mock<Category>).mockReturnValueOnce(playstation);
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        hugo.path,
        hugo2.path,
      ]);
      (fetchMetaData as jest.Mock<Promise<Entry[]>>).mockResolvedValueOnce(
        playstation.entries!
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
