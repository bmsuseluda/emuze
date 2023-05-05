import type { Application } from "~/types/jsonFiles/applications";
import {
  findExecutable,
  importApplicationsOnLinux,
  importApplicationsOnWindows,
} from "../applications.server";
import {
  blastem,
  getDirectoryname,
  pcsx2,
  pcsx2Old,
} from "../__testData__/applications";
import * as applicationsFromDB from "../applicationsDB.server";
import {
  readDirectorynames,
  readFilenames,
} from "~/server/readWriteData.server";
import { checkFlatpakIsInstalled } from "~/server/execute.server";
import { general } from "../__testData__/general";
import { when } from "jest-when";

jest.mock("~/server/readWriteData.server", () => ({
  readDirectorynames: jest.fn(),
  readFilenames: jest.fn(),
}));

jest.mock("~/server/execute.server", () => ({
  checkFlatpakIsInstalled: jest.fn(),
}));

describe("applications.server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("importApplications", () => {
    describe("importApplicationsOnLinux", () => {
      it("Should return known applications only", () => {
        // evaluate
        when(checkFlatpakIsInstalled as jest.Mock<boolean>)
          .calledWith(applicationsFromDB.blastem.flatpakId)
          .mockReturnValueOnce(true);
        when(checkFlatpakIsInstalled as jest.Mock<boolean>)
          .calledWith(applicationsFromDB.pcsx2.flatpakId)
          .mockReturnValueOnce(true);
        when(checkFlatpakIsInstalled as jest.Mock<boolean>)
          .calledWith(applicationsFromDB.bsnes.flatpakId)
          .mockReturnValueOnce(false);

        // execute
        const result = importApplicationsOnLinux();

        // expect
        const expected = [
          applicationsFromDB.pcsx2,
          applicationsFromDB.blastem,
        ].map(({ id }) => ({
          id,
        }));
        expect(result).toStrictEqual(expected);
      });
    });

    describe("importApplicationsOnWindows", () => {
      it("Should return known applications only", () => {
        // evaluate
        (readDirectorynames as jest.Mock<string[]>).mockReturnValueOnce([
          getDirectoryname(pcsx2.path),
          getDirectoryname(pcsx2Old.path),
          getDirectoryname(blastem.path),
          "unknown application",
        ]);
        (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
          blastem.path,
        ]);
        (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
          pcsx2Old.path,
        ]);
        (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
          pcsx2.path,
        ]);

        // execute
        const result = importApplicationsOnWindows(general.applicationsPath!);

        // expect
        const expected: Application[] = [blastem, pcsx2Old, pcsx2];
        expect(result).toStrictEqual(expected);
      });

      it("Should return an empty list because there is no executable", () => {
        // evaluate
        (readDirectorynames as jest.Mock<string[]>).mockReturnValueOnce([
          getDirectoryname(pcsx2.path),
        ]);
        (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([]);

        // execute
        const result = importApplicationsOnWindows(general.applicationsPath!);

        // expect
        expect(result).toStrictEqual([]);
      });
    });
  });

  describe("findExecutable", () => {
    it("Should return the executable from path", () => {
      // evaluate
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/test.config",
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/no.ini",
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/view.exe",
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/NewBlastemV2.exe",
      ]);

      // execute
      const executable = findExecutable("", "blastem");

      // expect
      expect(executable).toBe(
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/NewBlastemV2.exe"
      );
    });

    it("Should return the executable from subpath", () => {
      // evaluate
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/view.exe",
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/system/NewBlastemV2.exe",
      ]);

      // execute
      const executable = findExecutable("", "blastem");

      // expect
      expect(executable).toBe(
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/system/NewBlastemV2.exe"
      );
    });

    it("Should return null because there is no executable in the main and subfolder", () => {
      // evaluate
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/view.exe",
      ]);

      // execute
      const executable = findExecutable("", "blastem");

      // expect
      expect(executable).toBeNull();
    });

    it("Should return null because there is no executable in the main folder", () => {
      // evaluate
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([]);

      // execute
      const executable = findExecutable("", "pcsx2");

      // expect
      expect(executable).toBeNull();
    });
  });
});
