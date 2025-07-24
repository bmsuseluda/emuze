import type { Sdl } from "@kmamal/sdl";
import {
  eightBitDoPro2,
  gamepadPs4,
  type GamepadData,
} from "../../types/gamepad.js";
import type {
  AxisButtonsPressedForControllerId,
  SendEvent,
} from "../gamepadNavigation.server.js";
import { handleAxisMotionEvent } from "../gamepadNavigation.server.js";

describe("gamepadNavigation.server", () => {
  describe("handleAxisMotionEvent", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    const sendEvent = vi.fn<SendEvent>();

    it("should send left stick down pressed", () => {
      const axisButtonsPressed: AxisButtonsPressedForControllerId = {};
      const gamepadType = "XBox";

      handleAxisMotionEvent(sendEvent, axisButtonsPressed)(
        { axis: "leftStickY", type: "axisMotion", value: 0.8 },
        { device: eightBitDoPro2 } as Sdl.Controller.ControllerInstance,
        gamepadType,
      );

      const expected: GamepadData = {
        gamepadType,
        buttonId: "leftStickDown",
        eventType: "buttonDown",
      };

      expect(sendEvent).toBeCalledWith(expected);
      expect(axisButtonsPressed[eightBitDoPro2.id].leftStickDown).toBeTruthy();
      expect(axisButtonsPressed[eightBitDoPro2.id].leftStickUp).toBeFalsy();
    });

    it("should ignore up event if there was no down event", () => {
      const axisButtonsPressed: AxisButtonsPressedForControllerId = {
        [gamepadPs4.id]: { leftStickUp: true },
      };
      const gamepadType = "XBox";

      handleAxisMotionEvent(sendEvent, axisButtonsPressed)(
        { axis: "leftStickY", type: "axisMotion", value: -0.2 },
        { device: eightBitDoPro2 } as Sdl.Controller.ControllerInstance,
        gamepadType,
      );

      expect(sendEvent).not.toBeCalled();
      expect(axisButtonsPressed[eightBitDoPro2.id].leftStickDown).toBeFalsy();
      expect(axisButtonsPressed[eightBitDoPro2.id].leftStickUp).toBeFalsy();
      expect(axisButtonsPressed[gamepadPs4.id].leftStickDown).toBeFalsy();
      expect(axisButtonsPressed[gamepadPs4.id].leftStickUp).toBeTruthy();
    });

    it("should send left stick down released", () => {
      const axisButtonsPressed: AxisButtonsPressedForControllerId = {
        [eightBitDoPro2.id]: {
          leftStickDown: true,
        },
      };
      const gamepadType = "XBox";

      handleAxisMotionEvent(sendEvent, axisButtonsPressed)(
        { axis: "leftStickY", type: "axisMotion", value: 0.1 },
        { device: eightBitDoPro2 } as Sdl.Controller.ControllerInstance,
        gamepadType,
      );

      const expected: GamepadData = {
        gamepadType,
        buttonId: "leftStickDown",
        eventType: "buttonUp",
      };

      expect(sendEvent).toBeCalledWith(expected);
      expect(axisButtonsPressed[eightBitDoPro2.id].leftStickDown).toBeFalsy();
      expect(axisButtonsPressed[eightBitDoPro2.id].leftStickUp).toBeFalsy();
    });

    it("should send left stick up released if sister button value is there", () => {
      const axisButtonsPressed: AxisButtonsPressedForControllerId = {
        [eightBitDoPro2.id]: {
          // value was -1
          leftStickUp: true,
        },
      };
      const gamepadType = "XBox";

      handleAxisMotionEvent(sendEvent, axisButtonsPressed)(
        { axis: "leftStickY", type: "axisMotion", value: 0.3 },
        { device: eightBitDoPro2 } as Sdl.Controller.ControllerInstance,
        gamepadType,
      );

      const expected: GamepadData = {
        gamepadType,
        buttonId: "leftStickUp",
        eventType: "buttonUp",
      };

      expect(sendEvent).toBeCalledWith(expected);
      expect(axisButtonsPressed[eightBitDoPro2.id].leftStickUp).toBeFalsy();
      expect(axisButtonsPressed[eightBitDoPro2.id].leftStickDown).toBeFalsy();
    });
  });
});
