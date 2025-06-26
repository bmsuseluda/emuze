import type { Sdl } from "@bmsuseluda/sdl";
import {
  eightBitDoPro2,
  type ButtonId,
  type GamepadData,
} from "../../types/gamepad.js";
import type { SendEvent } from "../gamepadNavigation.server.js";
import { handleAxisMotionEvent } from "../gamepadNavigation.server.js";

describe("gamepadNavigation.server", () => {
  describe("handleAxisMotionEvent", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    const sendEvent = vi.fn<SendEvent>();

    it("should send left stick down pressed", () => {
      const axisButtonsPressed: Partial<Record<ButtonId, boolean>> = {};

      handleAxisMotionEvent(sendEvent, axisButtonsPressed)(
        { axis: "leftStickY", type: "axisMotion", value: 0.8 },
        { device: eightBitDoPro2 } as Sdl.Controller.ControllerInstance,
      );

      const expected: GamepadData = {
        gamepadType: "XBox",
        buttonId: "leftStickDown",
        eventType: "buttonDown",
      };

      expect(sendEvent).toBeCalledWith(expected);
      expect(axisButtonsPressed.leftStickDown).toBeTruthy();
      expect(axisButtonsPressed.leftStickUp).toBeFalsy();
    });

    it("should send left stick down released", () => {
      const axisButtonsPressed: Partial<Record<ButtonId, boolean>> = {
        leftStickDown: true,
      };

      handleAxisMotionEvent(sendEvent, axisButtonsPressed)(
        { axis: "leftStickY", type: "axisMotion", value: 0.1 },
        { device: eightBitDoPro2 } as Sdl.Controller.ControllerInstance,
      );

      const expected: GamepadData = {
        gamepadType: "XBox",
        buttonId: "leftStickDown",
        eventType: "buttonUp",
      };

      expect(sendEvent).toBeCalledWith(expected);
      expect(axisButtonsPressed.leftStickDown).toBeFalsy();
      expect(axisButtonsPressed.leftStickUp).toBeFalsy();
    });

    it("should send left stick up released if sister button value is there", () => {
      const axisButtonsPressed: Partial<Record<ButtonId, boolean>> = {
        // value was -1
        leftStickUp: true,
      };

      handleAxisMotionEvent(sendEvent, axisButtonsPressed)(
        { axis: "leftStickY", type: "axisMotion", value: 0.3 },
        { device: eightBitDoPro2 } as Sdl.Controller.ControllerInstance,
      );

      const expected: GamepadData = {
        gamepadType: "XBox",
        buttonId: "leftStickUp",
        eventType: "buttonUp",
      };

      expect(sendEvent).toBeCalledWith(expected);
      expect(axisButtonsPressed.leftStickUp).toBeFalsy();
      expect(axisButtonsPressed.leftStickDown).toBeFalsy();
    });
  });
});
