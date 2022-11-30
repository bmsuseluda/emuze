import nodepath from "path";

import { readCategory } from "~/server/categories.server";
import { readGeneral } from "~/server/settings.server";
import type { Category } from "~/types/category";

import { executeApplication } from "../execute.server";
import {
  blazingstar,
  gateofthunder,
  neogeo,
  neogeoLinux,
  pcenginecd,
  pcenginecdLinux,
} from "../__testData__/category";
import type { General } from "~/types/settings/general";

const execFileMock = jest.fn();
jest.mock("child_process", () => ({
  execFileSync: (applicationPath: string, entryPath: string) =>
    execFileMock(applicationPath, entryPath),
}));

jest.mock("~/server/categories.server", () => ({
  readCategory: jest.fn(),
}));
jest.mock("~/server/settings.server", () => ({
  readGeneral: jest.fn(),
}));

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
      });

      it("Should execute the entry with the defined application of the category", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);

        executeApplication(pcenginecd.id, gateofthunder.id);

        expect(execFileMock).toHaveBeenCalledWith(pcenginecd.applicationPath, [
          gateofthunder.path,
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

        executeApplication(neogeo.id, blazingstar.id);

        expect(execFileMock).toHaveBeenCalledWith(neogeo.applicationPath, [
          "-w",
          "-rompath",
          entryDirname,
          "-cfg_directory",
          nodepath.join(entryDirname, "cfg"),
          "-nvram_directory",
          nodepath.join(entryDirname, "nvram"),
          blazingstar.path,
        ]);
      });

      it("Should add environment varables", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(pcenginecd);

        executeApplication(pcenginecd.id, gateofthunder.id);

        expect(execFileMock).toHaveBeenCalledWith(pcenginecd.applicationPath, [
          gateofthunder.path,
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
      });

      it("Should execute the entry with the defined application of the category", () => {
        (readCategory as jest.Mock<Category>).mockReturnValueOnce(
          pcenginecdLinux
        );

        executeApplication(pcenginecdLinux.id, gateofthunder.id);

        expect(execFileMock).toHaveBeenCalledWith("flatpak", [
          "run",
          pcenginecdLinux.applicationFlatpakId,
          gateofthunder.path,
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

        executeApplication(neogeo.id, blazingstar.id);

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
          blazingstar.path,
        ]);
      });
    });
  });
});
