import {
  gamepadPs4,
  steamDeck,
} from "../../app/server/applicationsDB.server/gamepads";
import { scancodes } from "../../app/server/applicationsDB.server/applications/ares/keyboardConfig";
import type { Sdl } from "@kmamal/sdl";

const devices: Sdl.Controller.Device[] = [steamDeck, gamepadPs4];

export default {
  controller: {
    devices,
  },
  keyboard: {
    SCANCODE: scancodes,
  },
};
