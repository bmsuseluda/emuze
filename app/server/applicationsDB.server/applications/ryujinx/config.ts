export interface InputConfig {
  left_joycon_stick: {
    joystick: "Left";
    invert_stick_x: false;
    invert_stick_y: false;
    rotate90_cw: false;
    stick_button: "LeftStick";
  };
  right_joycon_stick: {
    joystick: "Right";
    invert_stick_x: false;
    invert_stick_y: false;
    rotate90_cw: false;
    stick_button: "RightStick";
  };
  deadzone_left: 0.1;
  deadzone_right: 0.1;
  range_left: 1;
  range_right: 1;
  trigger_threshold: 0.5;
  motion: {
    motion_backend: "GamepadDriver";
    sensitivity: 100;
    gyro_deadzone: 1;
    enable_motion: true;
  };
  rumble?: {
    strong_rumble: 1;
    weak_rumble: 1;
    enable_rumble: boolean;
  };
  left_joycon: {
    button_minus: "Back";
    button_l: "LeftShoulder";
    button_zl: "LeftTrigger";
    button_sl: "Unbound";
    button_sr: "Unbound";
    dpad_up: "DpadUp";
    dpad_down: "DpadDown";
    dpad_left: "DpadLeft";
    dpad_right: "DpadRight";
  };
  right_joycon: {
    button_plus: "Start";
    button_r: "RightShoulder";
    button_zr: "RightTrigger";
    button_sl: "Unbound";
    button_sr: "Unbound";
    button_x: "Y";
    button_b: "A";
    button_y: "X";
    button_a: "B";
  };
  version: 1;
  backend: "GamepadSDL2";
  id: string;
  controller_type: "ProController";
  player_index: `Player${number}`;
}

export interface Config {
  show_confirm_exit?: boolean;
  hotkeys?: {
    show_ui?: string;
    toggle_mute?: string;
  };
  game_dirs?: string[];
  input_config?: InputConfig[];
}

export const defaultInputConfig: InputConfig = {
  left_joycon_stick: {
    joystick: "Left",
    invert_stick_x: false,
    invert_stick_y: false,
    rotate90_cw: false,
    stick_button: "LeftStick",
  },
  right_joycon_stick: {
    joystick: "Right",
    invert_stick_x: false,
    invert_stick_y: false,
    rotate90_cw: false,
    stick_button: "RightStick",
  },
  deadzone_left: 0.1,
  deadzone_right: 0.1,
  range_left: 1,
  range_right: 1,
  trigger_threshold: 0.5,
  motion: {
    motion_backend: "GamepadDriver",
    sensitivity: 100,
    gyro_deadzone: 1,
    enable_motion: true,
  },
  rumble: {
    strong_rumble: 1,
    weak_rumble: 1,
    enable_rumble: false,
  },
  left_joycon: {
    button_minus: "Back",
    button_l: "LeftShoulder",
    button_zl: "LeftTrigger",
    button_sl: "Unbound",
    button_sr: "Unbound",
    dpad_up: "DpadUp",
    dpad_down: "DpadDown",
    dpad_left: "DpadLeft",
    dpad_right: "DpadRight",
  },
  right_joycon: {
    button_plus: "Start",
    button_r: "RightShoulder",
    button_zr: "RightTrigger",
    button_sl: "Unbound",
    button_sr: "Unbound",
    button_x: "Y",
    button_b: "A",
    button_y: "X",
    button_a: "B",
  },
  version: 1,
  backend: "GamepadSDL2",
  id: "0-d3af0003-054c-0000-6802-000011810000",
  controller_type: "ProController",
  player_index: "Player1",
};

export const defaultConfig: Config = {
  hotkeys: {},
  input_config: [defaultInputConfig],
};
