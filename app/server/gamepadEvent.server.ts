import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "./debug.server.js";
import type { ButtonId, GamepadData, GamepadType } from "../types/gamepad.js";

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
    case "leftTrigger":
      return axis;
    case "rightTrigger":
      return axis;
    default:
      return "leftStickUp";
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
    default:
      return undefined;
  }
};

let gamepads: Sdl.Controller.ControllerInstance[] = [];
const axisMaxValue = 1;
const axisValueThreshold = axisMaxValue / 2;

// TODO: add tests
const addGamepadEvents = (
  device: Sdl.Controller.Device,
  sendEvent: (data: GamepadData) => void,
) => {
  const controller = sdl.controller.openDevice(device);
  gamepads.push(controller);
  controller.on("buttonDown", (event) => {
    sendEvent({
      gamepadType: getGamepadType(device.type),
      buttonId: event.button,
      eventType: event.type,
    });
  });
  controller.on("buttonUp", (event) => {
    sendEvent({
      gamepadType: getGamepadType(device.type),
      buttonId: event.button,
      eventType: event.type,
    });
  });
  controller.on("axisMotion", ({ axis, value }) => {
    const pressed = value < -axisValueThreshold || value > axisValueThreshold;
    const buttonId = getAxisButtonId(axis, value);
    const buttonSisterId = getAxisButtonSisterId(axis, buttonId);

    if (axisButtonsPressed[buttonId] !== pressed) {
      log("debug", "axisMotion", axis, value);
      sendEvent({
        gamepadType: getGamepadType(device.type),
        buttonId: buttonId,
        eventType: pressed ? "buttonDown" : "buttonUp",
      });
      axisButtonsPressed[buttonId] = pressed;
      if (buttonSisterId && pressed) {
        axisButtonsPressed[buttonSisterId] = false;
      }
    }
  });
};

export const handleGamepadEvents = (sendEvent: (data: GamepadData) => void) => {
  gamepads = [];

  sdl.controller.on("deviceAdd", (event) => {
    addGamepadEvents(event.device, sendEvent);
  });
  sdl.controller.on("deviceRemove", (event) => {
    gamepads = gamepads.filter(({ device }) => event.device.id !== device.id);
  });
  const devices = sdl.controller.devices;
  if (devices.length > 0) {
    log("debug", "connect gamepads", devices);
    devices.forEach((device) => {
      addGamepadEvents(device, sendEvent);
    });
  }
};

export const closeGamepads = () => {
  log("debug", "close gamepads");
  gamepads.forEach((gamepad) => {
    if (!gamepad.closed) {
      gamepad.close();
    }
  });
};
