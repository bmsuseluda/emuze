/** number starts with 1 */
export type DosboxButtonId =
  | `bind_port_${number}_up`
  | `bind_port_${number}_down`
  | `bind_port_${number}_left`
  | `bind_port_${number}_right`
  | `bind_port_${number}_start`
  | `bind_port_${number}_b`
  | `bind_port_${number}_a`
  | `bind_port_${number}_y`
  | `bind_port_${number}_x`
  | `bind_port_${number}_select`
  | `bind_port_${number}_l`
  | `bind_port_${number}_r`
  | `bind_port_${number}_l2`
  | `bind_port_${number}_r2`
  | `bind_port_${number}_l3`
  | `bind_port_${number}_r3`
  | `bind_port_${number}_lstickup`
  | `bind_port_${number}_lstickdown`
  | `bind_port_${number}_lstickleft`
  | `bind_port_${number}_lstickright`
  | `bind_port_${number}_rstickup`
  | `bind_port_${number}_rstickdown`
  | `bind_port_${number}_rstickleft`
  | `bind_port_${number}_rstickright`;
