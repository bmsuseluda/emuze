import type { Sdl } from "@kmamal/sdl";
import { scancodes } from "../../app/server/applicationsDB.server/applications/ares/keyboardConfig.js";
import {
  gamepadPs4,
  steamDeck,
} from "../../app/server/applicationsDB.server/gamepads.js";
import type { SdlType } from "../../app/types/gamepad.js";

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
} as unknown as SdlType;

export default sdlMock;
