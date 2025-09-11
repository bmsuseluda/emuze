import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  createSdlMappingObject,
  getButtonIndex,
} from "../../../../types/gamepad.js";
import type { PhysicalGamepadInterface } from "./PhysicalGamepad.js";

const sdlDinputButtonMapping = {
  dpup: 7,
  dpdown: 7,
  dpleft: 6,
  dpright: 6,
  start: 9,
  back: 8,
  leftshoulder: 4,
  rightshoulder: 5,
  lefttrigger: 6,
  righttrigger: 7,
  a: 0,
  b: 1,
  x: 3,
  y: 2,
} satisfies Partial<Record<SdlButtonId, number>>;

const sdlDinputAxesMapping = {
  leftx: 0,
  lefty: 1,
  rightx: 2,
  righty: 3,
  lefttrigger: 4,
  righttrigger: 5,
} satisfies Partial<Record<SdlButtonId, number>>;

export class PhysicalGamepadPs4 implements PhysicalGamepadInterface {
  deviceId: string;
  mappingObject: SdlButtonMapping;

  constructor(deviceId: string, mapping: string) {
    this.deviceId = deviceId;
    this.mappingObject = createSdlMappingObject(mapping);
  }

  private createDpadString = (
    sdlButtonId: SdlButtonId,
    dpadId: number,
    axisPositive: boolean,
  ) => {
    const buttonIndex = getButtonIndex(this.mappingObject, sdlButtonId);

    if (buttonIndex) {
      return `joystick ${this.deviceId} abs_${dpadId}${axisPositive ? "+" : "-"}`;
    }

    return null;
  };

  private createAbsString = (
    sdlButtonId: keyof typeof sdlDinputAxesMapping,
    axis: "+" | "-" | "-+",
  ) => {
    const buttonIndex = getButtonIndex(this.mappingObject, sdlButtonId);

    if (buttonIndex) {
      return `joystick ${this.deviceId} abs_${sdlDinputAxesMapping[sdlButtonId]}${axis}`;
    }

    return null;
  };

  private createButtonString = (
    sdlButtonId: keyof typeof sdlDinputButtonMapping,
  ) => {
    const buttonIndex = getButtonIndex(this.mappingObject, sdlButtonId);

    if (buttonIndex) {
      return `joystick ${this.deviceId} button_${sdlDinputButtonMapping[sdlButtonId]}`;
    }

    return null;
  };

  getDpadUp = () => this.createDpadString("dpup", 7, false);
  getDpadDown = () => this.createDpadString("dpdown", 7, true);
  getDpadLeft = () => this.createDpadString("dpleft", 6, false);
  getDpadRight = () => this.createDpadString("dpright", 6, true);
  getA = () => this.createButtonString("a");
  getB = () => this.createButtonString("b");
  getX = () => this.createButtonString("x");
  getY = () => this.createButtonString("y");
  getStart = () => this.createButtonString("start");
  getBack = () => this.createButtonString("back");
  getLeftTrigger = () => this.createButtonString("lefttrigger");
  getRightTrigger = () => this.createButtonString("righttrigger");
  getLeftShoulder = () => this.createButtonString("leftshoulder");
  getRightShoulder = () => this.createButtonString("rightshoulder");
  getLeftStickUp = () => this.createAbsString("lefty", "-");
  getLeftStickDown = () => this.createAbsString("lefty", "+");
  getLeftStickLeft = () => this.createAbsString("leftx", "-");
  getLeftStickRight = () => this.createAbsString("leftx", "+");
}
