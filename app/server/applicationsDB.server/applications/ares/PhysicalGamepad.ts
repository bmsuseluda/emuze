import type { GamepadQualifier, PhysicalGamepadButton } from "./types.js";
import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import { getButtonIndex, isAnalog } from "../../../../types/gamepad.js";

export class PhysicalGamepad {
  deviceId;
  mappingObject;

  constructor(deviceId: string, mappingObject: SdlButtonMapping) {
    this.deviceId = deviceId;
    this.mappingObject = mappingObject;
  }

  getQualifierFromMapping = (
    mappingObject: SdlButtonMapping,
    sdlButtonId: SdlButtonId,
  ): GamepadQualifier | undefined => {
    const buttonMapping = mappingObject[sdlButtonId];

    if (buttonMapping?.startsWith("+")) {
      return "Hi";
    }
    if (buttonMapping?.startsWith("-")) {
      return "Lo";
    }
    if (isAnalog(mappingObject, sdlButtonId)) {
      return "Hi";
    }
    return undefined;
  };

  createButton = (
    sdlButtonId: SdlButtonId,
    qualifier?: GamepadQualifier,
  ): PhysicalGamepadButton => {
    const analog = isAnalog(this.mappingObject, sdlButtonId);
    const mappedQualifier =
      qualifier ||
      this.getQualifierFromMapping(this.mappingObject, sdlButtonId);

    return {
      deviceId: this.deviceId,
      groupId: analog ? "Axis" : "Button",
      inputId: getButtonIndex(this.mappingObject, sdlButtonId),
      qualifier: mappedQualifier,
    };
  };

  getDpadHatUp = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "HAT",
    inputId: "1",
    qualifier: "Lo",
  });

  getDpadHatDown = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "HAT",
    inputId: "1",
    qualifier: "Hi",
  });

  getDpadHatLeft = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "HAT",
    inputId: "0",
    qualifier: "Lo",
  });

  getDpadHatRight = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "HAT",
    inputId: "0",
    qualifier: "Hi",
  });

  getDpadUp = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "dpup"),
  });

  getDpadDown = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "dpdown"),
  });

  getDpadLeft = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "dpleft"),
  });

  getDpadRight = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "dpright"),
  });

  getLeftStickUp = (): PhysicalGamepadButton =>
    this.createButton("lefty", "Lo");

  getLeftStickDown = (): PhysicalGamepadButton =>
    this.createButton("lefty", "Hi");

  getLeftStickLeft = (): PhysicalGamepadButton =>
    this.createButton("leftx", "Lo");

  getLeftStickRight = (): PhysicalGamepadButton =>
    this.createButton("leftx", "Hi");

  getLeftStickClick = (): PhysicalGamepadButton =>
    this.createButton("leftstick");

  getRightStickUp = (): PhysicalGamepadButton =>
    this.createButton("righty", "Lo");

  getRightStickDown = (): PhysicalGamepadButton =>
    this.createButton("righty", "Hi");

  getRightStickLeft = (): PhysicalGamepadButton =>
    this.createButton("rightx", "Lo");

  getRightStickRight = (): PhysicalGamepadButton =>
    this.createButton("rightx", "Hi");

  getRightStickClick = (): PhysicalGamepadButton =>
    this.createButton("rightstick");

  getRightButtonUp = (): PhysicalGamepadButton => this.createButton("-righty");

  getRightButtonDown = (): PhysicalGamepadButton =>
    this.createButton("+righty");

  getRightButtonLeft = (): PhysicalGamepadButton =>
    this.createButton("-rightx");

  getRightButtonRight = (): PhysicalGamepadButton =>
    this.createButton("+rightx");

  getBack = (): PhysicalGamepadButton => this.createButton("back");

  getStart = (): PhysicalGamepadButton => this.createButton("start");

  getA = (): PhysicalGamepadButton => this.createButton("a");

  getB = (): PhysicalGamepadButton => this.createButton("b");

  getX = (): PhysicalGamepadButton => this.createButton("x");

  getY = (): PhysicalGamepadButton => this.createButton("y");

  getLeftShoulder = (): PhysicalGamepadButton =>
    this.createButton("leftshoulder");

  getRightShoulder = (): PhysicalGamepadButton =>
    this.createButton("rightshoulder");

  getLeftTrigger = (): PhysicalGamepadButton =>
    this.createButton("lefttrigger");

  getRightTrigger = (): PhysicalGamepadButton =>
    this.createButton("righttrigger");
}
