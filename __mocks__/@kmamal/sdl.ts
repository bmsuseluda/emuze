import type { Sdl } from "@kmamal/sdl";
import { scancodes } from "../../app/server/applicationsDB.server/applications/ares/keyboardConfig.js";
import {
  gamepadPs4,
  steamDeck,
  eightBitDoPro2,
} from "../../app/types/gamepad.js";

export const devices: Sdl.Controller.Device[] = [
  steamDeck,
  gamepadPs4,
  eightBitDoPro2,
  { ...eightBitDoPro2, id: 3, player: 3 },
];

const on = (
  _: string,
  onEvent: (event: { button: string; device: Sdl.Controller.Device }) => void,
) => {
  onEvent({ button: "a", device: steamDeck });
};

const sdlMock = {
  controller: {
    devices,
    openDevice: (controller: Sdl.Controller.Device) => {
      return {
        on,
        buttons: {
          back: false,
        },
        steamHandle: controller === eightBitDoPro2 ? 123 : null,
        close: () => {},
      };
    },
    on,
    addMappings: () => {},
  },
  joystick: {
    devices,
    openDevice: () => {
      return {
        on,
        buttons: {
          back: false,
        },
        close: () => {},
      };
    },
  },
  keyboard: {
    SCANCODE: scancodes,
  },
  info: {
    version: {
      compile: {
        major: 2,
        minor: 32,
        patch: 8,
      },
      runtime: {
        major: 2,
        minor: 32,
        patch: 8,
      },
    },
  },
};

export default sdlMock;
