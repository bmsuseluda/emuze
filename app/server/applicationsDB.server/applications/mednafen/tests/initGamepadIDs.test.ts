import { eightBitDoPro2, steamDeck } from "../../../../../types/gamepad.js";
import type { MappedGamepad, MednafenGamepadID } from "../initGamepadIDs.js";
import { extractGamepadIDs, getMappedGamepad } from "../initGamepadIDs.js";

vi.mock("@kmamal/sdl");
vi.mock("node-hid");

describe("initGamepadIDs", () => {
  describe("extractGamepadIDs", () => {
    it("Should extract gamepad IDs", () => {
      const logOutput = `Initializing joysticks...
  ID: 0x0005054c026880000006001100000000 - PLAYSTATION(R)3 Controller
  ID: 0x0005045e02e009030008000a00000000 - 8BitDo Pro 2
  ID: 0x0005045e02e009030008000a00000001 - 8BitDo Pro 2 2`;

      const expected: MednafenGamepadID[] = [
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

  describe("getMappedGamepad", () => {
    it("Should return the appropriate sdl device", () => {
      const mednafenGamepadId: MednafenGamepadID = {
        id: "0x0005045e02e009030008000a00000000",
        name: "8BitDo Pro 2",
        nameIndex: 0,
      };
      const result = getMappedGamepad(mednafenGamepadId);

      const expected: MappedGamepad = {
        sdlController: eightBitDoPro2,
        mednafenGamepadId,
      };

      expect(result).toStrictEqual(expected);
    });

    it("Should return the steam deck controller through alternative name", () => {
      const mednafenGamepadId: MednafenGamepadID = {
        id: "0x000328de11ff00010008000b00000000",
        name: "Microsoft X-Box 360 pad 0",
        nameIndex: 0,
      };
      const result = getMappedGamepad(mednafenGamepadId);

      const expected: MappedGamepad = {
        sdlController: steamDeck,
        mednafenGamepadId,
      };

      expect(result).toStrictEqual(expected);
    });

    it("Should return the appropriate sdl device if there are multiple one of the same type", () => {
      const mednafenGamepadId: MednafenGamepadID = {
        id: "0x0005045e02e009030008000a00000001",
        name: "8BitDo Pro 2 2",
        nameIndex: 1,
      };
      const result = getMappedGamepad(mednafenGamepadId);

      const expected: MappedGamepad = {
        sdlController: { ...eightBitDoPro2, id: 3 },
        mednafenGamepadId,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
