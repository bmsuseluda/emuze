import type { Sdl } from "@kmamal/sdl";
import { scancodes } from "../../app/server/applicationsDB.server/applications/ares/keyboardConfig.js";
import {
  gamepadPs4,
  gamepadPs4Joystick,
  steamDeck,
  steamDeckJoystick,
  eightBitDoPro2,
  eightBitDoPro2Joystick,
} from "../../app/types/gamepad.js";

// TODO: add steam controller
// TODO: add joystick without controller
export const controllerDevices: Sdl.Controller.Device[] = [
  steamDeck,
  gamepadPs4,
  eightBitDoPro2,
  { ...eightBitDoPro2, id: 3, player: 3 },
];

export const joystickDevices: Sdl.Joystick.Device[] = [
  steamDeckJoystick,
  gamepadPs4Joystick,
  eightBitDoPro2Joystick,
  { ...eightBitDoPro2Joystick, id: 3, player: 3 },
];

const on = (
  _: string,
  onEvent: (event: { button: string; device: Sdl.Controller.Device }) => void,
) => {
  onEvent({ button: "a", device: steamDeck });
};

const getSteamHandle = (controller: Sdl.Controller.Device) => {
  if (controller === steamDeck) {
    return 123;
  }

  return null;
};

const sdlMock = {
  controller: {
    devices: controllerDevices,
    openDevice: (controller: Sdl.Controller.Device) => {
      return {
        on,
        buttons: {
          back: false,
        },
        steamHandle: getSteamHandle(controller),
        close: () => {},
      };
    },
    on,
    addMappings: () => {},
  },
  joystick: {
    devices: joystickDevices,
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
