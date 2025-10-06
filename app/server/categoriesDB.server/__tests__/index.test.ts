import { getCategoryDataByName, pcengine, sonyplaystation3 } from "../index.js";
import type { Category } from "../types.js";

describe("categoriesDB", () => {
  describe("getCategoryDataByName", () => {
    const tests: { name: string; system: Category }[] = [
      { name: "NEC TurboGrafx 16", system: pcengine },
      { name: "ps3", system: sonyplaystation3 },
    ];

    tests.forEach(({ name, system }) => {
      it(`should return ${system.names.at(0)} for "${name}"`, () => {
        const result = getCategoryDataByName(name);
        expect(result).toBe(system);
      });
    });
  });
});
