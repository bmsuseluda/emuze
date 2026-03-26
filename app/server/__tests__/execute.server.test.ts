import type { ChildProcess } from "node:child_process";
import { execFile, spawnSync } from "node:child_process";
import nodepath from "node:path";

import type { Category } from "../../types/jsonFiles/category.js";
import { readAppearance, readGeneral } from "../settings.server.js";

import { existsSync } from "node:fs";
import {
  createAbsoluteEntryPath,
  pcenginecd,
} from "../__testData__/category.js";
import { general } from "../__testData__/general.js";
import { readCategory } from "../categoryDataCache.server.js";
import { startGame } from "../execute.server.js";
import { readFilenames } from "../readWriteData.server.js";
import { bundledEmulatorsPathBase } from "../bundledEmulatorsPath.server.js";
import { mednafen } from "../applicationsDB.server/applications/mednafen/index.js";
import type { DetectedRequiredFile } from "../applicationsDB.server/types.js";
import { getRequiredFiles } from "../applicationsDB.server/checkRequiredFiles.js";

vi.mock("@kmamal/sdl");
vi.mock("node:child_process");
vi.mock("node:fs");
vi.mock("../readWriteData.server");
vi.mock("../categoryDataCache.server");
vi.mock("../settings.server");
vi.mock("../lastPlayed.server");
vi.mock("../applicationsDB.server/checkRequiredFiles");

const getFirstEntry = (
  category: Category & Required<Pick<Category, "entries">>,
) => category.entries[0];

describe("execute.server", () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    process.env = { ...env };

    const childProcessMocked = {
      on: (event: string, callback: (code: number) => void) => {
        callback(0);
        return childProcessMocked;
      },
    } as ChildProcess;
    vi.mocked(execFile).mockReturnValue(childProcessMocked);
  });

  describe("executeApplication", () => {
    const detectedBiosFiles: DetectedRequiredFile[] = [
      { type: "default", filePath: "This is just a dummy path" },
    ];
    describe("executeApplicationOnWindows", () => {
      beforeEach(() => {
        vi.stubEnv("EMUZE_IS_WINDOWS", "true");
        vi.mocked(readGeneral).mockReturnValue({
          ...general,
        });
        vi.mocked(readAppearance).mockReturnValue({
          fullscreen: false,
        });
        vi.mocked(getRequiredFiles).mockReturnValue(detectedBiosFiles);
      });

      const mednafenPath = nodepath.join(
        bundledEmulatorsPathBase,
        mednafen.bundledPath!,
      );

      it("Should execute the entry with the defined application of the category", async () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);

        const entry = getFirstEntry(pcenginecd);

        await startGame(pcenginecd.id, entry);

        expect(spawnSync).toHaveBeenCalledWith(
          mednafenPath,
          ["wrong"],
          expect.anything(),
        );
        expect(execFile).toHaveBeenCalledWith(
          mednafenPath,
          expect.arrayContaining([
            createAbsoluteEntryPath(pcenginecd.name, entry.path),
          ]),
          {
            encoding: "utf8",
          },
          expect.anything(),
        );
      });

      it("Should add environment variables", async () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);
        vi.mocked(readFilenames).mockReturnValue([mednafenPath]);
        const entry = getFirstEntry(pcenginecd);

        await startGame(pcenginecd.id, entry);

        expect(spawnSync).toHaveBeenCalledWith(
          mednafenPath,
          ["wrong"],
          expect.anything(),
        );
        expect(execFile).toHaveBeenCalledWith(
          mednafenPath,
          expect.arrayContaining([
            createAbsoluteEntryPath(pcenginecd.name, entry.path),
          ]),
          {
            encoding: "utf8",
          },
          expect.anything(),
        );
        expect(process.env.MEDNAFEN_HOME).toBe(nodepath.dirname(mednafenPath));
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
        vi.mocked(getRequiredFiles).mockReturnValue(detectedBiosFiles);
      });

      const mednafenPath = nodepath.join(
        bundledEmulatorsPathBase,
        mednafen.bundledPath!,
      );

      it("Should execute the entry with the defined application of the category", async () => {
        vi.mocked(existsSync).mockReturnValueOnce(true);
        vi.mocked(readCategory).mockReturnValueOnce(pcenginecd);

        const entry = getFirstEntry(pcenginecd);

        await startGame(pcenginecd.id, entry);

        expect(spawnSync).toHaveBeenCalledWith(
          mednafenPath,
          ["wrong"],
          expect.anything(),
        );
        expect(execFile).toHaveBeenCalledWith(
          mednafenPath,
          expect.arrayContaining([
            createAbsoluteEntryPath(pcenginecd.name, entry.path),
          ]),
          {
            encoding: "utf8",
          },
          expect.anything(),
        );
      });
    });
  });
});
