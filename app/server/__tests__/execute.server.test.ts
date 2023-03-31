import nodepath from "path";

import { readCategory } from "~/server/categories.server";
import { readAppearance, readGeneral } from "~/server/settings.server";
import type { Category } from "~/types/category";

import { executeApplication } from "../execute.server";
import {
  neogeo,
  neogeoLinux,
  pcenginecd,
  pcenginecdLinux,
} from "../__testData__/category";
import type { General } from "~/types/settings/general";
import type { Appearance } from "~/types/settings/appearance";

const execFileMock = jest.fn();
jest.mock("child_process", () => ({
  execFileSync: (applicationPath: string, entryPath: string) =>
    execFileMock(applicationPath, entryPath),
  execFile: (applicationPath: string, entryPath: string) =>
    execFileMock(applicationPath, entryPath),
}));

jest.mock("~/server/categories.server", () => ({
  readCategory: jest.fn(),
}));
jest.mock("~/server/settings.server", () => ({
  readGeneral: jest.fn(),
  readAppearance: jest.fn(),
}));

const getFirstEntry = (category: Category) => category.entries![0];

describe("execute.server", () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    process.env = { ...env };
  });

  describe("executeApplication", () => {
    describe("executeApplicationOnWindows", () => {
      beforeEach(() => {
        (readGeneral as jest.Mock<General>).mockReturnValue({
          isWindows: true,
        });
        (readAppearance as jest.Mock<Appearance>).mockReturnValue({
          fullscreen: false,
        });
      });

      it("Should execute the entry with the defined application of the category", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);
        const entry = getFirstEntry(pcenginecd);

        executeApplication(pcenginecd.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith(pcenginecd.applicationPath, [
          entry.path,
        ]);
      });

      it("Should not execute the entry if the entry id is not known", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);

        executeApplication(pcenginecd.id, "unknownEntryId");

        expect(execFileMock).toHaveBeenCalledTimes(0);
      });

      it("Should add optional params", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(neogeo);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        const entry = getFirstEntry(neogeo);

        executeApplication(neogeo.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith(neogeo.applicationPath, [
          "-w",
          "-rompath",
          entryDirname,
          "-cfg_directory",
          nodepath.join(entryDirname, "cfg"),
          "-nvram_directory",
          nodepath.join(entryDirname, "nvram"),
          entry.path,
        ]);
      });

      it("Should add environment varables", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);
        const entry = getFirstEntry(pcenginecd);

        executeApplication(pcenginecd.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith(pcenginecd.applicationPath, [
          entry.path,
        ]);
        expect(process.env.MEDNAFEN_HOME).toBe(
          nodepath.dirname(pcenginecd.applicationPath)
        );
      });
    });

    describe("executeApplicationOnLinux", () => {
      beforeEach(() => {
        (readGeneral as jest.Mock<General>).mockReturnValue({
          isWindows: false,
        });
        (readAppearance as jest.Mock<Appearance>).mockReturnValue({
          fullscreen: false,
        });
      });

      it("Should execute the entry with the defined application of the category", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(
          pcenginecdLinux
        );
        const entry = getFirstEntry(pcenginecdLinux);

        executeApplication(pcenginecdLinux.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith("flatpak", [
          "run",
          pcenginecdLinux.applicationFlatpakId,
          entry.path,
        ]);
      });

      it("Should not execute the entry if the entry id is not known", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(
          pcenginecdLinux
        );

        executeApplication(pcenginecdLinux.id, "unknownEntryId");

        expect(execFileMock).toHaveBeenCalledTimes(0);
      });

      it("Should add optional params", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(neogeoLinux);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        const entry = getFirstEntry(neogeo);

        executeApplication(neogeo.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith("flatpak", [
          "run",
          neogeoLinux.applicationFlatpakId,
          "-w",
          "-rompath",
          entryDirname,
          "-cfg_directory",
          nodepath.join(entryDirname, "cfg"),
          "-nvram_directory",
          nodepath.join(entryDirname, "nvram"),
          entry.path,
        ]);
      });
    });
  });
});
