import { readdirSync } from "fs";
import { when } from "jest-when";
import nodepath from "path";

import { readDirectorynames, readFilenames } from "../readWriteData.server";
import {
  cotton,
  gateofthunder,
  hugo,
  hugo2,
  pcenginecd,
  playstation,
} from "../__testData__/category";
import { duckstation, mednafen } from "~/server/applicationsDB.server";
import type { Mock } from "vitest";

vi.mock("fs", async () => {
  const actual = await vi.importActual<object>("fs");
  return {
    ...actual,
    readdirSync: vi.fn(),
  };
});

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

type ReadDirMock = Mock<any, SimpleDirent[]>;

describe("readWriteData.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
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
        readFilenames(pcenginecd.entryPath, mednafen.fileExtensions)
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
        readFilenames(playstation.entryPath, duckstation.fileExtensions)
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
