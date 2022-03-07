import { readdirSync } from "fs";
import { when } from "jest-when";
import nodepath from "path";

import { readDirectorynames, readFilenames } from "../readWriteData.server";
import {
  pcenginecd,
  cotton,
  gateofthunder,
  playstation,
  hugo,
  hugo2,
} from "../__testData__/category";

jest.mock("fs", () => ({
  readdirSync: jest.fn(),
}));

class SimpleDirent {
  name: string;
  directory: boolean;

  constructor(name: string, directory: boolean) {
    this.name = name;
    this.directory = directory;
  }

  isDirectory(): boolean {
    return this.directory;
  }
}

type ReadDirMock = jest.Mock<SimpleDirent[]>;

describe("readWriteData.server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("readFilenames", () => {
    it("Should return filenames with supported filenames only", () => {
      (readdirSync as unknown as ReadDirMock).mockReturnValueOnce([
        new SimpleDirent("Cotton.cue", false),
        new SimpleDirent("Gate of Thunder.CUE", false),
        new SimpleDirent("game without file extension", false),
        new SimpleDirent("game with unsupported file extension.wasd", false),
      ]);

      expect(
        readFilenames(pcenginecd.entryPath, pcenginecd.fileExtensions)
      ).toStrictEqual([cotton.path, gateofthunder.path]);
    });

    it("Should return filenames with supported filenames from subfolders", () => {
      when(readdirSync as unknown as ReadDirMock)
        .calledWith(playstation.entryPath, {
          encoding: "utf8",
          withFileTypes: true,
        })
        .mockReturnValueOnce([
          new SimpleDirent("Hugo", true),
          new SimpleDirent("Hugo 2.chd", false),
          new SimpleDirent("game with unsupported file extension.wasd", false),
        ]);

      when(readdirSync as unknown as ReadDirMock)
        .calledWith(nodepath.join(playstation.entryPath, "Hugo"), {
          encoding: "utf8",
          withFileTypes: true,
        })
        .mockReturnValueOnce([
          new SimpleDirent("Hugo.chd", false),
          new SimpleDirent("game without file extension", false),
          new SimpleDirent("game with unsupported file extension.wasd", false),
        ]);

      expect(
        readFilenames(playstation.entryPath, playstation.fileExtensions)
      ).toStrictEqual([hugo.path, hugo2.path]);
    });
  });

  describe("readDirectories", () => {
    (readdirSync as unknown as ReadDirMock).mockReturnValueOnce([
      new SimpleDirent("Hugo", true),
      new SimpleDirent("Hugo 2.chd", false),
      new SimpleDirent("game with unsupported file extension.wasd", false),
    ]);

    expect(readDirectorynames(playstation.entryPath)).toStrictEqual([
      nodepath.join(playstation.entryPath, "Hugo"),
    ]);
  });
});
