import type { Sdl } from "@bmsuseluda/sdl";
import sdl from "@bmsuseluda/sdl";
import { log } from "./debug.server.js";

type ButtonUpEventFunction = (
  event: sdl.Events.Controller.ButtonUp,
  controller: Sdl.Controller.ControllerInstance,
) => void;

type ButtonDownEventFunction = (
  event: sdl.Events.Controller.ButtonDown,
  controller: Sdl.Controller.ControllerInstance,
) => void;

export type AxisMotionEventFunction = (
  event: sdl.Events.Controller.AxisMotion,
  controller: Sdl.Controller.ControllerInstance,
) => void;

class GamepadManager {
  buttonUpEvents: Record<string, ButtonUpEventFunction> = {};
  buttonDownEvents: Record<string, ButtonDownEventFunction> = {};
  axisMotionEvents: Record<string, AxisMotionEventFunction> = {};

  constructor() {
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
    log("debug", "registerEvents", device);

    try {
      const controller = sdl.controller.openDevice(device);

      controller.on("buttonUp", (event) => {
        Object.values(this.buttonUpEvents).forEach((eventFunction) => {
          eventFunction(event, controller);
        });
      });

      controller.on("buttonDown", (event) => {
        Object.values(this.buttonDownEvents).forEach((eventFunction) => {
          eventFunction(event, controller);
        });
      });

      controller.on("axisMotion", (event) => {
        Object.values(this.axisMotionEvents).forEach((eventFunction) => {
          eventFunction(event, controller);
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
}

export const gamepadManager = new GamepadManager();
