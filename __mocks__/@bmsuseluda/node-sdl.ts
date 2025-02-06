import {
  gamepadPs4,
  steamDeck,
} from "../../app/server/applicationsDB.server/gamepads";
import type { Sdl } from "@bmsuseluda/node-sdl";
import { scancodes } from "../../app/server/applicationsDB.server/applications/ares/keyboardConfig";

const devices: Sdl.Controller.Device[] = [steamDeck, gamepadPs4];

export default {
  controller: {
    devices,
  },
  keyboard: {
    SCANCODE: scancodes,
  },
};
