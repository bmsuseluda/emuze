import nodepath from "path";
import { execFile, execFileSync } from "child_process";

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
import { readCategory } from "../categoryDataCache.server";

vi.mock("@kmamal/sdl");
vi.mock("child_process");
vi.mock("fs");
vi.mock("../readWriteData.server");
vi.mock("../categoryDataCache.server");
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

      it("Should execute the entry with the defined application of the category", async () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);
        vi.mocked(readFilenames).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        await startGame(pcenginecd.id, entry);

        expect(execFile).toHaveBeenCalledWith(
          mednafen.path,
          ["wrong"],
          {
            encoding: "utf8",
          },
          expect.anything(),
        );
        expect(execFile).toHaveBeenCalledWith(
          mednafen.path,
          expect.arrayContaining([
            createAbsoluteEntryPath(pcenginecd.name, entry.path),
          ]),
          {
            encoding: "utf8",
          },
          expect.anything(),
        );
      });

      it("Should add optional params", async () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(neogeo);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        vi.mocked(readFilenames).mockReturnValue([mameNeoGeo.path]);
        const entry = getFirstEntry(neogeo);

        await startGame(neogeo.id, entry);

        expect(execFile).toHaveBeenCalledWith(
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

      it("Should add environment variables", async () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);
        vi.mocked(readFilenames).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        await startGame(pcenginecd.id, entry);

        expect(execFile).toHaveBeenCalledWith(mednafen.path, ["wrong"], {
          encoding: "utf8",
        });
        expect(execFile).toHaveBeenCalledWith(
          mednafen.path,
          expect.arrayContaining([
            createAbsoluteEntryPath(pcenginecd.name, entry.path),
          ]),
          {
            encoding: "utf8",
          },
        );
        expect(process.env.MEDNAFEN_HOME).toBe(nodepath.dirname(mednafen.path));
      });

      it("Should not execute if emulator is not installed", async () => {
        vi.mocked(existsSync).mockReturnValueOnce(false);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);
        vi.mocked(readFilenames).mockReturnValue([mednafen.path]);
        const entry = getFirstEntry(pcenginecd);

        await expect(startGame(pcenginecd.id, entry)).rejects.toThrowError();

        expect(execFile).not.toHaveBeenCalled();
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

      it("Should execute the entry with the defined application of the category", async () => {
        when(execFileSync)
          .calledWith("flatpak", ["list", "--app"], {
            encoding: "utf8",
          })
          .thenReturn(flatpakAppList);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecdLinux);
        const entry = getFirstEntry(pcenginecdLinux);

        await startGame(pcenginecdLinux.id, entry);

        expect(execFile).toHaveBeenCalledWith(
          "flatpak",
          [
            "run",
            "--command=mednafen",
            applicationsDB.mednafen.flatpakId,
            "wrong",
          ],
          {
            encoding: "utf8",
          },
        );
        expect(execFile).toHaveBeenCalledWith(
          "flatpak",
          expect.arrayContaining([
            "run",
            "--filesystem=F:/games/Emulation/roms",
            "--command=mednafen",
            applicationsDB.mednafen.flatpakId,
            createAbsoluteEntryPath(pcenginecdLinux.name, entry.path),
          ]),
          {
            encoding: "utf8",
          },
          expect.anything,
        );
      });

      it("Should add optional params", async () => {
        when(execFileSync)
          .calledWith("flatpak", ["list", "--app"], {
            encoding: "utf8",
          })
          .thenReturn(flatpakAppList);
        vi.mocked(readCategory).mockReturnValueOnce(neogeo);
        const entryDirname = "F:/games/Emulation/roms/Neo Geo";
        const entry = getFirstEntry(neogeo);

        await startGame(neogeo.id, entry);

        expect(execFile).toHaveBeenCalledWith(
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
          expect.anything(),
        );
      });

      it("Should not execute if emulator is not installed", async () => {
        when(execFileSync)
          .calledWith("flatpak", ["list", "--app"], {
            encoding: "utf8",
          })
          .thenReturn("");
        updateFlatpakAppList();
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecdLinux);
        const entry = getFirstEntry(pcenginecdLinux);

        await expect(
          startGame(pcenginecdLinux.id, entry),
        ).rejects.toThrowError();

        expect(execFile).toBeCalledTimes(3);

        expect(execFile).not.toHaveBeenCalledWith(
          "flatpak",
          expect.arrayContaining([
            "run",
            "--filesystem=F:/games/Emulation/roms",
            "--command=mednafen",
            applicationsDB.mednafen.flatpakId,
            createAbsoluteEntryPath(pcenginecdLinux.name, entry.path),
          ]),
          {
            encoding: "utf8",
          },
        );
      });
    });
  });
});
