import { renderHook } from "@testing-library/react-hooks";

import { useTestId } from ".";

describe("useTestId", () => {
  const testData = [
    {
      initial: ["prevQa", "testHook"],
      suffix: "test1",
      expected: "prevQa.testHook.test1",
    },
    {
      initial: "testHook",
      suffix: "test1",
      expected: "testHook.test1",
    },
    {
      initial: [undefined, "testHook"],
      suffix: "test1",
      expected: "testHook.test1",
    },
    {
      initial: "testHook",
      suffix: ["item", 1, undefined],
      expected: "testHook.item.1",
    },
    {
      initial: "testHook",
      suffix: ["item", 0],
      expected: "testHook.item.0",
    },
    {
      initial: "testHook",
      suffix: undefined,
      expected: "testHook",
    },
  ];

  testData.forEach(({ initial, suffix, expected }) => {
    it(`should format ${JSON.stringify(initial)} with ${JSON.stringify(
      suffix
    )} to "${expected}"`, () => {
      const { result } = renderHook(() => useTestId(initial));

      expect(result.current.getTestId(suffix)["data-testid"]).toEqual(expected);
    });
  });
});
