import type { SdlButtonId } from "../../gamepads.js";
import {
  createSdlMappingObject,
  getButtonIndex,
  isAnalog,
} from "../../gamepads.js";
import type { PhysicalGamepadInterface } from "./PhysicalGamepad.js";

const sdlXinputButtonMapping = {
  dpup: 0,
  dpdown: 1,
  dpleft: 2,
  dpright: 3,
  start: 4,
  back: 5,
  leftstick: 6,
  rightstick: 7,
  leftshoulder: 8,
  rightshoulder: 9,
  lefttrigger: 10,
  righttrigger: 11,
  a: 12,
  b: 13,
  x: 14,
  y: 15,
} satisfies Partial<Record<SdlButtonId, number>>;

const sdlXinputAxesMapping = {
  leftx: 0,
  lefty: 1,
  rightx: 2,
  righty: 3,
  lefttrigger: 4,
  righttrigger: 5,
} satisfies Partial<Record<SdlButtonId, number>>;

export class PhysicalGamepadXinput implements PhysicalGamepadInterface {
  deviceId: string;
  mappingObject: Partial<Record<SdlButtonId, string>>;

  constructor(deviceId: string, mapping: string) {
    this.deviceId = deviceId;
    this.mappingObject = createSdlMappingObject(mapping);
  }

  private createAbsString = (
    sdlButtonId: keyof typeof sdlXinputAxesMapping,
    axis: "+" | "-" | "-+",
  ) => {
    const buttonIndex = getButtonIndex(this.mappingObject, sdlButtonId);

    if (buttonIndex) {
      return `joystick ${this.deviceId} abs_${sdlXinputAxesMapping[sdlButtonId]}${axis}`;
    }

    return null;
  };

  private createButtonString = (
    sdlButtonId: keyof typeof sdlXinputButtonMapping,
  ) => {
    const buttonIndex = getButtonIndex(this.mappingObject, sdlButtonId);

    if (buttonIndex) {
      return `joystick ${this.deviceId} button_${sdlXinputButtonMapping[sdlButtonId]}`;
    }

    return null;
  };

  getDpadUp = () => this.createButtonString("dpup");
  getDpadDown = () => this.createButtonString("dpdown");
  getDpadLeft = () => this.createButtonString("dpleft");
  getDpadRight = () => this.createButtonString("dpright");
  getA = () => this.createButtonString("a");
  getB = () => this.createButtonString("b");
  getX = () => this.createButtonString("x");
  getY = () => this.createButtonString("y");
  getStart = () => this.createButtonString("start");
  getBack = () => this.createButtonString("back");
  getLeftTrigger = () =>
    isAnalog(this.mappingObject, "lefttrigger")
      ? this.createAbsString("lefttrigger", "+")
      : this.createButtonString("lefttrigger");
  getRightTrigger = () =>
    isAnalog(this.mappingObject, "righttrigger")
      ? this.createAbsString("righttrigger", "+")
      : this.createButtonString("righttrigger");
  getLeftShoulder = () => this.createButtonString("leftshoulder");
  getRightShoulder = () => this.createButtonString("rightshoulder");
  getLeftStickUp = () => this.createAbsString("lefty", "+");
  getLeftStickDown = () => this.createAbsString("lefty", "-");
  getLeftStickLeft = () => this.createAbsString("leftx", "-");
  getLeftStickRight = () => this.createAbsString("leftx", "+");
}
