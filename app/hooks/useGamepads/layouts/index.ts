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
    /**
     * XBox: A<br>
     * PlayStation: X<br>
     * Nintendo: B
     */
    A: 0,

    /**
     * XBox: B<br>
     * PlayStation: Circle<br>
     * Nintendo: A
     */
    B: 1,

    /**
     * XBox: X<br>
     * PlayStation: Square<br>
     * Nintendo: Y
     */
    X: 2,

    /**
     * XBox: Y<br>
     * PlayStation: Triangle<br>
     * Nintendo: X
     */
    Y: 3,

    /**
     * XBox: LB<br>
     * PlayStation: L1<br>
     * Nintendo: L
     */
    LB: 4,

    /**
     * XBox: RB<br>
     * PlayStation: R1<br>
     * Nintendo: R
     */
    RB: 5,

    /**
     * XBox: LT<br>
     * PlayStation: L2<br>
     * Nintendo: ZL
     */
    LT: 6,

    /**
     * XBox: RT<br>
     * PlayStation: R2<br>
     * Nintendo: ZR
     */
    RT: 7,

    /**
     * XBox: Back<br>
     * PlayStation: Select / Share<br>
     * Nintendo: Select / -
     */
    Back: 8,

    /**
     * XBox: Start<br>
     * PlayStation: Start / Options<br>
     * Nintendo: Start / +
     */
    Start: 9,

    /**
     * XBox: Left Stick pressed<br>
     * PlayStation: L3<br>
     * Nintendo: Left Stick pressed
     */
    LS: 10,

    /**
     * XBox: Right Stick pressed<br>
     * PlayStation: R3<br>
     * Nintendo: Right Stick pressed
     */
    RS: 11,

    /**
     * Directional Pad Up
     */
    DPadUp: 12,

    /**
     * Directional Pad Down
     */
    DPadDown: 13,

    /**
     * Directional Pad Left
     */
    DPadLeft: 14,

    /**
     * Directional Pad Right
     */
    DPadRight: 15,

    /**
     * XBox: XBox Button<br>
     * PlayStation: PlayStation Button<br>
     * Nintendo: Home Button
     */
    Home: 16,
  },
  axes: {
    leftStickX: 0,
    leftStickY: 1,
    rightStickX: 2,
    rightStickY: 3,
  },
};
