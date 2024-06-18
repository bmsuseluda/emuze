/**
 * Resets the unused virtual gamepads.
 *
 * @param maxVirtualGamepadsCount The number of possible gamepads connected
 * @param usedVirtualGamepadsCount The number of physical gamepads connected
 * @param getReset The function that returns the reset string
 */
export const resetUnusedVirtualGamepads = (
  maxVirtualGamepadsCount: number,
  usedVirtualGamepadsCount: number,
  getReset: (gamepadIndex: number) => string[],
) =>
  Array.from(
    { length: maxVirtualGamepadsCount - usedVirtualGamepadsCount },
    (_, index) => getReset(index + usedVirtualGamepadsCount),
  ).flat();
