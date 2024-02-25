import { readdirSync } from "fs";
import { when } from "jest-when";
import nodepath from "path";

import { readDirectorynames, readFilenames } from "../readWriteData.server";
import {
  bladerunner,
  cotton,
  createAbsoluteEntryPath,
  createCategoryPath,
  gateofthunder,
  hugo,
  hugo2,
  monkeyIsland,
  pcenginecd,
  playstation,
  scumm,
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
        readFilenames({
          path: createCategoryPath(pcenginecd.name),
          fileExtensions: mednafen.fileExtensions,
        }),
      ).toStrictEqual([
        createAbsoluteEntryPath(pcenginecd.name, cotton.path),
        createAbsoluteEntryPath(pcenginecd.name, gateofthunder.path),
      ]);
    });

    it("Should return filenames with supported filenames from subfolders", () => {
      when(readdirSync as unknown as ReadDirMock)
        .calledWith(createCategoryPath(playstation.name), {
          encoding: "utf8",
          withFileTypes: true,
        })
        .mockReturnValueOnce([
          new SimpleDirent("Hugo", true),
          new SimpleDirent("Hugo 2.chd", false),
          new SimpleDirent("game with unsupported file extension.wasd", false),
        ]);

      when(readdirSync as unknown as ReadDirMock)
        .calledWith(
          nodepath.join(createCategoryPath(playstation.name), "Hugo"),
          {
            encoding: "utf8",
            withFileTypes: true,
          },
        )
        .mockReturnValueOnce([
          new SimpleDirent("Hugo.chd", false),
          new SimpleDirent("game without file extension", false),
          new SimpleDirent("game with unsupported file extension.wasd", false),
        ]);

      expect(
        readFilenames({
          path: createCategoryPath(playstation.name),
          fileExtensions: duckstation.fileExtensions,
        }),
      ).toStrictEqual([
        createAbsoluteEntryPath(playstation.name, hugo.path),
        createAbsoluteEntryPath(playstation.name, hugo2.path),
      ]);
    });

    it("Should return directory paths only, if entryAsDirectory is true", () => {
      (readdirSync as unknown as ReadDirMock).mockReturnValueOnce([
        new SimpleDirent("Monkey Island.pak", false),
        new SimpleDirent(monkeyIsland.id, true),
        new SimpleDirent(bladerunner.id, true),
        new SimpleDirent("favorite games.txt", false),
      ]);

      expect(
        readFilenames({
          path: createCategoryPath(scumm.name),
          entryAsDirectory: true,
        }),
      ).toStrictEqual([
        createAbsoluteEntryPath(scumm.name, monkeyIsland.path),
        createAbsoluteEntryPath(scumm.name, bladerunner.path),
      ]);
    });
  });

  describe("readDirectories", () => {
    it("Should return directory names", () => {
      (readdirSync as unknown as ReadDirMock).mockReturnValueOnce([
        new SimpleDirent("Hugo", true),
        new SimpleDirent("Hugo 2.chd", false),
        new SimpleDirent("game with unsupported file extension.wasd", false),
      ]);

      expect(
        readDirectorynames(createCategoryPath(playstation.name)),
      ).toStrictEqual([
        nodepath.join(createCategoryPath(playstation.name), "Hugo"),
      ]);
    });
  });
});
