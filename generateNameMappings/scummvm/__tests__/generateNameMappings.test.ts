import type { Result } from "../generateNameMappings.js";
import { extractGames } from "../generateNameMappings.js";

describe("generateNameMappings", () => {
  describe("scummvm", () => {
    describe("extractGames", () => {
      it("Should return the game names in an object", () => {
        const scummvmResult =
          "Game ID                        Full Title                                                 \n" +
          "------------------------------ -----------------------------------------------------------\n" +
          "scumm:atlantis                 Indiana Jones and the Fate of Atlantis\n" +
          "scumm:maniac                   Maniac Mansion\n" +
          "scumm:monkey                   The Secret of Monkey Island\n" +
          "scumm:monkey2                  Monkey Island 2: LeChuck's Revenge\n" +
          "scumm:ft                       Full Throttle\n" +
          "scumm:comi                     The Curse of Monkey Island\n";
        const expected: Result = {
          "scumm:atlantis": "Indiana Jones and the Fate of Atlantis",
          "scumm:maniac": "Maniac Mansion",
          "scumm:monkey": "The Secret of Monkey Island",
          "scumm:monkey2": "Monkey Island 2: LeChuck's Revenge",
          "scumm:ft": "Full Throttle",
          "scumm:comi": "The Curse of Monkey Island",
        };

        expect(extractGames(scummvmResult)).toStrictEqual(expected);
      });
    });
  });
});
