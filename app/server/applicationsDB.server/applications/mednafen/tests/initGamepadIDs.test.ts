import { devices } from "../../../../../../__mocks__/@kmamal/sdl.js";
import {
  eightBitDoPro2,
  gamepadPs4,
  steamDeck,
} from "../../../../../types/gamepad.js";
import * as mednafenGamepadTestData from "./testData.js";
import type {
  MappedGamepad,
  MappedGamepadWithPlayerIndex,
  MednafenGamepadID,
} from "../initGamepadIDs.js";
import {
  extractGamepadIDs,
  getMappedGamepad,
  getMappedGamepads,
} from "../initGamepadIDs.js";

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
      const result = getMappedGamepad(mednafenGamepadId, [...devices]);

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
      const result = getMappedGamepad(mednafenGamepadId, [...devices]);

      const expected: MappedGamepad = {
        sdlController: steamDeck,
        mednafenGamepadId,
      };

      expect(result).toStrictEqual(expected);
    });
  });

  describe("getMappedGamepads", () => {
    it("Should map the gamepads", () => {
      const mednafenGamepadIds: MednafenGamepadID[] = [
        mednafenGamepadTestData.steamDeck,
        mednafenGamepadTestData.eightBitDoPro2,
        mednafenGamepadTestData.eightBitDoPro2SecondDevice,
      ];
      const result = getMappedGamepads(mednafenGamepadIds);

      const expected: MappedGamepadWithPlayerIndex[] = [
        {
          sdlController: steamDeck,
          mednafenGamepadId: mednafenGamepadTestData.steamDeck,
          playerIndex: 2,
        },
        {
          sdlController: eightBitDoPro2,
          mednafenGamepadId: mednafenGamepadTestData.eightBitDoPro2,
          playerIndex: 0,
        },
        {
          sdlController: { ...eightBitDoPro2, id: 3, player: 3 },
          mednafenGamepadId: mednafenGamepadTestData.eightBitDoPro2SecondDevice,
          playerIndex: 1,
        },
      ];

      expect(result).toStrictEqual(expected);
    });

    it("Should map the gamepads with steam input", () => {
      const mednafenGamepadIds: MednafenGamepadID[] = [
        mednafenGamepadTestData.steamDeck,
        mednafenGamepadTestData.gamepadPs4,
        mednafenGamepadTestData.eightBitDoPro2,
        mednafenGamepadTestData.steamDeckSteamInputCopy,
        mednafenGamepadTestData.eightBitDoPro2SecondDevice,
      ];
      const result = getMappedGamepads(mednafenGamepadIds);

      const expected: MappedGamepadWithPlayerIndex[] = [
        {
          sdlController: steamDeck,
          mednafenGamepadId: mednafenGamepadTestData.steamDeck,
          playerIndex: 3,
        },
        {
          sdlController: eightBitDoPro2,
          mednafenGamepadId: mednafenGamepadTestData.steamDeckSteamInputCopy,
          playerIndex: 0,
        },
        {
          sdlController: gamepadPs4,
          mednafenGamepadId: mednafenGamepadTestData.gamepadPs4,
          playerIndex: 1,
        },
        {
          sdlController: { ...eightBitDoPro2, id: 3, player: 3 },
          mednafenGamepadId: mednafenGamepadTestData.eightBitDoPro2,
          playerIndex: 2,
        },
      ];

      expect(result).toStrictEqual(expected);
    });
  });
});
