import { resetUnusedVirtualGamepads } from "../resetUnusedVirtualGamepads";

describe("resetUnusedVirtualGamepads", () => {
  const getReset = (gamepadIndex: number) => [`Pad${gamepadIndex + 1}`];

  it("Should reset virtual gamepad 2 to 5, if only 1 physical gamepad is connected", () => {
    const resetedGamepads = resetUnusedVirtualGamepads(5, 1, getReset);
    expect(resetedGamepads.at(0)).toContain("Pad2");
    expect(resetedGamepads.at(-1)).toContain("Pad5");
  });

  it("Should reset all virtual gamepads, if no physical gamepad is connected", () => {
    const resetedGamepads = resetUnusedVirtualGamepads(5, 0, getReset);
    expect(resetedGamepads.at(0)).toContain("Pad1");
    expect(resetedGamepads.at(-1)).toContain("Pad5");
  });

  it("Should reset no virtual gamepads, if all physical gamepads are connected", () => {
    const resetedGamepads = resetUnusedVirtualGamepads(5, 5, getReset);
    expect(resetedGamepads.length).toBe(0);
  });
});
