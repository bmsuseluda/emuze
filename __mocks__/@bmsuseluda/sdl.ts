import type { Sdl } from "@bmsuseluda/sdl";
import { scancodes } from "../../app/server/applicationsDB.server/applications/ares/keyboardConfig.js";
import { gamepadPs4, steamDeck } from "../../app/types/gamepad.js";

const devices: Sdl.Controller.Device[] = [steamDeck, gamepadPs4];

const sdlMock = {
  controller: {
    devices,
    openDevice: () => {
      return {
        on: (_: string, onEvent: (event: { button: string }) => void) => {
          onEvent({ button: "a" });
        },
        buttons: {
          back: false,
        },
        close: () => {},
      };
    },
    removeAllListeners: () => {},
  },
  joystick: {
    devices,
    openDevice: () => {
      return {
        on: (_: string, onEvent: (event: { button: string }) => void) => {
          onEvent({ button: "a" });
        },
        buttons: {
          back: false,
        },
        close: () => {},
      };
    },
    removeAllListeners: () => {},
  },
  keyboard: {
    SCANCODE: scancodes,
  },
};

export default sdlMock;
