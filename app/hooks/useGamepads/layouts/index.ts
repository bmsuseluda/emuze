export type StickDirection =
  | "leftStickUp"
  | "leftStickDown"
  | "leftStickLeft"
  | "leftStickRight"
  | "rightStickUp"
  | "rightStickDown"
  | "rightStickLeft"
  | "rightStickRight";

export const layout = {
  buttons: {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    Back: 8,
    Start: 9,
    LS: 10,
    RS: 11,
    DPadUp: 12,
    DPadDown: 13,
    DPadLeft: 14,
    DPadRight: 15,
  },
  axes: {
    leftStickX: 0,
    leftStickY: 1,
    rightStickX: 2,
    rightStickY: 3,
  },
};
