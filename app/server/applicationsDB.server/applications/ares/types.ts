export type SdlButtonId =
  | "a"
  | "b"
  | "x"
  | "y"
  | "back"
  | "start"
  | "guide"
  | "dpdown"
  | "dpleft"
  | "dpright"
  | "dpup"
  | "leftshoulder"
  | "rightshoulder"
  | "lefttrigger"
  | "righttrigger"
  | "leftstick"
  | "rightstick"
  | "leftx"
  | "lefty"
  | "rightx"
  | "righty";

export type SdlButtonMapping = Partial<Record<SdlButtonId, string>>;

export type AresButtonId =
  | "Pad.Up"
  | "Pad.Down"
  | "Pad.Left"
  | "Pad.Right"
  | "Select"
  | "Start"
  | "A..South"
  | "B..East"
  | "X..West"
  | "Y..North"
  | "L-Bumper"
  | "R-Bumper"
  | "L-Trigger"
  | "R-Trigger"
  | "L-Stick..Click"
  | "R-Stick..Click"
  | "L-Up"
  | "L-Down"
  | "L-Left"
  | "L-Right"
  | "R-Up"
  | "R-Down"
  | "R-Left"
  | "R-Right"
  | "Rumble";

export type GamepadGroupId = "Axis" | "HAT" | "Button";

export interface PhysicalGamepadButton {
  deviceId: string;
  groupId: GamepadGroupId;
  inputId?: string;
  qualifier?: "Hi" | "Lo";
}

export interface VirtualGamepad {
  gamepadIndex: number;
  buttonId: AresButtonId;
}
