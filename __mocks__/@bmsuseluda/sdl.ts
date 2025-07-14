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
    on: (_: string, onEvent: (event: { button: string }) => void) => {
      onEvent({ button: "a" });
    },
    addMappings: () => {},
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
