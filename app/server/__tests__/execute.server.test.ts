import nodepath from "path";
import { execFileSync } from "child_process";

import { readCategory } from "../categories.server";
import { readAppearance, readGeneral } from "../settings.server";
import type { Category } from "../../types/jsonFiles/category";
import { applications as applicationsDB } from "../applicationsDB.server";

import { startGame } from "../execute.server";
import {
  createAbsoluteEntryPath,
  neogeo,
  pcenginecd,
  pcenginecdLinux,
} from "../__testData__/category";
import { general } from "../__testData__/general";
import { existsSync } from "fs";
import { mameNeoGeo, mednafen } from "../__testData__/applications";
import { readFilenames } from "../readWriteData.server";
import { when } from "vitest-when";
import { updateFlatpakAppList } from "../applicationsDB.server/checkEmulatorIsInstalled";

vi.mock("@bmsuseluda/node-sdl");
vi.mock("child_process");
vi.mock("fs");
vi.mock("../readWriteData.server");
vi.mock("../categories.server");
vi.mock("../settings.server");
vi.mock("../lastPlayed.server");

const getFirstEntry = (
  category: Category & Required<Pick<Category, "entries">>,
) => category.entries[0];

const flatpakAppList = Object.values(applicationsDB)
  .map(({ flatpakId }) => flatpakId)
  .join(" ");

describe("execute.server", () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    process.env = { ...env };
  });

  describe("executeApplication", () => {
    describe("executeApplicationOnWindows", () => {
      beforeEach(() => {
        vi.stubEnv("EMUZE_IS_WINDOWS", "true");
        vi.mocked(readGeneral).mockReturnValue({
          ...general,
        });
        vi.mocked(readAppearance).mockReturnValue({
          fullscreen: false,
        });
      });

      it("Should execute the entry with the defined application of the category", () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);
        vi.mocked(readFilenames).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        startGame(pcenginecd.id, entry);

        expect(execFileSync).toHaveBeenCalledWith(
          mednafen.path,
          [createAbsoluteEntryPath(pcenginecd.name, entry.path)],
          {
            encoding: "utf8",
          },
        );
      });

      it("Should add optional params", () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(neogeo);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        vi.mocked(readFilenames).mockReturnValue([mameNeoGeo.path]);
        const entry = getFirstEntry(neogeo);

        startGame(neogeo.id, entry);

        expect(execFileSync).toHaveBeenCalledWith(
          mameNeoGeo.path,
          [
            "-w",
            "-rompath",
            entryDirname,
            "-cfg_directory",
            nodepath.join(entryDirname, "cfg"),
            "-nvram_directory",
            nodepath.join(entryDirname, "nvram"),
            createAbsoluteEntryPath(neogeo.name, entry.path),
          ],
          {
            encoding: "utf8",
          },
        );
      });

      it("Should add environment varables", () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);
        vi.mocked(readFilenames).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        startGame(pcenginecd.id, entry);

        expect(execFileSync).toHaveBeenCalledWith(
          mednafen.path,
          [createAbsoluteEntryPath(pcenginecd.name, entry.path)],
          {
            encoding: "utf8",
          },
        );
        expect(process.env.MEDNAFEN_HOME).toBe(nodepath.dirname(mednafen.path));
      });

      it("Should not execute if emulator is not installed", () => {
        vi.mocked(existsSync).mockReturnValueOnce(false);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);
        vi.mocked(readFilenames).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        expect(() => startGame(pcenginecd.id, entry)).toThrowError();

        expect(execFileSync).not.toHaveBeenCalled();
      });
    });

    describe("executeApplicationOnLinux", () => {
      beforeEach(() => {
        vi.stubEnv("EMUZE_IS_WINDOWS", "false");
        vi.mocked(readGeneral).mockReturnValue({
          ...general,
        });
        vi.mocked(readAppearance).mockReturnValue({
          fullscreen: false,
        });
        vi.mocked(existsSync).mockReturnValueOnce(true);
      });

      it("Should execute the entry with the defined application of the category", () => {
        when(execFileSync)
          .calledWith("flatpak", ["list", "--app"], {
            encoding: "utf8",
          })
          .thenReturn(flatpakAppList);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecdLinux);
        const entry = getFirstEntry(pcenginecdLinux);

        startGame(pcenginecdLinux.id, entry);

        expect(execFileSync).toHaveBeenCalledWith(
          "flatpak",
          [
            "run",
            "--filesystem=F:/games/Emulation/roms",
            "--command=mednafen",
            applicationsDB.mednafen.flatpakId,
            createAbsoluteEntryPath(pcenginecdLinux.name, entry.path),
          ],
          {
            encoding: "utf8",
          },
        );
      });

      it("Should add optional params", () => {
        when(execFileSync)
          .calledWith("flatpak", ["list", "--app"], {
            encoding: "utf8",
          })
          .thenReturn(flatpakAppList);
        vi.mocked(readCategory).mockReturnValueOnce(neogeo);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        const entry = getFirstEntry(neogeo);

        startGame(neogeo.id, entry);

        expect(execFileSync).toHaveBeenCalledWith(
          "flatpak",
          [
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
          ],
          {
            encoding: "utf8",
          },
        );
      });

      it("Should not execute if emulator is not installed", () => {
        when(execFileSync)
          .calledWith("flatpak", ["list", "--app"], {
            encoding: "utf8",
          })
          .thenReturn("");
        updateFlatpakAppList();
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecdLinux);
        const entry = getFirstEntry(pcenginecdLinux);

        expect(() => startGame(pcenginecdLinux.id, entry)).toThrowError();

        expect(execFileSync).toBeCalledTimes(2);

        expect(execFileSync).not.toHaveBeenCalledWith(
          "flatpak",
          [
            "run",
            "--filesystem=F:/games/Emulation/roms",
            "--command=mednafen",
            applicationsDB.mednafen.flatpakId,
            createAbsoluteEntryPath(pcenginecdLinux.name, entry.path),
          ],
          {
            encoding: "utf8",
          },
        );
      });
    });
  });
});
