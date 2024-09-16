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
  pcenginecd,
  pcenginecdLinux,
} from "../__testData__/category";
import type { General } from "../../types/jsonFiles/settings/general";
import type { Appearance } from "../../types/jsonFiles/settings/appearance";
import type { Mock } from "vitest";
import { general } from "../__testData__/general";
import { existsSync } from "fs";
import { mameNeoGeo, mednafen } from "../__testData__/applications";
import { readFilenames } from "../readWriteData.server";
import { when } from "vitest-when";
import { updateFlatpakAppList } from "../applicationsDB.server/checkEmulatorIsInstalled";

vi.mock("@kmamal/sdl");

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

vi.mock("../readWriteData.server", () => ({
  readFilenames: vi.fn(),
}));

vi.mock("../categories.server", () => ({
  readCategory: vi.fn(),
}));
vi.mock("../settings.server", () => ({
  readGeneral: vi.fn(),
  readAppearance: vi.fn(),
}));
vi.mock("../lastPlayed.server", () => ({
  addToLastPlayedCached: vi.fn(),
}));

const getFirstEntry = (
  category: Category & Required<Pick<Category, "entries">>,
) => category.entries[0];

const flatpakAppList = Object.values(applicationsDB)
  .map(({ flatpakId }) => flatpakId)
  .join(" ");

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
      });

      it("Should execute the entry with the defined application of the category", () => {
        (existsSync as unknown as Mock<any, boolean>).mockReturnValueOnce(true);
        (readCategory as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
        (readFilenames as Mock<any, string[]>).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        executeApplication(pcenginecd.id, entry);

        expect(execFileMock).toHaveBeenCalledWith(mednafen.path, [
          createAbsoluteEntryPath(pcenginecd.name, entry.path),
        ]);
      });

      it("Should add optional params", () => {
        (existsSync as unknown as Mock<any, boolean>).mockReturnValueOnce(true);
        (readCategory as Mock<any, Category>).mockReturnValueOnce(neogeo);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        (readFilenames as Mock<any, string[]>).mockReturnValue([
          mameNeoGeo.path,
        ]);
        const entry = getFirstEntry(neogeo);

        executeApplication(neogeo.id, entry);

        expect(execFileMock).toHaveBeenCalledWith(mameNeoGeo.path, [
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
        (existsSync as unknown as Mock<any, boolean>).mockReturnValueOnce(true);
        (readCategory as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
        (readFilenames as Mock<any, string[]>).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        executeApplication(pcenginecd.id, entry);

        expect(execFileMock).toHaveBeenCalledWith(mednafen.path, [
          createAbsoluteEntryPath(pcenginecd.name, entry.path),
        ]);
        expect(process.env.MEDNAFEN_HOME).toBe(nodepath.dirname(mednafen.path));
      });

      it("Should not execute if emulator is not installed", () => {
        (existsSync as unknown as Mock<any, boolean>).mockReturnValueOnce(
          false,
        );
        (readCategory as Mock<any, Category>).mockReturnValueOnce(pcenginecd);
        (readFilenames as Mock<any, string[]>).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        expect(() => executeApplication(pcenginecd.id, entry)).toThrowError();

        expect(execFileMock).not.toHaveBeenCalled();
      });
    });

    describe("executeApplicationOnLinux", () => {
      beforeEach(() => {
        vi.stubEnv("EMUZE_IS_WINDOWS", "false");
        (readGeneral as Mock<any, General>).mockReturnValue({
          ...general,
        });
        (readAppearance as Mock<any, Appearance>).mockReturnValue({
          fullscreen: false,
        });
        (existsSync as unknown as Mock<any, boolean>).mockReturnValueOnce(true);
      });

      it("Should execute the entry with the defined application of the category", () => {
        when(execFileMock)
          .calledWith("flatpak", ["list", "--app"])
          .thenReturn(flatpakAppList);
        (readCategory as Mock<any, Category>).mockReturnValueOnce(
          pcenginecdLinux,
        );
        const entry = getFirstEntry(pcenginecdLinux);

        executeApplication(pcenginecdLinux.id, entry);

        expect(execFileMock).toHaveBeenCalledWith("flatpak", [
          "run",
          "--filesystem=F:/games/Emulation/roms",
          "--command=mednafen",
          applicationsDB.mednafen.flatpakId,
          createAbsoluteEntryPath(pcenginecdLinux.name, entry.path),
        ]);
      });

      it("Should add optional params", () => {
        when(execFileMock)
          .calledWith("flatpak", ["list", "--app"])
          .thenReturn(flatpakAppList);
        (readCategory as Mock<any, Category>).mockReturnValueOnce(neogeo);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        const entry = getFirstEntry(neogeo);

        executeApplication(neogeo.id, entry);

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

      it("Should not execute if emulator is not installed", () => {
        when(execFileMock)
          .calledWith("flatpak", ["list", "--app"])
          .thenReturn("");
        updateFlatpakAppList();
        (readCategory as Mock<any, Category>).mockReturnValueOnce(
          pcenginecdLinux,
        );
        const entry = getFirstEntry(pcenginecdLinux);

        expect(() =>
          executeApplication(pcenginecdLinux.id, entry),
        ).toThrowError();

        expect(execFileMock).toBeCalledTimes(2);

        expect(execFileMock).not.toHaveBeenCalledWith("flatpak", [
          "run",
          "--filesystem=F:/games/Emulation/roms",
          "--command=mednafen",
          applicationsDB.mednafen.flatpakId,
          createAbsoluteEntryPath(pcenginecdLinux.name, entry.path),
        ]);
      });
    });
  });
});
