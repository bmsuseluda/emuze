import type { Sdl } from "@bmsuseluda/sdl";
import sdl from "@bmsuseluda/sdl";
import { log } from "../debug.server.js";
import mappings from "./mappings.json" with { type: "json" };

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

const addMappings = async () => {
  sdl.controller.addMappings([
    ...mappings,
    "0500c0db7e0500001720000001800000,NSO SNES Controller,a:b1,b:b0,x:b2,y:b3,back:b8,start:b9,leftshoulder:b4,rightshoulder:b5,dpup:h0.1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,lefttrigger:b6,righttrigger:b7,platform:Linux,",
  ]);
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
