import { calculateEntryIndexInRow, calculateRowIndex } from "./index.js";

describe("useRefsGrid", () => {
  interface Testcase {
    indexFromEntriesRef: number;
    gamesPerRow: number;
    expectedRowIndex: number;
    expectedEntryIndexPerRow: number;
  }

  const testCases: Testcase[] = [
    {
      indexFromEntriesRef: 0,
      gamesPerRow: 5,
      expectedRowIndex: 0,
      expectedEntryIndexPerRow: 0,
    },
    {
      indexFromEntriesRef: 4,
      gamesPerRow: 5,
      expectedRowIndex: 0,
      expectedEntryIndexPerRow: 4,
    },
    {
      indexFromEntriesRef: 5,
      gamesPerRow: 5,
      expectedRowIndex: 1,
      expectedEntryIndexPerRow: 0,
    },
    {
      indexFromEntriesRef: 30,
      gamesPerRow: 5,
      expectedRowIndex: 6,
      expectedEntryIndexPerRow: 0,
    },
  ];

  testCases.map(
    ({
      indexFromEntriesRef,
      gamesPerRow,
      expectedRowIndex,
      expectedEntryIndexPerRow,
    }) => {
      it(`calculateRowIndex with indexFromEntriesRef: ${indexFromEntriesRef} and gamesPerRow: ${gamesPerRow}`, () => {
        expect(calculateRowIndex(indexFromEntriesRef, gamesPerRow)).toBe(
          expectedRowIndex,
        );
      });

      it(`calculateEntryIndexInRow with indexFromEntriesRef: ${indexFromEntriesRef} and gamesPerRow: ${gamesPerRow}`, () => {
        expect(calculateEntryIndexInRow(indexFromEntriesRef, gamesPerRow)).toBe(
          expectedEntryIndexPerRow,
        );
      });
    },
  );
});
