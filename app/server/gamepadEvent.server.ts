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

let gamepads: Sdl.Controller.ControllerInstance[] = [];
const axisMaxValue = 1;
const axisValueThreshold = axisMaxValue / 2;

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
    log("debug", "axisMotion", axis, value);
    const pressed = value < -axisValueThreshold || value > axisValueThreshold;
    const buttonId = getAxisButtonId(axis, value);

    if (axisButtonsPressed[buttonId] !== pressed) {
      sendEvent({
        gamepadType: getGamepadType(device.type),
        buttonId: buttonId,
        eventType: pressed ? "buttonDown" : "buttonUp",
      });
      axisButtonsPressed[buttonId] = pressed;
      // TODO: toggle sisterButton or save axis and value instead of buttonId and pressed boolean
    }
  });
};

export const handleGamepadEvents = (sendEvent: (data: GamepadData) => void) => {
  gamepads = [];

  sdl.controller.on("deviceAdd", (event) => {
    addGamepadEvents(event.device, sendEvent);
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
