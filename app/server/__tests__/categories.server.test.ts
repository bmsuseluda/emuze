import { when } from "jest-when";
import nodepath from "path";

import {
  importCategories,
  importEntries,
  paths,
  readEntriesWithImages,
} from "../categories.server";
import {
  readDirectorynames,
  readFileHome,
  readFilenames,
} from "~/server/readWriteData.server";
import { readApplications } from "~/server/applications.server";
import {
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
import type { Category } from "~/types/category";
import { general } from "../__testData__/general";

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

const igdbRequestMock = jest.fn();
jest.mock("apicalypse", () => () => ({
  fields: () => ({
    where: () => ({
      limit: () => ({
        requestAll: igdbRequestMock,
      }),
    }),
  }),
}));

describe("categories.server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("readEntriesWithImages", () => {
    it("Should filter excluded filenames (neogeo.zip) and find entryName from json file", async () => {
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(neogeo.entryPath, neogeo.fileExtensions)
        .mockReturnValueOnce([
          blazingstar.path,
          "F:/games/Emulation/roms/Neo Geo/neogeo.zip",
        ]);
      igdbRequestMock.mockResolvedValue([]);

      const result = await readEntriesWithImages(
        neogeo.entryPath,
        neogeo.fileExtensions,
        neogeo.igdbPlatformIds,
        neogeo.applicationId
      );

      expect(result).toStrictEqual([{ ...blazingstar, name: "Blazing Star" }]);
    });
  });

  describe("importCategories", () => {
    it("Should import 3ds and pcengine data", async () => {
      // evaluate
      (readApplications as jest.Mock<Applications>).mockReturnValueOnce(
        applications
      );
      (readDirectorynames as jest.Mock<string[]>).mockReturnValueOnce([
        pcenginecd.entryPath,
        "unknown category",
        nintendo3ds.entryPath,
      ]);
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(nintendo3ds.entryPath, nintendo3ds.fileExtensions)
        .mockReturnValueOnce([metroidsamusreturns.path]);
      when(readFilenames as jest.Mock<string[]>)
        .calledWith(pcenginecd.entryPath, pcenginecd.fileExtensions)
        .mockReturnValueOnce([gateofthunder.path, cotton.path]);
      igdbRequestMock.mockResolvedValue([]);

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
      igdbRequestMock.mockResolvedValue([]);

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
