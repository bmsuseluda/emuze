import { readFileHome } from "../readWriteData.server";
import type { Mock } from "vitest";
import type { EntryWithSystem } from "../../types/jsonFiles/lastPlayed";
import { addToLastPlayed, paths } from "../lastPlayed.server";
import { finalfantasy7, hugo, monkeyIsland } from "../__testData__/category";
import { scumm, sonyplaystation } from "../categoriesDB.server";

vi.mock("@kmamal/sdl");

const writeFileMock = vi.fn();
vi.mock("../readWriteData.server", () => ({
  readFileHome: vi.fn(),
  readDirectorynames: vi.fn(),
  readFilenames: vi.fn(),
  writeFileHome: (object: unknown, path: string) => writeFileMock(object, path),
}));

// TODO: check how to mock the FileDataCache
describe("lastPlayed.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("addToLastPlayed", () => {
    const hugo202461: EntryWithSystem = {
      ...hugo,
      systemId: sonyplaystation.id,
      lastPlayed: new Date(2024, 6, 1).getTime(),
    };
    const monkeyIsland2024528: EntryWithSystem = {
      ...monkeyIsland,
      systemId: scumm.id,
      lastPlayed: new Date(2024, 5, 28).getTime(),
    };

    it("Should add a game if lastPlayed list is empty", () => {
      const oldLastPlayed: EntryWithSystem[] = [];
      const now = new Date();
      vi.setSystemTime(now);

      (readFileHome as Mock<any, EntryWithSystem[]>).mockReturnValueOnce(
        oldLastPlayed,
      );

      addToLastPlayed(finalfantasy7, sonyplaystation.id);

      const expected: EntryWithSystem[] = [
        {
          ...finalfantasy7,
          systemId: sonyplaystation.id,
          lastPlayed: now.getTime(),
        },
      ];

      expect(writeFileMock).toHaveBeenCalledWith(expected, paths.lastPlayed);
    });

    it("Should add a game that is not in the list", () => {
      const oldLastPlayed: EntryWithSystem[] = [
        hugo202461,
        monkeyIsland2024528,
      ];
      const now = new Date();
      vi.setSystemTime(now);

      (readFileHome as Mock<any, EntryWithSystem[]>).mockReturnValueOnce(
        oldLastPlayed,
      );

      addToLastPlayed(finalfantasy7, sonyplaystation.id);

      const expected: EntryWithSystem[] = [
        {
          ...finalfantasy7,
          systemId: sonyplaystation.id,
          lastPlayed: now.getTime(),
        },
        ...oldLastPlayed,
      ];

      expect(writeFileMock).toHaveBeenCalledWith(expected, paths.lastPlayed);
    });

    it("Should update a game that is in the list and set at first position", () => {
      const oldLastPlayed: EntryWithSystem[] = [
        hugo202461,
        {
          ...finalfantasy7,
          systemId: sonyplaystation.id,
          lastPlayed: new Date(2024, 5, 29).getTime(),
        },
        monkeyIsland2024528,
      ];
      const now = new Date();
      vi.setSystemTime(now);

      (readFileHome as Mock<any, EntryWithSystem[]>).mockReturnValueOnce(
        oldLastPlayed,
      );

      addToLastPlayed(finalfantasy7, sonyplaystation.id);

      const expected: EntryWithSystem[] = [
        {
          ...finalfantasy7,
          systemId: sonyplaystation.id,
          lastPlayed: now.getTime(),
        },
        hugo202461,
        monkeyIsland2024528,
      ];

      expect(writeFileMock).toHaveBeenCalledWith(expected, paths.lastPlayed);
    });
  });
});
