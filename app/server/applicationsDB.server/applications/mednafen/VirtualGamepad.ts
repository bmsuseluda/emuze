export class VirtualGamepad<MednafenButtonId extends string> {
  index;
  system;
  gamepadType;

  constructor(index: number, system: string, gamepadType: string = "gamepad") {
    this.index = index;
    this.system = system;
    this.gamepadType = gamepadType;
  }

  initialize = () => [
    `-${this.system}.input.port${this.index + 1}`,
    this.gamepadType,
  ];

  disableButtonMapping = (mednafenButtonId: MednafenButtonId) => [
    `-${this.system}.input.port${this.index + 1}.${this.gamepadType}.${mednafenButtonId}`,
    " ",
  ];

  createButtonMapping = (
    mednafenButtonId: MednafenButtonId,
    ...physicalGamepadButtons: (string | null)[]
  ) => {
    const physicalGamepadButtonsFiltered =
      physicalGamepadButtons.filter(Boolean);

    if (physicalGamepadButtonsFiltered.length > 0) {
      return [
        `-${this.system}.input.port${this.index + 1}.${this.gamepadType}.${mednafenButtonId}`,
        physicalGamepadButtonsFiltered.join(" || "),
      ];
    }

    return this.disableButtonMapping(mednafenButtonId);
  };
}
