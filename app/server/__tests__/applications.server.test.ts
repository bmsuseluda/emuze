import { Applications } from "~/types/applications";
import {
  importApplications,
  paths,
  findExecutable,
} from "../applications.server";
import {
  blastem,
  getDirectoryname,
  pcsx2,
  pcsx2Old,
} from "../__testData__/applications";
import {
  readDirectorynames,
  readFilenames,
} from "~/server/readWriteData.server";

const writeFileMock = jest.fn();
jest.mock("~/server/readWriteData.server", () => ({
  readDirectorynames: jest.fn(),
  readFilenames: jest.fn(),
  writeFile: (object: unknown, path: string) => writeFileMock(object, path),
}));

describe("applications.server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("importApplications", () => {
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
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([pcsx2.path]);

      // execute
      importApplications();

      // expect
      const expected: Applications = [blastem, pcsx2Old, pcsx2];
      expect(writeFileMock).toHaveBeenCalledWith(expected, paths.applications);
    });

    it("Should return an empty list because there is no executable", () => {
      // evaluate
      (readDirectorynames as jest.Mock<string[]>).mockReturnValueOnce([
        getDirectoryname(pcsx2.path),
      ]);
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([]);

      // execute
      importApplications();

      // expect
      expect(writeFileMock).toHaveBeenCalledWith([], paths.applications);
    });
  });

  describe("findExecutable", () => {
    it("Should return the executable from path", () => {
      // evaluate
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\test.config",
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\no.ini",
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\view.exe",
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\NewBlastemV2.exe",
      ]);

      // execute
      const executable = findExecutable("", "blastem");

      // expect
      expect(executable).toBe(
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\NewBlastemV2.exe"
      );
    });

    it("Should return the executable from subpath", () => {
      // evaluate
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\view.exe",
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\system\\NewBlastemV2.exe",
      ]);

      // execute
      const executable = findExecutable("", "blastem");

      // expect
      expect(executable).toBe(
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\system\\NewBlastemV2.exe"
      );
    });

    it("Should return null because there is no executable in the main and subfolder", () => {
      // evaluate
      (readFilenames as jest.Mock<string[]>).mockReturnValueOnce([
        "F:\\games\\Emulation\\emulators\\Blastem win32-0.6.2\\view.exe",
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
