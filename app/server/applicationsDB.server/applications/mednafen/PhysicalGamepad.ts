import type { SdlButtonId } from "../../gamepads";

export interface PhysicalGamepadInterface {
  deviceId: string;
  mappingObject: Partial<Record<SdlButtonId, string>>;
  getDpadUp: () => string | null;
  getDpadDown: () => string | null;
  getDpadLeft: () => string | null;
  getDpadRight: () => string | null;
  getA: () => string | null;
  getB: () => string | null;
  getX: () => string | null;
  getY: () => string | null;
  getStart: () => string | null;
  getBack: () => string | null;
  getLeftTrigger: () => string | null;
  getRightTrigger: () => string | null;
  getLeftShoulder: () => string | null;
  getRightShoulder: () => string | null;
  getLeftStickUp: () => string | null;
  getLeftStickDown: () => string | null;
  getLeftStickLeft: () => string | null;
  getLeftStickRight: () => string | null;
}
