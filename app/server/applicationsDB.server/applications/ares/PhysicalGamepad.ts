import type { PhysicalGamepadButton } from "./types.js";
import type { SdlButtonMapping } from "../../../../types/gamepad.js";
import { getButtonIndex, isAnalog } from "../../../../types/gamepad.js";

export class PhysicalGamepad {
  deviceId;
  mappingObject;

  constructor(deviceId: string, mappingObject: SdlButtonMapping) {
    this.deviceId = deviceId;
    this.mappingObject = mappingObject;
  }

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

  getLeftStickUp = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Axis",
    inputId: getButtonIndex(this.mappingObject, "lefty"),
    qualifier: "Lo",
  });

  getLeftStickDown = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Axis",
    inputId: getButtonIndex(this.mappingObject, "lefty"),
    qualifier: "Hi",
  });

  getLeftStickLeft = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Axis",
    inputId: getButtonIndex(this.mappingObject, "leftx"),
    qualifier: "Lo",
  });

  getLeftStickRight = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Axis",
    inputId: getButtonIndex(this.mappingObject, "leftx"),
    qualifier: "Hi",
  });

  getLeftStickClick = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "leftstick"),
  });

  getRightStickUp = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Axis",
    inputId: getButtonIndex(this.mappingObject, "righty"),
    qualifier: "Lo",
  });

  getRightStickDown = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Axis",
    inputId: getButtonIndex(this.mappingObject, "righty"),
    qualifier: "Hi",
  });

  getRightStickLeft = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Axis",
    inputId: getButtonIndex(this.mappingObject, "rightx"),
    qualifier: "Lo",
  });

  getRightStickRight = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Axis",
    inputId: getButtonIndex(this.mappingObject, "rightx"),
    qualifier: "Hi",
  });

  getRightStickClick = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "rightstick"),
  });

  getRightButtonUp = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "-righty"),
  });

  getRightButtonDown = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "+righty"),
  });

  getRightButtonLeft = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "-rightx"),
  });

  getRightButtonRight = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "+rightx"),
  });

  getBack = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "back"),
  });

  getStart = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "start"),
  });

  getA = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "a"),
  });

  getB = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "b"),
  });

  getX = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "x"),
  });

  getY = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "y"),
  });

  getLeftShoulder = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "leftshoulder"),
  });

  getRightShoulder = (): PhysicalGamepadButton => ({
    deviceId: this.deviceId,
    groupId: "Button",
    inputId: getButtonIndex(this.mappingObject, "rightshoulder"),
  });

  getLeftTrigger = (): PhysicalGamepadButton => {
    const analog = isAnalog(this.mappingObject, "lefttrigger");
    return {
      deviceId: this.deviceId,
      groupId: analog ? "Axis" : "Button",
      inputId: getButtonIndex(this.mappingObject, "lefttrigger"),
      qualifier: analog ? "Hi" : undefined,
    };
  };

  getRightTrigger = (): PhysicalGamepadButton => {
    const analog = isAnalog(this.mappingObject, "righttrigger");
    return {
      deviceId: this.deviceId,
      groupId: analog ? "Axis" : "Button",
      inputId: getButtonIndex(this.mappingObject, "righttrigger"),
      qualifier: analog ? "Hi" : undefined,
    };
  };
}
