import {
  gamepadPs4,
  steamDeck,
} from "../../app/server/applicationsDB.server/gamepads.js";
import { scancodes } from "../../app/server/applicationsDB.server/applications/ares/keyboardConfig.js";
import type { Sdl } from "@kmamal/sdl";

const devices: Sdl.Controller.Device[] = [steamDeck, gamepadPs4];

export default {
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
      };
    },
  },
  keyboard: {
    SCANCODE: scancodes,
  },
};
