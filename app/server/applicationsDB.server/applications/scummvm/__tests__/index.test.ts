import { parseScummDetectResult } from "..";

vi.mock("@bmsuseluda/node-sdl");

describe("applicationsDB.scummvm", () => {
  describe("parseScummDetectResult", () => {
    it("Should return the name of the game", () => {
      const result =
        "GameID                         Description                                                Full Path\n" +
        "------------------------------ ---------------------------------------------------------- ---------------------------------------------------------\n" +
        "bladerunner:bladerunner        Blade Runner (Windows/English)                             blade-runner\n" +
        "bladerunner:bladerunner-final  Blade Runner with restored content (Windows/English)       blade-runner\n";

      expect(parseScummDetectResult(result)).toBe("Blade Runner");
    });
  });
});
