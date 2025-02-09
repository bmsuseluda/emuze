import {
  createSdlMappingObject,
  getButtonIndex,
  isAnalog,
  SdlButtonId,
} from "../../gamepads";

export class PhysicalGamepad {
  deviceId;
  mappingObject;

  constructor(deviceId: string, mapping: string) {
    this.deviceId = deviceId;
    this.mappingObject = createSdlMappingObject(mapping);
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

  private createButtonString = (sdlButtonId: SdlButtonId) => {
    const buttonIndex = getButtonIndex(this.mappingObject, sdlButtonId);

    if (buttonIndex) {
      return `joystick ${this.deviceId} button_${buttonIndex}`;
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
