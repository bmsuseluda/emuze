import { sortGamepads, steamDeck } from "./index";
import type { Sdl } from "@kmamal/sdl";

vi.mock("@kmamal/sdl", () => ({
  default: () => ({
    controller: {
      devices: [],
    },
  }),
}));

describe("ares", () => {
  describe("sortGamepads", () => {
    it("should sort the steam deck last", () => {
      const gamepadPs4: Sdl.Controller.Device = {
        id: 1,
        name: "Playstation 4 Controller",
        path: "/dev/input/event6",
        guid: "030079f6de280000ff11000001000000",
        vendor: 10462,
        product: 4607,
        version: 1,
        player: 1,
        mapping:
          "030000004c050000c405000000010000,PS4 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,",
      };

      const gamepadPs3: Sdl.Controller.Device = {
        id: 2,
        name: "Playstation 3 Controller",
        path: "/dev/input/event6",
        guid: "030079f6de280000ff11000001000000",
        vendor: 10462,
        product: 4607,
        version: 1,
        player: 2,
        mapping:
          "030000004c050000c408000000010000,PS3 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,",
      };

      const gamepads: Sdl.Controller.Device[] = [
        steamDeck,
        gamepadPs4,
        gamepadPs3,
      ];

      const sortedGamepads = [gamepadPs4, gamepadPs3, steamDeck];

      expect(gamepads.sort(sortGamepads)).toStrictEqual(sortedGamepads);
    });
  });
});
