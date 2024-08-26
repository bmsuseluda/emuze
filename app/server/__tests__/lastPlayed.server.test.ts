import type { EntryWithSystem } from "../../types/jsonFiles/lastPlayed";
import { addToLastPlayed } from "../lastPlayed.server";
import { finalfantasy7, hugo, monkeyIsland } from "../__testData__/category";
import { scumm, sonyplaystation } from "../categoriesDB.server";

vi.mock("@kmamal/sdl");

describe("lastPlayed.server", () => {
  beforeEach(() => {
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

      const result = addToLastPlayed(
        oldLastPlayed,
        finalfantasy7,
        sonyplaystation.id,
      );

      const expected: EntryWithSystem[] = [
        {
          ...finalfantasy7,
          systemId: sonyplaystation.id,
          lastPlayed: now.getTime(),
        },
      ];

      expect(result).toStrictEqual(expected);
    });

    it("Should add a game that is not in the list", () => {
      const oldLastPlayed: EntryWithSystem[] = [
        hugo202461,
        monkeyIsland2024528,
      ];
      const now = new Date();
      vi.setSystemTime(now);

      const result = addToLastPlayed(
        oldLastPlayed,
        finalfantasy7,
        sonyplaystation.id,
      );

      const expected: EntryWithSystem[] = [
        {
          ...finalfantasy7,
          systemId: sonyplaystation.id,
          lastPlayed: now.getTime(),
        },
        ...oldLastPlayed,
      ];

      expect(result).toStrictEqual(expected);
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

      const result = addToLastPlayed(
        oldLastPlayed,
        finalfantasy7,
        sonyplaystation.id,
      );

      const expected: EntryWithSystem[] = [
        {
          ...finalfantasy7,
          systemId: sonyplaystation.id,
          lastPlayed: now.getTime(),
        },
        hugo202461,
        monkeyIsland2024528,
      ];

      expect(result).toStrictEqual(expected);
    });
  });
});
