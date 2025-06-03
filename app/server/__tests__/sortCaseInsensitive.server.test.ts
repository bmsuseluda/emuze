import { sortCaseInsensitive } from "../sortCaseInsensitive.server.js";

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

  it("Should sort roman numbers", () => {
    const data = [
      "Final Fantasy III",
      "Final Fantasy I",
      "Final Fantasy VI",
      "Final Fantasy V",
      "Final Fantasy IV",
      "Final Fantasy IX",
      "Final Fantasy XI",
      "Final Fantasy XV",
      "Final Fantasy X",
    ];
    data.sort(sortCaseInsensitive);
    expect(data).toStrictEqual([
      "Final Fantasy I",
      "Final Fantasy III",
      "Final Fantasy IV",
      "Final Fantasy V",
      "Final Fantasy VI",
      "Final Fantasy IX",
      "Final Fantasy X",
      "Final Fantasy XI",
      "Final Fantasy XV",
    ]);
  });
});
