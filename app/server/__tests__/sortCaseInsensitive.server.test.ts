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

  it("Should ignore special characters", () => {
    const data = ["Pandemonium 2", "Pandemonium!"];
    data.sort(sortCaseInsensitive);
    expect(data).toStrictEqual(["Pandemonium!", "Pandemonium 2"]);
  });

  it("Should ignore additional infos (in brackets)", () => {
    const data = ["Donkey Kong Country (USA)", "Donkey Kong Country 2"];
    data.sort(sortCaseInsensitive);
    expect(data).toStrictEqual([
      "Donkey Kong Country (USA)",
      "Donkey Kong Country 2",
    ]);
  });
});
