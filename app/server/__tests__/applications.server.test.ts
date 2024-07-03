import {
  findExecutable,
  getInstalledApplicationForCategoryOnLinux,
  getInstalledApplicationForCategoryOnWindows,
} from "../applications.server";
import { applicationsPath, pcsx2 } from "../__testData__/applications";
import * as categoriesFromDB from "../categoriesDB.server";
import { readFilenames } from "../readWriteData.server";
import type { Mock } from "vitest";
import { checkFlatpakIsInstalled } from "../applicationsDB.server/checkFlatpakInstalled";

vi.mock("@kmamal/sdl");

vi.mock("../readWriteData.server", () => ({
  readDirectorynames: vi.fn(),
  readFilenames: vi.fn(),
}));

vi.mock("../applicationsDB.server/checkFlatpakInstalled", () => ({
  checkFlatpakIsInstalled: vi.fn(),
}));

vi.mock("../categories.server", () => ({
  readCategories: vi.fn(),
}));

describe("applications.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("findExecutable", () => {
    it("Should return the configured executable from path", () => {
      // evaluate
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/dosbox-staging-v0.81.0/test.config",
        "F:/games/Emulation/emulators/dosbox-staging-v0.81.0/no.ini",
        "F:/games/Emulation/emulators/dosbox-staging-v0.81.0/dosbox.exe",
      ]);

      // execute
      const executable = findExecutable("", "dosboxstaging");

      // expect
      expect(executable).toBe(
        "F:/games/Emulation/emulators/dosbox-staging-v0.81.0/dosbox.exe",
      );
    });

    it("Should return the executable from path", () => {
      // evaluate
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Ares win64-139/test.config",
        "F:/games/Emulation/emulators/Ares win64-139/no.ini",
        "F:/games/Emulation/emulators/Ares win64-139/view.exe",
        "F:/games/Emulation/emulators/Ares win64-139/NewAres139.exe",
      ]);

      // execute
      const executable = findExecutable("", "ares");

      // expect
      expect(executable).toBe(
        "F:/games/Emulation/emulators/Ares win64-139/NewAres139.exe",
      );
    });

    it("Should return the executable from subpath", () => {
      // evaluate
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Ares win64-139/view.exe",
        "F:/games/Emulation/emulators/Ares win64-139/system/NewAres139.exe",
      ]);

      // execute
      const executable = findExecutable("", "ares");

      // expect
      expect(executable).toBe(
        "F:/games/Emulation/emulators/Ares win64-139/system/NewAres139.exe",
      );
    });

    it("Should return null because there is no executable in the main and subfolder", () => {
      // evaluate
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Ares win64-139/view.exe",
      ]);

      // execute
      const executable = findExecutable("", "ares");

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
    const application = categoriesFromDB.sonyplaystation2.application;

    it("Should return application if installed", () => {
      (checkFlatpakIsInstalled as Mock<any, boolean>).mockReturnValueOnce(true);

      const result = getInstalledApplicationForCategoryOnLinux(application);

      expect(result).toBe(application);
    });

    it("Should return undefined if application is not installed", () => {
      const result = getInstalledApplicationForCategoryOnLinux(application);

      expect(result).toBeUndefined();
    });
  });

  describe("getInstalledApplicationForCategoryOnWindows", () => {
    const application = categoriesFromDB.sonyplaystation2.application;

    it("Should return application if installed", () => {
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([pcsx2.path]);

      const result = getInstalledApplicationForCategoryOnWindows(
        application,
        applicationsPath,
      );

      expect(result).toStrictEqual({ ...application, path: pcsx2.path });
    });

    it("Should return undefined if application is not installed", () => {
      (readFilenames as Mock<any, string[]>).mockReturnValueOnce([]);

      const result = getInstalledApplicationForCategoryOnWindows(
        application,
        applicationsPath,
      );

      expect(result).toBeUndefined();
    });
  });
});
