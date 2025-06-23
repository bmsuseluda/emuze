import type { Sdl } from "@kmamal/sdl";
import { log } from "./debug.server.js";
import type { ButtonId, GamepadData, GamepadType } from "../types/gamepad.js";
import { gamepadManager } from "./gamepadManager.server.js";
import { isGameRunning } from "./gameIsRunning.server.js";
import { importElectron } from "./importElectron.server.js";

const getGamepadType = (
  sdlControllerType: Sdl.Controller.ControllerType,
): GamepadType => {
  switch (sdlControllerType) {
    case "ps3":
    case "ps4":
    case "ps5": {
      return "PlayStation";
    }
    case "nintendoSwitchJoyconLeft":
    case "nintendoSwitchJoyconRight":
    case "nintendoSwitchJoyconPair":
    case "nintendoSwitchPro": {
      return "Nintendo";
    }
    default:
      return "XBox";
  }
};

const axisButtonsPressed: Partial<Record<ButtonId, boolean>> = {};

const getAxisButtonId = (
  axis: Sdl.Controller.Axis,
  value: number,
): ButtonId => {
  switch (axis) {
    case "leftStickX":
      if (value === 0) {
        return axisButtonsPressed.leftStickLeft
          ? "leftStickLeft"
          : "leftStickRight";
      }
      return value < 0 ? "leftStickLeft" : "leftStickRight";
    case "leftStickY":
      if (value === 0) {
        return axisButtonsPressed.leftStickLeft
          ? "leftStickUp"
          : "leftStickDown";
      }
      return value < 0 ? "leftStickUp" : "leftStickDown";
    case "rightStickX":
      if (value === 0) {
        return axisButtonsPressed.rightStickLeft
          ? "rightStickLeft"
          : "rightStickRight";
      }
      return value < 0 ? "rightStickLeft" : "rightStickRight";
    case "rightStickY":
      if (value === 0) {
        return axisButtonsPressed.rightStickLeft
          ? "rightStickUp"
          : "rightStickDown";
      }
      return value < 0 ? "rightStickUp" : "rightStickDown";
    case "leftTrigger":
      return axis;
    case "rightTrigger":
      return axis;
  }
};

const getAxisButtonSisterId = (
  axis: Sdl.Controller.Axis,
  buttonId: ButtonId,
): ButtonId | undefined => {
  switch (axis) {
    case "leftStickX":
      return buttonId === "leftStickLeft" ? "leftStickRight" : "leftStickLeft";
    case "leftStickY":
      return buttonId === "leftStickUp" ? "leftStickDown" : "leftStickUp";
    case "rightStickX":
      return buttonId === "rightStickLeft"
        ? "rightStickRight"
        : "rightStickLeft";
    case "rightStickY":
      return buttonId === "rightStickUp" ? "rightStickDown" : "rightStickUp";
    default:
      return undefined;
  }
};

const axisMaxValue = 1;
const axisValueThreshold = axisMaxValue;

const gamepadEventId = "general";

export const registerGamepadNavigationEvents = (
  sendEvent: (data: GamepadData) => void,
) => {
  log("debug", "registerGamepadNavigationEvents");
  const electron = importElectron();
  const window = electron?.BrowserWindow.getFocusedWindow();

  gamepadManager.addButtonDownEvent(gamepadEventId, (event, controller) => {
    if (!isGameRunning() && window?.isFocused()) {
      log("debug", "buttonDown", event.button);
      sendEvent({
        gamepadType: getGamepadType(controller.device.type),
        buttonId: event.button,
        eventType: event.type,
      });
    }
  });

  gamepadManager.addButtonUpEvent(gamepadEventId, (event, controller) => {
    if (!isGameRunning() && window?.isFocused()) {
      log("debug", "buttonUp", event.button);
      sendEvent({
        gamepadType: getGamepadType(controller.device.type),
        buttonId: event.button,
        eventType: event.type,
      });
    }
  });

  gamepadManager.addAxisMotionEvent(
    gamepadEventId,
    ({ axis, value }, controller) => {
      if (!isGameRunning() && window?.isFocused()) {
        const pressed =
          value <= -axisValueThreshold || value >= axisValueThreshold;
        const buttonId = getAxisButtonId(axis, value);
        const buttonSisterId = getAxisButtonSisterId(axis, buttonId);

        if (axisButtonsPressed[buttonId] !== pressed) {
          log(
            "debug",
            "axisMotion",
            axis,
            value,
            buttonId,
            pressed,
            getGamepadType(controller.device.type),
          );
          sendEvent({
            gamepadType: getGamepadType(controller.device.type),
            buttonId,
            eventType: pressed ? "buttonDown" : "buttonUp",
          });

          axisButtonsPressed[buttonId] = pressed;
          if (buttonSisterId && pressed) {
            axisButtonsPressed[buttonSisterId] = false;
          }
        }
      }
    },
  );
};
