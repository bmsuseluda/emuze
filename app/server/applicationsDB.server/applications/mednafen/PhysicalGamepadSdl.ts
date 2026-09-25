import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  createSdlMappingObject,
  getAxis,
  getButtonIndex,
  isAnalog,
  isDpadHat,
} from "../../../../types/gamepad.js";
import type { PhysicalGamepadInterface } from "./PhysicalGamepad.js";

export class PhysicalGamepadSdl implements PhysicalGamepadInterface {
  deviceId: string;
  mappingObject: SdlButtonMapping;
  buttonCount: number;

  private getGuidWithIndex = (guid: string, guidIndex: number) => {
    if (guidIndex > 0) {
      return `${guid.slice(0, -1)}${Number(guid.slice(-1)) + guidIndex}`;
    }

    return guid;
  };

  constructor(
    guid: string,
    guidIndex: number,
    mapping: string,
    buttonCount: number,
  ) {
    this.deviceId = `0x${this.getGuidWithIndex(guid, guidIndex)}`;
    this.mappingObject = createSdlMappingObject(mapping);
    this.buttonCount = buttonCount;
  }

  private createAbsString = (
    sdlButtonId: SdlButtonId,
    axis: "+" | "-" | "-+",
  ) => {
    const buttonIndex = getButtonIndex(this.mappingObject, sdlButtonId);

    if (buttonIndex) {
      return `joystick ${this.deviceId} abs_${buttonIndex}${axis}`;
    }

    return null;
  };

  private dpadHatMapping: Partial<Record<SdlButtonId, number>> = {
    dpup: 0,
    dpright: 1,
    dpdown: 2,
    dpleft: 3,
  };

  private getDpadHatAsButtonIndex = (sdlButtonId: SdlButtonId) => {
    const dpadHatIndex = this.dpadHatMapping[sdlButtonId];

    if (typeof dpadHatIndex !== "undefined") {
      return `${this.buttonCount + dpadHatIndex}`;
    }

    return null;
  };

  private createDpadString = (sdlButtonId: SdlButtonId) => {
    if (isDpadHat(this.mappingObject, sdlButtonId)) {
      const buttonIndex = this.getDpadHatAsButtonIndex(sdlButtonId);
      if (buttonIndex) {
        return `joystick ${this.deviceId} button_${buttonIndex}`;
      }
      return null;
    } else {
      return this.createButtonString(sdlButtonId);
    }
  };

  private createButtonString = (sdlButtonId: SdlButtonId) => {
    const axisValue = getAxis(this.mappingObject, sdlButtonId);
    if (isAnalog(this.mappingObject, sdlButtonId) && axisValue) {
      return this.createAbsString(sdlButtonId, axisValue);
    }

    const buttonIndex = getButtonIndex(this.mappingObject, sdlButtonId);
    if (buttonIndex) {
      return `joystick ${this.deviceId} button_${buttonIndex}`;
    }

    return null;
  };

  getDpadUp = () => this.createDpadString("dpup");
  getDpadDown = () => this.createDpadString("dpdown");
  getDpadLeft = () => this.createDpadString("dpleft");
  getDpadRight = () => this.createDpadString("dpright");
  getA = () => this.createButtonString("a");
  getB = () => this.createButtonString("b");
  getX = () => this.createButtonString("x");
  getY = () => this.createButtonString("y");
  getStart = () => this.createButtonString("start");
  getBack = () => this.createButtonString("back");
  getLeftTrigger = () =>
    isAnalog(this.mappingObject, "lefttrigger")
      ? this.createAbsString("lefttrigger", "-+")
      : this.createButtonString("lefttrigger");
  getRightTrigger = () =>
    isAnalog(this.mappingObject, "righttrigger")
      ? this.createAbsString("righttrigger", "-+")
      : this.createButtonString("righttrigger");
  getLeftShoulder = () => this.createButtonString("leftshoulder");
  getRightShoulder = () => this.createButtonString("rightshoulder");
  getLeftStickUp = () => this.createAbsString("lefty", "-");
  getLeftStickDown = () => this.createAbsString("lefty", "+");
  getLeftStickLeft = () => this.createAbsString("leftx", "-");
  getLeftStickRight = () => this.createAbsString("leftx", "+");
}
