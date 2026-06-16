export type DosboxButtonId =
  | "up"
  | "down"
  | "left"
  | "right"
  | "start"
  | "b"
  | "a"
  | "y"
  | "x"
  | "select"
  | "l"
  | "r"
  | "l2"
  | "r2"
  | "l3"
  | "r3"
  | "lstickup"
  | "lstickdown"
  | "lstickleft"
  | "lstickright"
  | "rstickup"
  | "rstickdown"
  | "rstickleft"
  | "rstickright";

/** number starts with 1 */
export type DosboxButtonIdWithPort = `bind_port_${number}_${DosboxButtonId}`;
