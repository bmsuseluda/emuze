const createPort = (type: PortType, seqText: PortSeqText): Port => ({
  newseq: { "#text": seqText, "@_type": "standard" },
  "@_type": type,
});

export type PortConfig = [type: PortType, seqText: PortSeqText];

export const createPorts = (portConfigs: PortConfig[]) =>
  portConfigs.map(([type, seqText]) => createPort(type, seqText));

export type PortType =
  | "UI_MENU"
  | "UI_SAVE_STATE"
  | "UI_SAVE_STATE_QUICK"
  | "UI_LOAD_STATE"
  | "UI_LOAD_STATE_QUICK"
  | "POWER_ON"
  | "POWER_OFF"
  | "SERVICE"
  | "MEMORY_RESET"
  | "UI_HELP"
  | "UI_RESET_MACHINE"
  | "UI_SOFT_RESET"
  | "UI_TAPE_START"
  | "UI_TAPE_STOP"
  | "TOGGLE_FULLSCREEN"
  | "UI_AUDIT"
  | "UI_FAST_FORWARD"
  | `P${number}_JOYSTICK_UP`
  | `P${number}_JOYSTICK_LEFT`
  | `P${number}_JOYSTICK_RIGHT`
  | `P${number}_JOYSTICK_DOWN`
  | `P${number}_JOYSTICKLEFT_UP`
  | `P${number}_JOYSTICKLEFT_LEFT`
  | `P${number}_JOYSTICKLEFT_RIGHT`
  | `P${number}_JOYSTICKLEFT_DOWN`
  | `P${number}_BUTTON1`
  | `P${number}_BUTTON2`
  | `P${number}_BUTTON3`
  | `P${number}_BUTTON4`
  | `P${number}_BUTTON5`
  | `P${number}_BUTTON6`
  | `P${number}_BUTTON7`
  | `P${number}_BUTTON8`
  | `P${number}_BUTTON9`
  | `P${number}_BUTTON10`
  | `P${number}_BUTTON11`
  | `P${number}_BUTTON15`
  | `P${number}_START`
  | `P${number}_SELECT`
  | `P${number}_SLIDER1_NEG_SWITCH`
  | `P${number}_JOYSTICKRIGHT_UP`
  | `P${number}_JOYSTICKRIGHT_LEFT`
  | `P${number}_JOYSTICKRIGHT_RIGHT`
  | `P${number}_JOYSTICKRIGHT_DOWN`;

export type PortSeqText =
  | `KEYCODE_${string}`
  | `JOYCODE_${number}_${string}`
  | `MOUSECODE_${number}_${string}`
  | "NONE";

export interface Port {
  newseq: { "#text": PortSeqText; "@_type": "standard" };
  "@_type": PortType;
}

export interface ConfigFile {
  "?xml": { "@_version": "1.0" };
  mameconfig: {
    system: {
      input?: {
        port: Port[];
      };
      "@_name": "default";
    };
    "@_version": "10";
  };
}

export const defaultConfig: ConfigFile = {
  "?xml": { "@_version": "1.0" },
  mameconfig: {
    system: {
      "@_name": "default",
    },
    "@_version": "10",
  },
};
