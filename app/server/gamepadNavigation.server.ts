import type { Sdl } from "@kmamal/sdl";
import { log } from "./debug.server.js";
import type { ButtonId, GamepadData } from "../types/gamepad.js";
import type { AxisMotionEventFunction } from "./gamepadManager.server/index.js";
import { gamepadManager } from "./gamepadManager.server/index.js";
import { isGameRunning } from "./gameIsRunning.server.js";
import { importElectron } from "./importElectron.server.js";
import { isImportRunning } from "./importIsRunning.server.js";
import { isFileDialogOpen } from "./openDialog.server.js";

const isGamepadNavigationAllowed = () => {
  const electron = importElectron();
  const window = electron?.BrowserWindow.getFocusedWindow();

  return (
    window?.isFocused() &&
    !isGameRunning() &&
    !isImportRunning() &&
    !isFileDialogOpen()
  );
};

type AxisButtonsPressed = Partial<Record<ButtonId, boolean>>;
export type AxisButtonsPressedForControllerId = Record<
  number,
  AxisButtonsPressed
>;

const getAxisButtonId = (
  axis: Sdl.Controller.Axis,
  value: number,
  axisButtonsPressed: AxisButtonsPressed,
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
    axisButtonsPressedForControllerId: AxisButtonsPressedForControllerId,
  ): AxisMotionEventFunction =>
  ({ axis, value }, { device }, gamepadType) => {
    const axisButtonsPressed =
      axisButtonsPressedForControllerId[device.id] || {};

    const buttonId = getAxisButtonId(axis, value, axisButtonsPressed);
    const pressed = value <= -axisValueThreshold || value >= axisValueThreshold;
    const pressedBefore = !!axisButtonsPressed[buttonId];
    const buttonSisterId = getAxisButtonSisterId(axis, buttonId);
    const buttonSisterIdPressedBefore =
      buttonSisterId && !!axisButtonsPressed[buttonSisterId];

    if (buttonSisterIdPressedBefore && !pressed) {
      // cleanup from last press
      log("debug", "axisMotion", "cleanup", gamepadType, buttonSisterId);
      sendEvent({
        gamepadType,
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
        gamepadType,
      );
      sendEvent({
        gamepadType,
        buttonId,
        eventType: pressed ? "buttonDown" : "buttonUp",
      });

      axisButtonsPressed[buttonId] = pressed;
      if (buttonSisterId && pressed) {
        axisButtonsPressed[buttonSisterId] = false;
      }
    }
    axisButtonsPressedForControllerId[device.id] = axisButtonsPressed;
  };

export const registerGamepadNavigationEvents = (sendEvent: SendEvent) => {
  log("debug", "registerGamepadNavigationEvents");
  const axisButtonsPressed: AxisButtonsPressedForControllerId = {};

  gamepadManager.addButtonDownEvent(
    gamepadEventId,
    (event, controller, gamepadType) => {
      if (isGamepadNavigationAllowed()) {
        log("debug", "buttonDown", event.button);
        sendEvent({
          gamepadType,
          buttonId: event.button,
          eventType: event.type,
        });
      }
    },
  );

  gamepadManager.addButtonUpEvent(
    gamepadEventId,
    (event, controller, gamepadType) => {
      if (isGamepadNavigationAllowed()) {
        log("debug", "buttonUp", event.button);
        sendEvent({
          gamepadType,
          buttonId: event.button,
          eventType: event.type,
        });
      }
    },
  );

  gamepadManager.addAxisMotionEvent(
    gamepadEventId,
    handleAxisMotionEvent(sendEvent, axisButtonsPressed),
  );
};
