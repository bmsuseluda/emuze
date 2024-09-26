import { readdirSync } from "fs";
import { when } from "vitest-when";
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
import { mednafen } from "../applicationsDB.server";
import { duckstation } from "../applicationsDB.server/applications/duckstation";

vi.mock("@kmamal/sdl");
vi.mock("fs");

class SimpleDirent {
  name: string;
  directory: boolean;
  path: string;
  parentPath = "";

  constructor(name: string, directory: boolean) {
    this.name = name;
    this.directory = directory;
    this.path = name;
  }

  isDirectory(): boolean {
    return this.directory;
  }

  isFile(): boolean {
    return !this.directory;
  }

  isBlockDevice(): boolean {
    return false;
  }

  isCharacterDevice(): boolean {
    return false;
  }

  isSymbolicLink(): boolean {
    return false;
  }

  isFIFO(): boolean {
    return false;
  }

  isSocket(): boolean {
    return false;
  }
}

describe("readWriteData.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("readFilenames", () => {
    it("Should return filenames with supported filenames only", () => {
      vi.mocked(readdirSync).mockReturnValue([
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
      when(readdirSync, { times: 1 })
        .calledWith(createCategoryPath(playstation.name), {
          encoding: "utf8",
          withFileTypes: true,
        })
        .thenReturn([
          new SimpleDirent("Hugo", true),
          new SimpleDirent("Hugo 2.chd", false),
          new SimpleDirent("game with unsupported file extension.wasd", false),
        ]);

      when(readdirSync, { times: 1 })
        .calledWith(
          nodepath.join(createCategoryPath(playstation.name), "Hugo"),
          {
            encoding: "utf8",
            withFileTypes: true,
          },
        )
        .thenReturn([
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
      vi.mocked(readdirSync).mockReturnValueOnce([
        new SimpleDirent("Monkey Island.pak", false),
        new SimpleDirent(monkeyIsland.path, true),
        new SimpleDirent(bladerunner.path, true),
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
      vi.mocked(readdirSync).mockReturnValueOnce([
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
