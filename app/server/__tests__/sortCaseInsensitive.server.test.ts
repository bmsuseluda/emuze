import { sortCaseInsensitive } from "../sortCaseInsensitive.server";

describe("sortCaseInsensitive", () => {
  it("Should return shorter string first if it is the same as next", () => {
    const data = ["Hugo 2", "Hugo"];
    data.sort(sortCaseInsensitive);
    expect(data).toStrictEqual(["Hugo", "Hugo 2"]);
  });

  it("Should sort case insensitive", () => {
    const data = ["Hugo 2", "hugo"];
    data.sort(sortCaseInsensitive);
    expect(data).toStrictEqual(["hugo", "Hugo 2"]);
  });
});
