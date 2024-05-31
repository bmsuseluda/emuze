import nodepath from "path";
import type childProcess from "child_process";

import { readCategory } from "../categories.server";
import { readAppearance, readGeneral } from "../settings.server";
import type { Category } from "../../types/jsonFiles/category";
import { applications as applicationsDB } from "../applicationsDB.server";

import { executeApplication } from "../execute.server";
import {
  createAbsoluteEntryPath,
  neogeo,
  neogeoLinux,
  pcenginecd,
  pcenginecdLinux,
} from "../__testData__/category";
import type { General } from "../../types/jsonFiles/settings/general";
import type { Appearance } from "../../types/jsonFiles/settings/appearance";
import type { Mock } from "vitest";
import { general } from "../__testData__/general";
import { existsSync } from "fs";

vi.mock("@kmamal/sdl", () => ({
  default: () => ({
    controller: {
      devices: [],
    },
  }),
}));

const execFileMock = vi.fn();
vi.mock("child_process", async (importOriginal) => {
  const original = await importOriginal<typeof childProcess>();
  return {
    ...original,
    execFileSync: (applicationPath: string, entryPath: string) =>
      execFileMock(applicationPath, entryPath),
  };
});

vi.mock("fs", async () => {
  const actual = await vi.importActual<object>("fs");
  return {
    ...actual,
    existsSync: vi.fn(),
  };
});

vi.mock("../categories.server", () => ({
  readCategory: vi.fn(),
}));
vi.mock("../settings.server", () => ({
  readGeneral: vi.fn(),
  readAppearance: vi.fn(),
}));

const getFirstEntry = (
  category: Category & Required<Pick<Category, "entries">>,
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
        vi.stubEnv("EMUZE_IS_WINDOWS", "true");
        (readGeneral as Mock<any, General>).mockReturnValue({
          ...general,
        });
        (readAppearance as Mock<any, Appearance>).mockReturnValue({
          fullscreen: false,
        });
        (existsSync as unknown as Mock<any, boolean>).mockReturnValueOnce(true);
      });

      it("Should execute the entry with the defined application of the category", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
        const entry = getFirstEntry(pcenginecd);

        executeApplication(pcenginecd.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith(pcenginecd.application.path, [
          createAbsoluteEntryPath(pcenginecd.name, entry.path),
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
          createAbsoluteEntryPath(neogeo.name, entry.path),
        ]);
      });

      it("Should add environment varables", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
        const entry = getFirstEntry(pcenginecd);

        executeApplication(pcenginecd.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith(pcenginecd.application.path, [
          createAbsoluteEntryPath(pcenginecd.name, entry.path),
        ]);
        expect(process.env.MEDNAFEN_HOME).toBe(
          nodepath.dirname(pcenginecd.application.path),
        );
      });
    });

    describe("executeApplicationOnLinux", () => {
      beforeEach(() => {
        (readGeneral as Mock<any, General>).mockReturnValue({
          ...general,
        });
        (readAppearance as Mock<any, Appearance>).mockReturnValue({
          fullscreen: false,
        });
        (existsSync as unknown as Mock<any, boolean>).mockReturnValueOnce(true);
      });

      it("Should execute the entry with the defined application of the category", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(
          pcenginecdLinux,
        );
        const entry = getFirstEntry(pcenginecdLinux);

        executeApplication(pcenginecdLinux.id, entry.id);

        expect(execFileMock).toHaveBeenCalledWith("flatpak", [
          "run",
          "--filesystem=F:/games/Emulation/roms",
          "--command=mednafen",
          applicationsDB.mednafen.flatpakId,
          createAbsoluteEntryPath(pcenginecdLinux.name, entry.path),
        ]);
      });

      it("Should not execute the entry if the entry id is not known", () => {
        (readCategory as Mock<any, Category>).mockReturnValueOnce(
          pcenginecdLinux,
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
          "--filesystem=F:/games/Emulation/roms",
          applicationsDB.mame.flatpakId,
          "-w",
          "-rompath",
          entryDirname,
          "-cfg_directory",
          nodepath.join(entryDirname, "cfg"),
          "-nvram_directory",
          nodepath.join(entryDirname, "nvram"),
          createAbsoluteEntryPath(neogeo.name, entry.path),
        ]);
      });
    });
  });
});
