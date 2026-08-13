interface SystemSpecificGamepad {
  gamepadIndex?: number;
  buttonId: string;
}

export const getSystemGamepadButtonReset =
  (systemInputPath: string, gamepadType: string) =>
  ({ buttonId, gamepadIndex }: SystemSpecificGamepad) => [
    "--setting",
    `${[
      `${systemInputPath}${typeof gamepadIndex !== "undefined" ? gamepadIndex + 1 : ""}`,
      gamepadType,
      buttonId,
    ].join("/")}= `,
  ];
