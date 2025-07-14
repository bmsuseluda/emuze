import {
  findExecutable,
  getInstalledApplicationForCategoryOnWindows,
} from "../applications.server.js";
import { applicationsPath, pcsx2 } from "../__testData__/applications.js";
import * as categoriesFromDB from "../categoriesDB.server/index.js";
import { readFilenames } from "../readWriteData.server.js";

vi.mock("@bmsuseluda/sdl");
vi.mock("../readWriteData.server");
vi.mock("../applicationsDB.server/checkEmulatorIsInstalled");
vi.mock("../categories.server");

describe("applications.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("findExecutable", () => {
    it("Should return the configured executable from path", () => {
      // evaluate
      vi.mocked(readFilenames).mockReturnValueOnce([
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
      vi.mocked(readFilenames).mockReturnValueOnce([
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
      vi.mocked(readFilenames).mockReturnValueOnce([
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
      vi.mocked(readFilenames).mockReturnValueOnce([
        "F:/games/Emulation/emulators/Ares win64-139/view.exe",
      ]);

      // execute
      const executable = findExecutable("", "ares");

      // expect
      expect(executable).toBeNull();
    });

    it("Should return null because there is no executable in the main folder", () => {
      // evaluate
      vi.mocked(readFilenames).mockReturnValueOnce([]);

      // execute
      const executable = findExecutable("", "pcsx2");

      // expect
      expect(executable).toBeNull();
    });
  });

  describe("getInstalledApplicationForCategoryOnWindows", () => {
    it("Should return application if installed", () => {
      const application = categoriesFromDB.sonyplaystation2.application;
      vi.mocked(readFilenames).mockReturnValueOnce([pcsx2.path]);

      const result = getInstalledApplicationForCategoryOnWindows(
        application,
        applicationsPath,
      );

      expect(result).toStrictEqual({ ...application, path: pcsx2.path });
    });

    it("Should return undefined if application is not installed", () => {
      const application = categoriesFromDB.sonyplaystation3.application;
      vi.mocked(readFilenames).mockReturnValueOnce([]);

      const result = getInstalledApplicationForCategoryOnWindows(
        application,
        applicationsPath,
      );

      expect(result).toBeUndefined();
    });
  });
});
