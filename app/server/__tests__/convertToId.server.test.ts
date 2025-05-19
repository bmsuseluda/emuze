import { convertToId } from "../convertToId.server.js";

describe("convertToId.server.ts", () => {
  it("Should trim white spaces and convert to lower case", () => {
    expect(convertToId("Ares win64-139", 1)).toBe("areswin64-1391");
  });
});
