import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../debug.server.js";
import mappings from "./mappings.json" with { type: "json" };
import {
  eightBitDoPro2,
  gamepadPs4,
  type GamepadType,
} from "../../types/gamepad.js";

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
  sdl.controller.addMappings([
    ...mappings,
    // TODO: Check on windows and submit pull request to db
    "0500a7a57e0500000720000001800000,NSO NES Controller,a:b0,b:b1,back:b4,start:b5,leftshoulder:b2,rightshoulder:b3,dpup:h0.1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,platform:Linux,",
    "0500c0db7e0500001720000001800000,NSO SNES Controller,a:b1,b:b0,x:b2,y:b3,back:b8,start:b9,leftshoulder:b4,rightshoulder:b5,dpup:h0.1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,lefttrigger:b6,righttrigger:b7,platform:Linux,",
    "050067007e0500000620000001800000,Nintendo Switch Left Joy-Con,a:b8,b:b9,back:b5,leftshoulder:b2,leftstick:b6,rightshoulder:b4,lefttrigger:b1,righttrigger:b3,start:b0,x:b10,y:b7,leftx:a1,lefty:a0~,platform:Linux,",
    "05001c5e7e0500001920000001800000,NSO N64 Controller,+rightx:b2,+righty:b3,-rightx:b4,-righty:b10,a:b0,b:b1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b6,lefttrigger:b8,leftx:a0,lefty:a1,misc1:b5,rightshoulder:b7,righttrigger:b9,start:b11,platform:Linux,",
    "0300767a790000004318000010010000,Mayflash GameCube Controller Adapter,a:b1,b:b2,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b7,righttrigger:a4,rightx:a5,righty:a2,start:b9,x:b0,y:b3,platform:Linux,",
    "050095ac5e040000e002000003090000,Xbox One Wireless Controller,a:b0,b:b1,back:b6,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b10,leftshoulder:b4,leftstick:b8,lefttrigger:a2,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b9,righttrigger:a5,rightx:a3,righty:a4,start:b7,x:b2,y:b3,platform:Linux,",
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
      devices.forEach((device, index) => {
        this.registerEventsForDevice(device, index);
      });
    }
  }

  private registerEventsForDevice(
    device: Sdl.Controller.Device,
    index?: number,
  ) {
    log(
      "debug",
      "registerEvents",
      device,
      index ? sdl.joystick.devices[index].name : "",
    );

    try {
      const controller = sdl.controller.openDevice(device);
      const gamepadType = this.getGamepadType(device);

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

  getGamepadType = ({
    type,
    vendor,
    product,
  }: Sdl.Controller.Device): GamepadType => {
    if (type) {
      switch (type) {
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
