interface Usb {
  Path: string;
  Serial: string;
  VID: string;
  PID: string;
}

export interface VfsConfigFile {
  "$(EmulatorDir)": string;
  "/dev_hdd0/": string;
  "/dev_hdd1/": string;
  "/dev_flash/": string;
  "/dev_flash2/": string;
  "/dev_flash3/": string;
  "/dev_bdvd/": string;
  "/games/": string;
  "/app_home/": string;
  "/dev_usb***/": Record<string, Usb>;
}

export interface ActiveInputConfigFile {
  "Active Configurations": {
    global: string;
  };
}

export interface PlayerInput {
  Handler: "Keyboard" | "SDL" | "Null";
  Device: string;
  Config: {
    "Left Stick Left": string;
    "Left Stick Down": string;
    "Left Stick Right": string;
    "Left Stick Up": string;
    "Right Stick Left": string;
    "Right Stick Down": string;
    "Right Stick Right": string;
    "Right Stick Up": string;
    Start: string;
    Select: string;
    "PS Button": string;
    Square: string;
    Cross: string;
    Circle: string;
    Triangle: string;
    Left: string;
    Down: string;
    Right: string;
    Up: string;
    R1: string;
    R2: string;
    R3: string;
    L1: string;
    L2: string;
    L3: string;
    "IR Nose": string;
    "IR Tail": string;
    "IR Left": string;
    "IR Right": string;
    "Tilt Left": string;
    "Tilt Right": string;
    "Motion Sensor X": {
      Axis: string;
      Mirrored: boolean;
      Shift: number;
    };
    "Motion Sensor Y": {
      Axis: string;
      Mirrored: boolean;
      Shift: number;
    };
    "Motion Sensor Z": {
      Axis: string;
      Mirrored: boolean;
      Shift: number;
    };
    "Motion Sensor G": {
      Axis: string;
      Mirrored: boolean;
      Shift: number;
    };
    "Orientation Reset Button": string;
    "Orientation Enabled": boolean;
    "Pressure Intensity Button": string;
    "Pressure Intensity Percent": number;
    "Pressure Intensity Toggle Mode": boolean;
    "Pressure Intensity Deadzone": number;
    "Analog Limiter Button": string;
    "Analog Limiter Toggle Mode": boolean;
    "Left Stick Multiplier": number;
    "Right Stick Multiplier": number;
    "Left Stick Deadzone": number;
    "Right Stick Deadzone": number;
    "Left Stick Anti-Deadzone": number;
    "Right Stick Anti-Deadzone": number;
    "Left Trigger Threshold": number;
    "Right Trigger Threshold": number;
    "Left Pad Squircling Factor": number;
    "Right Pad Squircling Factor": number;
    "Color Value R": number;
    "Color Value G": number;
    "Color Value B": number;
    "Blink LED when battery is below 20%": boolean;
    "Use LED as a battery indicator": boolean;
    "LED battery indicator brightness": number;
    "Player LED enabled": boolean;
    "Large Vibration Motor Multiplier": number;
    "Small Vibration Motor Multiplier": number;
    "Switch Vibration Motors": boolean;
    "Mouse Movement Mode": string;
    "Mouse Deadzone X Axis": number;
    "Mouse Deadzone Y Axis": number;
    "Mouse Acceleration X Axis": number;
    "Mouse Acceleration Y Axis": number;
    "Left Stick Lerp Factor": number;
    "Right Stick Lerp Factor": number;
    "Analog Button Lerp Factor": number;
    "Trigger Lerp Factor": number;
    "Device Class Type": number;
    "Vendor ID": number;
    "Product ID": number;
  };
  "Buddy Device": string;
}

export const playerInputReset: PlayerInput = {
  Handler: "Null",
  Device: "Null",
  Config: {
    "Left Stick Left": "",
    "Left Stick Down": "",
    "Left Stick Right": "",
    "Left Stick Up": "",
    "Right Stick Left": "",
    "Right Stick Down": "",
    "Right Stick Right": "",
    "Right Stick Up": "",
    Start: "",
    Select: "",
    "PS Button": "",
    Square: "",
    Cross: "",
    Circle: "",
    Triangle: "",
    Left: "",
    Down: "",
    Right: "",
    Up: "",
    R1: "",
    R2: "",
    R3: "",
    L1: "",
    L2: "",
    L3: "",
    "IR Nose": "",
    "IR Tail": "",
    "IR Left": "",
    "IR Right": "",
    "Tilt Left": "",
    "Tilt Right": "",
    "Motion Sensor X": {
      Axis: "",
      Mirrored: false,
      Shift: 0,
    },
    "Motion Sensor Y": {
      Axis: "",
      Mirrored: false,
      Shift: 0,
    },
    "Motion Sensor Z": {
      Axis: "",
      Mirrored: false,
      Shift: 0,
    },
    "Motion Sensor G": {
      Axis: "",
      Mirrored: false,
      Shift: 0,
    },
    "Orientation Reset Button": "",
    "Orientation Enabled": false,
    "Pressure Intensity Button": "",
    "Pressure Intensity Percent": 50,
    "Pressure Intensity Toggle Mode": false,
    "Pressure Intensity Deadzone": 0,
    "Analog Limiter Button": "",
    "Analog Limiter Toggle Mode": false,
    "Left Stick Multiplier": 100,
    "Right Stick Multiplier": 100,
    "Left Stick Deadzone": 0,
    "Right Stick Deadzone": 0,
    "Left Stick Anti-Deadzone": 0,
    "Right Stick Anti-Deadzone": 0,
    "Left Trigger Threshold": 0,
    "Right Trigger Threshold": 0,
    "Left Pad Squircling Factor": 8000,
    "Right Pad Squircling Factor": 8000,
    "Color Value R": 0,
    "Color Value G": 0,
    "Color Value B": 0,
    "Blink LED when battery is below 20%": true,
    "Use LED as a battery indicator": false,
    "LED battery indicator brightness": 50,
    "Player LED enabled": true,
    "Large Vibration Motor Multiplier": 100,
    "Small Vibration Motor Multiplier": 100,
    "Switch Vibration Motors": false,
    "Mouse Movement Mode": "Relative",
    "Mouse Deadzone X Axis": 60,
    "Mouse Deadzone Y Axis": 60,
    "Mouse Acceleration X Axis": 200,
    "Mouse Acceleration Y Axis": 250,
    "Left Stick Lerp Factor": 100,
    "Right Stick Lerp Factor": 100,
    "Analog Button Lerp Factor": 100,
    "Trigger Lerp Factor": 100,
    "Device Class Type": 0,
    "Vendor ID": 0,
    "Product ID": 0,
  },
  "Buddy Device": "Null",
};

export type PlayerIdString = `Player ${number} Input`;

export type GlobalDefaultInputConfigFile = Record<PlayerIdString, PlayerInput>;

export const globalDefaultInputConfigFileReset: GlobalDefaultInputConfigFile = {
  "Player 1 Input": playerInputReset,
  "Player 2 Input": playerInputReset,
  "Player 3 Input": playerInputReset,
  "Player 4 Input": playerInputReset,
  "Player 5 Input": playerInputReset,
  "Player 6 Input": playerInputReset,
  "Player 7 Input": playerInputReset,
};
