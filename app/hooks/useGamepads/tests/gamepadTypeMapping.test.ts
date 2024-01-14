import type { GamepadType } from "~/hooks/useGamepads/gamepadTypeMapping";
import { identifyGamepadType } from "~/hooks/useGamepads/gamepadTypeMapping";

describe("gamepadTypeMapping", () => {
  type Props = {
    gamepadId: string;
    gamepadType: GamepadType;
  };

  const tests: Props[] = [
    {
      gamepadId: "54c-268-PLAYSTATION(R)3 Controller",
      gamepadType: "PlayStation",
    },
    {
      gamepadId: "DS4 Wired Controller (Vendor: 7545 Product: 0104)",
      gamepadType: "PlayStation",
    },
    {
      gamepadId: "PS3/PC Wired GamePad (Vendor: 2563 Product: 0523)",
      gamepadType: "PlayStation",
    },
    {
      gamepadId: "54c-268-PLAYSTATION(R)3 Controller",
      gamepadType: "PlayStation",
    },
    {
      gamepadId: "Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)",
      gamepadType: "Nintendo",
    },
    {
      gamepadId: "Unknown Gamepad (Vendor: beef Product: 046d)",
      gamepadType: "XBox",
    },
    {
      gamepadId: "Xbox Wireless Controller Extended Gamepad",
      gamepadType: "XBox",
    },
  ];

  tests.forEach(({ gamepadId, gamepadType }) => {
    it(`Should return ${gamepadType} for the id ${gamepadId}`, () => {
      expect(identifyGamepadType(gamepadId)).toEqual(gamepadType);
    });
  });
});
