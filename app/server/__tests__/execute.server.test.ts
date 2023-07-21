import nodepath from "path";

import { readCategory } from "~/server/categories.server";
import { readAppearance, readGeneral } from "~/server/settings.server";
import type { Category } from "~/types/jsonFiles/category";
import { applications as applicationsDB } from "../applicationsDB.server";

import { executeApplication } from "../execute.server";
import {
  neogeo,
  neogeoLinux,
  pcenginecd,
  pcenginecdLinux,
} from "../__testData__/category";
import type { General } from "~/types/jsonFiles/settings/general";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";
import type { Mock } from "vitest";

const execFileMock = vi.fn();
vi.mock("child_process", () => ({
  execFileSync: (applicationPath: string, entryPath: string) =>
    execFileMock(applicationPath, entryPath),
}));

vi.mock("~/server/categories.server", () => ({
  readCategory: vi.fn(),
}));
vi.mock("~/server/settings.server", () => ({
  readGeneral: vi.fn(),
  readAppearance: vi.fn(),
}));

const getFirstEntry = (
  category: Category & Required<Pick<Category, "entries">>
) => category.entries[0];

describe("execute.server", () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    process.env = { ...env };
  });

  describe("executeApplication", () => {
    describe("executeApplicationOnWindows", () => {
      beforeEach(() => {
        (readGeneral as Mock<any, General>).mockReturnValue({
          isWindows: true,
        });
        (readAppearance as Mock<any, Appearance>).mockReturnValue({
          fullscreen: false,
        });
      });

      it("Should execute the entry with the defined application of the category", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
        const entry = getFirstEntry(pcenginecd);

        executeApplication(pcenginecd.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith(pcenginecd.application.path, [
          entry.path,
        ]);
      });

      it("Should not execute the entry if the entry id is not known", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(pcenginecd);

        executeApplication(pcenginecd.id, "unknownEntryId");

        expect(execFileMock).toHaveBeenCalledTimes(0);
      });

      it("Should add optional params", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(neogeo);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        const entry = getFirstEntry(neogeo);

        executeApplication(neogeo.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith(neogeo.application.path, [
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
        (readCategory as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
        const entry = getFirstEntry(pcenginecd);

        executeApplication(pcenginecd.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith(pcenginecd.application.path, [
          entry.path,
        ]);
        expect(process.env.MEDNAFEN_HOME).toBe(
          nodepath.dirname(pcenginecd.application.path)
        );
      });
    });

    describe("executeApplicationOnLinux", () => {
      beforeEach(() => {
        (readGeneral as Mock<any, General>).mockReturnValue({
          isWindows: false,
        });
        (readAppearance as Mock<any, Appearance>).mockReturnValue({
          fullscreen: false,
        });
      });

      it("Should execute the entry with the defined application of the category", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(
          pcenginecdLinux
        );
        const entry = getFirstEntry(pcenginecdLinux);

        executeApplication(pcenginecdLinux.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith("flatpak", [
          "run",
          "--command=mednafen",
          applicationsDB.mednafen.flatpakId,
          entry.path,
        ]);
      });

      it("Should not execute the entry if the entry id is not known", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(
          pcenginecdLinux
        );

        executeApplication(pcenginecdLinux.id, "unknownEntryId");

        expect(execFileMock).toHaveBeenCalledTimes(0);
      });

      it("Should add optional params", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(neogeoLinux);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        const entry = getFirstEntry(neogeo);

        executeApplication(neogeo.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith("flatpak", [
          "run",
          applicationsDB.mame.flatpakId,
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
