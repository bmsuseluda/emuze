import { eightBitDoPro2 } from "../../../../../types/gamepad.js";
import type { GamepadID } from "../initGamepadIDs.js";
import { extractGamepadIDs, findSdlGamepad } from "../initGamepadIDs.js";

vi.mock("@kmamal/sdl");
vi.mock("node-hid");

describe("initGamepadIDs", () => {
  describe("extractGamepadIDs", () => {
    it("Should extract gamepad IDs", () => {
      const logOutput = `Initializing joysticks...
  ID: 0x0005054c026880000006001100000000 - PLAYSTATION(R)3 Controller
  ID: 0x0005045e02e009030008000a00000000 - 8BitDo Pro 2
  ID: 0x0005045e02e009030008000a00000001 - 8BitDo Pro 2 2`;

      const expected: GamepadID[] = [
        {
          id: "0x0005054c026880000006001100000000",
          name: "PLAYSTATION(R)3 Controller",
          nameIndex: 0,
        },
        {
          id: "0x0005045e02e009030008000a00000000",
          name: "8BitDo Pro 2",
          nameIndex: 0,
        },
        {
          id: "0x0005045e02e009030008000a00000001",
          name: "8BitDo Pro 2 2",
          nameIndex: 1,
        },
      ];

      expect(extractGamepadIDs(logOutput)).toStrictEqual(expected);
    });
  });

  describe("findSdlGamepad", () => {
    it("Should return the appropriate sdl device", () => {
      const result = findSdlGamepad(
        {
          id: "0x0005045e02e009030008000a00000000",
          name: "8BitDo Pro 2",
          nameIndex: 0,
        },
        0,
      );

      expect(result).toBe(eightBitDoPro2);
    });

    it("Should return the appropriate sdl device if there are multiple one of the same type", () => {
      const result = findSdlGamepad(
        {
          id: "0x0005045e02e009030008000a00000000",
          name: "8BitDo Pro 2 2",
          nameIndex: 1,
        },
        0,
      );

      expect(result).toStrictEqual({ ...eightBitDoPro2, id: 3 });
    });
  });
});
