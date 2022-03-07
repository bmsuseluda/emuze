export type TestIdAttribute = string | number | undefined;
type TestIdAttributes = TestIdAttribute | TestIdAttribute[];

export interface Testable {
  "data-testid"?: string;
}

const SEPARATOR = ".";

const isDefined = (value: TestIdAttributes) => typeof value !== "undefined";

const createTestIdString = (value: TestIdAttributes) => {
  if (!isDefined(value)) {
    return "";
  }

  if (value instanceof Array) {
    return value.filter(isDefined).join(SEPARATOR);
  }

  return value;
};

const getSeparator = (initial: TestIdAttributes, suffix: TestIdAttributes) =>
  initial && suffix ? SEPARATOR : "";

export const useTestId = (initial: TestIdAttributes) => {
  const getTestId = (suffix?: TestIdAttributes) => ({
    "data-testid":
      createTestIdString(initial) +
      getSeparator(initial, suffix) +
      createTestIdString(suffix),
  });

  return {
    getTestId,
  };
};
