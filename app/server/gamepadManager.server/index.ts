import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../debug.server.js";
import mappings from "./mappings.json" with { type: "json" };
import {
  eightBitDoPro2,
  gamepadPs4,
  type GamepadType,
} from "../../types/gamepad.js";
import { getJoystickFromController } from "../gamepad.server.js";

type ButtonUpEventFunction = (
  event: sdl.Events.Controller.ButtonUp,
  controller: Sdl.Controller.ControllerInstance,
  gamepadType: GamepadType,
) => void;

type ButtonDownEventFunction = (
  event: sdl.Events.Controller.ButtonDown,
  controller: Sdl.Controller.ControllerInstance,
  gamepadType: GamepadType,
) => void;

export type AxisMotionEventFunction = (
  event: sdl.Events.Controller.AxisMotion,
  controller: Sdl.Controller.ControllerInstance,
  gamepadType: GamepadType,
) => void;

const addMappings = () => {
  sdl.controller.addMappings(mappings);
};

class GamepadManager {
  buttonUpEvents: Record<string, ButtonUpEventFunction> = {};
  buttonDownEvents: Record<string, ButtonDownEventFunction> = {};
  axisMotionEvents: Record<string, AxisMotionEventFunction> = {};

  constructor() {
    addMappings();
    log("info", "sdl version", sdl.info.version);
    sdl.controller.on("deviceAdd", (event) => {
      this.registerEventsForDevice(event.device);
    });

    const devices = sdl.controller.devices;
    if (devices.length > 0) {
      devices.forEach((device) => {
        this.registerEventsForDevice(device);
      });
    }
  }

  private registerEventsForDevice(device: Sdl.Controller.Device) {
    const joystick = getJoystickFromController(device);
    log("debug", "registerEvents", device, joystick?.name);

    try {
      const controller = sdl.controller.openDevice(device);
      const gamepadType = this.getGamepadType(device, joystick);

      controller.on("buttonUp", (event) => {
        Object.values(this.buttonUpEvents).forEach((eventFunction) => {
          eventFunction(event, controller, gamepadType);
        });
      });

      controller.on("buttonDown", (event) => {
        Object.values(this.buttonDownEvents).forEach((eventFunction) => {
          eventFunction(event, controller, gamepadType);
        });
      });

      controller.on("axisMotion", (event) => {
        Object.values(this.axisMotionEvents).forEach((eventFunction) => {
          eventFunction(event, controller, gamepadType);
        });
      });
    } catch (error) {
      log("error", "openDevice", device, error);
    }
  }

  public addButtonUpEvent(id: string, eventFunction: ButtonUpEventFunction) {
    if (!this.buttonUpEvents[id]) {
      this.buttonUpEvents[id] = eventFunction;
    }
  }

  public addButtonDownEvent(
    id: string,
    eventFunction: ButtonDownEventFunction,
  ) {
    if (!this.buttonDownEvents[id]) {
      this.buttonDownEvents[id] = eventFunction;
    }
  }

  public addAxisMotionEvent(
    id: string,
    eventFunction: AxisMotionEventFunction,
  ) {
    if (!this.axisMotionEvents[id]) {
      this.axisMotionEvents[id] = eventFunction;
    }
  }

  getGamepadType = (
    controller: Sdl.Controller.Device,
    joystick?: Sdl.Joystick.Device,
  ): GamepadType => {
    if (controller.type) {
      switch (controller.type) {
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
    }

    const { vendor, product } = joystick || controller;

    switch (vendor) {
      case 1406: {
        return "Nintendo";
      }
      case gamepadPs4.vendor: {
        return "PlayStation";
      }
      case eightBitDoPro2.vendor: {
        if (product === eightBitDoPro2.product) {
          return "Nintendo";
        }
        return "XBox";
      }
      default:
        return "XBox";
    }
  };
}

export const gamepadManager = new GamepadManager();
