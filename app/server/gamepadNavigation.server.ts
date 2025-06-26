import type { Sdl } from "@bmsuseluda/sdl";
import { log } from "./debug.server.js";
import type { ButtonId, GamepadData, GamepadType } from "../types/gamepad.js";
import type { AxisMotionEventFunction } from "./gamepadManager.server.js";
import { gamepadManager } from "./gamepadManager.server.js";
import { isGameRunning } from "./gameIsRunning.server.js";
import { importElectron } from "./importElectron.server.js";
import { isImportRunning } from "./importIsRunning.server.js";

const isGamepadNavigationAllowed = () => {
  const electron = importElectron();
  const window = electron?.BrowserWindow.getFocusedWindow();

  return window?.isFocused() && !isGameRunning() && !isImportRunning();
};

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
        return axisButtonsPressed.leftStickUp ? "leftStickUp" : "leftStickDown";
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
        return axisButtonsPressed.rightStickUp
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
const axisValueThreshold = axisMaxValue * 0.45;

const gamepadEventId = "general";

export type SendEvent = (data: GamepadData) => void;

export const handleAxisMotionEvent =
  (
    sendEvent: SendEvent,
    axisButtonsPressed: Partial<Record<ButtonId, boolean>>,
  ): AxisMotionEventFunction =>
  ({ axis, value }, controller) => {
    const buttonId = getAxisButtonId(axis, value);
    const pressed = value <= -axisValueThreshold || value >= axisValueThreshold;
    const pressedBefore = !!axisButtonsPressed[buttonId];
    const buttonSisterId = getAxisButtonSisterId(axis, buttonId);
    const buttonSisterIdPressedBefore =
      buttonSisterId && !!axisButtonsPressed[buttonSisterId];

    if (buttonSisterIdPressedBefore && !pressed) {
      // cleanup from last press
      sendEvent({
        gamepadType: getGamepadType(controller.device.type),
        buttonId: buttonSisterId,
        eventType: "buttonUp",
      });
      axisButtonsPressed[buttonSisterId] = false;
    }

    if (pressedBefore !== pressed) {
      log(
        "debug",
        "axisMotion",
        axis,
        value,
        buttonId,
        pressed,
        axisButtonsPressed,
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
  };

export const registerGamepadNavigationEvents = (sendEvent: SendEvent) => {
  log("debug", "registerGamepadNavigationEvents");

  gamepadManager.addButtonDownEvent(gamepadEventId, (event, controller) => {
    if (isGamepadNavigationAllowed()) {
      log("debug", "buttonDown", event.button);
      sendEvent({
        gamepadType: getGamepadType(controller.device.type),
        buttonId: event.button,
        eventType: event.type,
      });
    }
  });

  gamepadManager.addButtonUpEvent(gamepadEventId, (event, controller) => {
    if (isGamepadNavigationAllowed()) {
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
    handleAxisMotionEvent(sendEvent, axisButtonsPressed),
  );
};
