import { when } from "jest-when";
import nodepath from "path";

import { importCategories, importEntries, paths } from "../categories.server";
import {
  readDirectorynames,
  readFilenames,
  readFile,
} from "~/server/readWriteData.server";
import { readApplications } from "~/server/applications.server";
import {
  nintendo3ds,
  pcenginecd,
  playstation,
  metroidsamusreturns,
  gateofthunder,
  cotton,
  hugo,
  hugo2,
} from "../__testData__/category";
import { Applications } from "~/types/applications";
import { applications } from "../__testData__/applications";
import { Category } from "~/types/category";

const writeFileMock = jest.fn();
jest.mock("~/server/readWriteData.server", () => ({
  readFile: jest.fn(),
  readDirectorynames: jest.fn(),
  readFilenames: jest.fn(),
  writeFile: (object: unknown, path: string) => writeFileMock(object, path),
}));

jest.mock("~/server/applications.server", () => ({
  readApplications: jest.fn(),
}));

jest.mock("fs");

const igdbRequestMock = jest.fn();
jest.mock("igdb-api-node", () => () => ({
  fields: () => ({
    where: () => ({
      limit: () => ({
        request: igdbRequestMock,
      }),
    }),
  }),
}));

describe("categories.server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
      igdbRequestMock.mockResolvedValue({
        data: [],
      });

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
    // TODO: add test with covers in response
    it("Should update entries and keep general category data", async () => {
      // evaluate
      (readFile as jest.Mock<Category>).mockReturnValueOnce(playstation);
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        hugo.path,
        hugo2.path,
      ]);
      igdbRequestMock.mockResolvedValue({
        data: [],
      });

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
