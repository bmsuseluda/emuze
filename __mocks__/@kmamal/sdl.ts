import {
  gamepadPs4,
  steamDeck,
} from "../../app/server/applicationsDB.server/gamepads";
import { Sdl } from "@kmamal/sdl";

const devices: Sdl.Controller.Device[] = [steamDeck, gamepadPs4];

export default {
  controller: {
    devices,
  },
};
