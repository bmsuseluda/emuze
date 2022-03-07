import { convertToId } from "../convertToId.server";

describe("convertToId.server.ts", () => {
  it("Should trim white spaces and convert to lower case", () => {
    expect(convertToId("Blastem win32-0.6.2")).toBe("blastemwin32-0.6.2");
  });
});
