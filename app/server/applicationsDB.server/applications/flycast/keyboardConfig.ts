import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import type { ParamToReplace } from "../../configFile.js";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";

const flycastButtonIds = {
  leftStickUp: { id: "btn_analog_up", bindIndex: 13 },
  leftStickDown: { id: "btn_analog_down", bindIndex: 10 },
  leftStickLeft: { id: "btn_analog_left", bindIndex: 0 },
  leftStickRight: { id: "btn_analog_right", bindIndex: 1 },
  dpadUp: { id: "btn_dpad1_up", bindIndex: 11 },
  dpadLeft: { id: "btn_dpad1_left", bindIndex: 2 },
  dpadDown: { id: "btn_dpad1_down", bindIndex: 3 },
  dpadRight: { id: "btn_dpad1_right", bindIndex: 4 },
  a: { id: "btn_a", bindIndex: 6 },
  b: { id: "btn_b", bindIndex: 7 },
  x: { id: "btn_x", bindIndex: 12 },
  y: { id: "btn_y", bindIndex: 5 },
  leftTrigger: { id: "btn_trigger_left", bindIndex: 8 },
  rightTrigger: { id: "btn_trigger_right", bindIndex: 9 },
  start: { id: "btn_start", bindIndex: 14 },
} satisfies Partial<Record<EmuzeButtonId, { id: string; bindIndex: number }>>;

export const getKeyboardButtonMappings = (): ParamToReplace[] =>
  Object.entries(flycastButtonIds).map(
    ([sdlBttonId, { id: flycastButtonId, bindIndex }]) => {
      const sdlScancodeName: Sdl.Keyboard.ScancodeNames =
        keyboardMapping[sdlBttonId as EmuzeButtonId];
      const sdlScancode = sdl.keyboard.SCANCODE[sdlScancodeName];

      return {
        keyValue: `bind${bindIndex} = ${sdlScancode}:${flycastButtonId}`,
      };
    },
  );
