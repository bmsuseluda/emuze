import type { Application } from "~/types/jsonFiles/applications";
import {
  checkHasMissingApplications,
  findExecutable,
  getInstalledApplicationForCategory,
  getInstalledApplicationsOnLinux,
  getInstalledApplicationsOnWindows,
} from "../applications.server";
import {
  applications as applicationsTestData,
  blastem,
  getDirectoryname,
  pcsx2,
  play,
} from "../__testData__/applications";
import * as applicationsFromDB from "../applicationsDB.server";
import {
  readDirectorynames,
  readFilenames,
} from "~/server/readWriteData.server";
import { checkFlatpakIsInstalled } from "~/server/execute.server";
import { general } from "../__testData__/general";
import { when } from "jest-when";
import { sonyplaystation2 } from "~/server/categoriesDB.server";
import type { Category as CategorySlim } from "~/types/jsonFiles/categories";
import { readCategories } from "~/server/categories.server";
import { neogeo, playstation } from "~/server/__testData__/category";

jest.mock("~/server/readWriteData.server", () => ({
  readDirectorynames: jest.fn(),
  readFilenames: jest.fn(),
}));

jest.mock("~/server/execute.server", () => ({
  checkFlatpakIsInstalled: jest.fn(),
}));

jest.mock("~/server/categories.server", () => ({
  readCategories: jest.fn(),
}));

describe("applications.server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getInstalledApplications", () => {
    describe("getInstalledApplicationsOnLinux", () => {
      it("Should return known applications only", () => {
        // evaluate
        when(checkFlatpakIsInstalled as jest.Mock<boolean>)
          .calledWith(applicationsFromDB.play.flatpakId)
          .mockReturnValueOnce(false);
        when(checkFlatpakIsInstalled as jest.Mock<boolean>)
          .calledWith(applicationsFromDB.pcsx2.flatpakId)
          .mockReturnValueOnce(true);

        // execute
        const result = getInstalledApplicationsOnLinux(
          sonyplaystation2.applications
        );

        // expect
        const expected = [applicationsFromDB.pcsx2].map(({ id }) => ({
          id,
        }));
        expect(result).toStrictEqual(expected);
      });
    });

    describe("getInstalledApplicationsOnWindows", () => {
      it("Should return known applications only", () => {
        // evaluate
        (readDirectorynames as jest.Mock<string[]>).mockReturnValueOnce([
          getDirectoryname(pcsx2.path),
          getDirectoryname(blastem.path),
          getDirectoryname(play.path),
          "unknown application",
        ]);
        (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
          pcsx2.path,
        ]);
        (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([play.path]);

        // execute
        const result = getInstalledApplicationsOnWindows(
          sonyplaystation2.applications,
          general.applicationsPath
        );

        // expect
        const expected: Application[] = [pcsx2, play];
        expect(result).toStrictEqual(expected);
      });

      it("Should return an empty list because there is no executable", () => {
        // evaluate
        (readDirectorynames as jest.Mock<string[]>).mockReturnValueOnce([
          getDirectoryname(pcsx2.path),
        ]);
        (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([]);

        // execute
        const result = getInstalledApplicationsOnWindows(
          sonyplaystation2.applications,
          general.applicationsPath
        );

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

  describe("getApplicationForCategory", () => {
    const defaultApplication = applicationsFromDB.pcsx2;
    it("Should return old application if old application is installed", () => {
      const oldApplication = applicationsTestData.play;
      const result = getInstalledApplicationForCategory(
        [defaultApplication, oldApplication],
        defaultApplication,
        oldApplication
      );

      expect(result).toBe(oldApplication);
    });

    it("Should return default application if old application is not set and default application is installed", () => {
      const result = getInstalledApplicationForCategory(
        [defaultApplication, applicationsTestData.play],
        defaultApplication
      );

      expect(result).toBe(defaultApplication);
    });

    it("Should return first installed application that is compatible with the category", () => {
      const result = getInstalledApplicationForCategory(
        [applicationsTestData.play, applicationsTestData.duckstation],
        defaultApplication
      );

      expect(result).toBe(applicationsTestData.play);
    });

    it("Should return default application if no compatible application is installed", () => {
      const result = getInstalledApplicationForCategory([], defaultApplication);

      expect(result).toStrictEqual({ id: defaultApplication.id });
    });
  });

  describe("checkHasMissingApplications", () => {
    it("Should return false if there are no categories", () => {
      (readCategories as jest.Mock<CategorySlim[]>).mockReturnValue([]);
      (checkFlatpakIsInstalled as jest.Mock<boolean>).mockReturnValue(true);

      expect(checkHasMissingApplications()).toBeFalsy();
    });

    it("Should return false if there is no missing application", () => {
      (readCategories as jest.Mock<CategorySlim[]>).mockReturnValue([
        playstation,
        neogeo,
      ]);
      (checkFlatpakIsInstalled as jest.Mock<boolean>).mockReturnValue(true);

      expect(checkHasMissingApplications()).toBeFalsy();
    });

    it("Should return true if there is a missing application", () => {
      (readCategories as jest.Mock<CategorySlim[]>).mockReturnValue([
        playstation,
        neogeo,
      ]);
      (checkFlatpakIsInstalled as jest.Mock<boolean>).mockReturnValueOnce(true);
      (checkFlatpakIsInstalled as jest.Mock<boolean>).mockReturnValueOnce(
        false
      );

      expect(checkHasMissingApplications()).toBeTruthy();
    });
  });
});
