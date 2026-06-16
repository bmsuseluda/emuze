export type InputType = "Button" | "Hat" | "Axis";
export type AnalogType = "Positive" | "Negative";
export type HatType = "Up" | "Down" | "Left" | "Right";

export type HatValue = `${string}|Hat|1|${HatType}`;
export type AnalogValue = `${string}|Axis|${string}|${AnalogType}`;
export type ButtonValue = `${string}|Button|${string}`;

export interface Settings {
  custom_controller_bindings: "true";
  bind_port_1_up: `${string}|${InputType}|${string}|Up`;
  bind_port_1_down: `${string}|${InputType}|${string}|Down`;
  bind_port_1_left: `${string}|${InputType}|${string}|Left`;
  bind_port_1_right: `${string}|${InputType}|${string}|Right`;
  bind_port_1_start: `${string}|${InputType}|${string}`;
  bind_port_1_b: `${string}|${InputType}|${string}`;
  bind_port_1_a: `${string}|${InputType}|${string}`;
  bind_port_1_y: `${string}|${InputType}|${string}`;
  bind_port_1_x: `${string}|${InputType}|${string}`;
  bind_port_1_select: `${string}|${InputType}|${string}`;
  bind_port_1_l: `${string}|${InputType}|${string}`;
  bind_port_1_r: `${string}|${InputType}|${string}`;
  bind_port_1_l2: `${string}|${InputType}|${string}|Positive`;
  bind_port_1_r2: `${string}|${InputType}|${string}|Positive`;
  bind_port_1_l3: `${string}|${InputType}|${string}`;
  bind_port_1_r3: `${string}|${InputType}|${string}`;
  bind_port_1_lstickup: `${string}|${InputType}|${string}|Negative`;
  bind_port_1_lstickdown: `${string}|${InputType}|${string}|Positive`;
  bind_port_1_lstickleft: `${string}|${InputType}|${string}|Negative`;
  bind_port_1_lstickright: `${string}|${InputType}|${string}|Positive`;
  bind_port_1_rstickup: `${string}|${InputType}|${string}|Negative`;
  bind_port_1_rstickdown: `${string}|${InputType}|${string}|Positive`;
  bind_port_1_rstickleft: `${string}|${InputType}|${string}|Negative`;
  bind_port_1_rstickright: `${string}|${InputType}|${string}|Positive`;
}
