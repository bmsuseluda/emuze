export type GamepadType = "Nintendo" | "XBox" | "PlayStation";

const gamepadTypeMapping: { gamepadType: GamepadType; idParts: string[] }[] = [
  {
    gamepadType: "Nintendo",
    idParts: [
      "vendor: 057e",
      "nintendo",
      "pro controller",
      "8bitdo pro 2 (standard gamepad vendor: 045e product: 02e0)",
      "8Bitdo SFC30 GamePad",
    ],
  },
  {
    gamepadType: "PlayStation",
    idParts: ["vendor: 054c", "vendor: 7545", "vendor: 2563", "playstation"],
  },
  {
    gamepadType: "XBox",
    idParts: [],
  },
];

const findGamepadType = (gamepadId: string) => (idPart: string) =>
  gamepadId.includes(idPart);

export const identifyGamepadType = (gamepadId: string): GamepadType => {
  const gamepadIdNormalized = gamepadId.toLowerCase();

  const result = gamepadTypeMapping.find(({ idParts }) =>
    idParts.find(findGamepadType(gamepadIdNormalized)),
  );

  if (result) {
    return result.gamepadType;
  }

  return "XBox";
};
