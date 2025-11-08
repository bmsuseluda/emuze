const createPort = (type: PortType, seqText: PortSeqText): Port => ({
  newseq: { "#text": seqText, "@_type": "standard" },
  "@_type": type,
});

export const createPorts = (
  portConfigs: [type: PortType, seqText: PortSeqText][],
) => portConfigs.map(([type, seqText]) => createPort(type, seqText));

export type PortType =
  | "UI_MENU"
  | "UI_SAVE_STATE"
  | "UI_LOAD_STATE"
  | "POWER_ON"
  | "POWER_OFF"
  | "SERVICE"
  | "MEMORY_RESET"
  | "UI_HELP"
  | "UI_RESET_MACHINE"
  | "UI_SOFT_RESET"
  | "UI_TAPE_START"
  | "UI_TAPE_STOP"
  | "UI_AUDIT";

export type PortSeqText = `KEYCODE_${string}` | "NONE";

export interface Port {
  newseq: { "#text": PortSeqText; "@_type": "standard" };
  "@_type": PortType;
}

export interface ConfigFile {
  "?xml": { "@_version": "1.0" };
  mameconfig: {
    system: {
      input: {
        port: Port[];
      };
    };
  };
}
