import {
  findExecutable,
  getInstalledApplicationForCategoryOnLinux,
  getInstalledApplicationForCategoryOnWindows,
} from "../applications.server";
import {
  applications as applicationsTestData,
  applicationsPath,
  pcsx2,
} from "../__testData__/applications";
import * as applicationsFromDB from "../applicationsDB.server";
import { readFilenames } from "~/server/readWriteData.server";
import { checkFlatpakIsInstalled } from "~/server/execute.server";
import type { Mock } from "vitest";

vi.mock("~/server/readWriteData.server", () => ({
  readDirectorynames: vi.fn(),
  readFilenames: vi.fn(),
}));

vi.mock("~/server/execute.server", () => ({
  checkFlatpakIsInstalled: vi.fn(),
}));

vi.mock("~/server/categories.server", () => ({
  readCategories: vi.fn(),
}));

describe("applications.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("findExecutable", () => {
    it("Should return the executable from path", () => {
      // evaluate
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/test.config",
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/no.ini",
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/view.exe",
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/NewBlastemV2.exe",
      ]);

      // execute
      const executable = findExecutable("", "blastem");

      // expect
      expect(executable).toBe(
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/NewBlastemV2.exe",
      );
    });

    it("Should return the executable from subpath", () => {
      // evaluate
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/view.exe",
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/system/NewBlastemV2.exe",
      ]);

      // execute
      const executable = findExecutable("", "blastem");

      // expect
      expect(executable).toBe(
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/system/NewBlastemV2.exe",
      );
    });

    it("Should return null because there is no executable in the main and subfolder", () => {
      // evaluate
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Blastem win32-0.6.2/view.exe",
      ]);

      // execute
      const executable = findExecutable("", "blastem");

      // expect
      expect(executable).toBeNull();
    });

    it("Should return null because there is no executable in the main folder", () => {
      // evaluate
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([]);

      // execute
      const executable = findExecutable("", "pcsx2");

      // expect
      expect(executable).toBeNull();
    });
  });

  describe("getInstalledApplicationForCategoryOnLinux", () => {
    const defaultApplication = applicationsFromDB.pcsx2;
    it("Should return old application if old application is installed", () => {
      const oldApplication = applicationsTestData.play;
      (checkFlatpakIsInstalled as Mock<any, boolean>).mockReturnValueOnce(true);

      const result = getInstalledApplicationForCategoryOnLinux(
        defaultApplication,
        oldApplication,
      );

      expect(result).toBe(oldApplication);
    });

    it("Should return default application if old application is not set and default application is installed", () => {
      (checkFlatpakIsInstalled as Mock<any, boolean>).mockReturnValueOnce(true);

      const result =
        getInstalledApplicationForCategoryOnLinux(defaultApplication);

      expect(result).toBe(defaultApplication);
    });

    it("Should return undefined if no compatible application is installed", () => {
      const result =
        getInstalledApplicationForCategoryOnLinux(defaultApplication);

      expect(result).toBeUndefined();
    });
  });

  describe("getInstalledApplicationForCategoryOnWindows", () => {
    const defaultApplication = applicationsFromDB.pcsx2;
    it("Should return old application if old application is installed", () => {
      const oldApplication = applicationsTestData.play;
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        oldApplication.path,
      ]);

      const result = getInstalledApplicationForCategoryOnWindows(
        defaultApplication,
        applicationsPath,
        oldApplication,
      );

      expect(result).toBe(oldApplication);
    });

    it("Should return default application if old application is not set and default application is installed", () => {
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([pcsx2.path]);

      const result = getInstalledApplicationForCategoryOnWindows(
        defaultApplication,
        applicationsPath,
      );

      expect(result).toStrictEqual({ ...defaultApplication, path: pcsx2.path });
    });

    it("Should return undefined if no compatible application is installed", () => {
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([]);

      const result = getInstalledApplicationForCategoryOnWindows(
        defaultApplication,
        applicationsPath,
      );

      expect(result).toBeUndefined();
    });
  });
});
