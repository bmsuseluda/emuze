import { excludeMaskedGamepads } from "~/hooks/useGamepads";

describe("useGamepads", () => {
  describe("excludeMaskedGamepads", () => {
    it("Should exclude masked gamepads", () => {
      const valveGamepad: Gamepad = {
        id: "Microsoft X-Box 360 pad 0 (STANDARD GAMEPAD Vendor: 28de Product: 11ff)",
        index: 3,
        connected: true,
        timestamp: 8500.5,
        mapping: "standard",
        axes: [],
        buttons: [],
        hapticActuators: [],
        vibrationActuator: null,
      };

      const maskedGamepad: Gamepad = {
        id: "SNES Controller (Vendor: 057e Product: 2017)",
        index: 1,
        connected: true,
        timestamp: 8496.300000000745,
        mapping: "",
        axes: [],
        buttons: [],
        hapticActuators: [],
        vibrationActuator: null,
      };

      const notMaskedGamepad: Gamepad = {
        id: "8BitDo M30 gamepad (STANDARD GAMEPAD Vendor: 045e Product: 02e0)",
        index: 0,
        connected: true,
        timestamp: 6712.200000000186,
        mapping: "standard",
        axes: [],
        buttons: [],
        hapticActuators: [],
        vibrationActuator: null,
      };

      const gamepads: (Gamepad | null)[] = [
        notMaskedGamepad,
        maskedGamepad,
        null,
        valveGamepad,
      ];

      expect(excludeMaskedGamepads(gamepads)).toEqual([
        notMaskedGamepad,
        valveGamepad,
      ]);
    });
  });
});
