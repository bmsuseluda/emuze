export type GamepadType = "Nintendo" | "XBox" | "PlayStation";

const gamepadTypeMapping: { gamepadType: GamepadType; idParts: string[] }[] = [
  {
    gamepadType: "Nintendo",
    idParts: ["nintendo", "pro controller"],
  },
  {
    gamepadType: "PlayStation",
    idParts: [
      "playstation",
      "dual shock",
      "dualshock",
      "dual sense",
      "dualsense",
    ],
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
