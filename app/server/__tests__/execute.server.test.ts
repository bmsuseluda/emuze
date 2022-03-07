import { readCategory } from "~/server/categories.server";
import { Category } from "~/types/category";

import { executeApplication } from "../execute.server";
import { gateofthunder, pcenginecd } from "../__testData__/category";

const execFileMock = jest.fn();
jest.mock("child_process", () => ({
  execFileSync: (applicationPath: string, entryPath: string) =>
    execFileMock(applicationPath, entryPath),
}));

jest.mock("~/server/categories.server", () => ({
  readCategory: jest.fn(),
}));

describe("execute.server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("executeApplication", () => {
    it("Should execute the entry with the defined application of the category", () => {
      (readCategory as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);

      executeApplication(pcenginecd.id, gateofthunder.id);

      expect(execFileMock).toHaveBeenCalledWith(pcenginecd.applicationPath, [
        gateofthunder.path,
      ]);
    });

    it("Should not execute the entry if the entry id is not known", () => {
      (readCategory as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);

      executeApplication(pcenginecd.id, "unknownEntryId");

      expect(execFileMock).toHaveBeenCalledTimes(0);
    });
  });
});
