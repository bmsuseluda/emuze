import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import { createSdlMappingObject } from "../../../../types/gamepad.js";
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
    sdlButtonId: keyof typeof sdlDinputButtonMapping,
    axisPositive: boolean,
  ) =>
    `joystick ${this.deviceId} abs_${sdlDinputButtonMapping[sdlButtonId]}${axisPositive ? "+" : "-"}`;

  private createAbsString = (
    sdlButtonId: keyof typeof sdlDinputAxesMapping,
    axis: "+" | "-" | "-+",
  ) =>
    `joystick ${this.deviceId} abs_${sdlDinputAxesMapping[sdlButtonId]}${axis}`;

  private createButtonString = (
    sdlButtonId: keyof typeof sdlDinputButtonMapping,
  ) =>
    `joystick ${this.deviceId} button_${sdlDinputButtonMapping[sdlButtonId]}`;

  getDpadUp = () => this.createDpadString("dpup", false);
  getDpadDown = () => this.createDpadString("dpdown", true);
  getDpadLeft = () => this.createDpadString("dpleft", false);
  getDpadRight = () => this.createDpadString("dpright", true);
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
