import { useGamepadButtonPressEvent } from "../useGamepadEvent/index.js";
import { useKeyboardEvent } from "../useKeyboardEvent/index.js";

export const useDirectionalInputUp = (onUp: () => void) => {
  useGamepadButtonPressEvent("dpadUp", onUp);
  useKeyboardEvent("ArrowUp", onUp, "keydown");
  useGamepadButtonPressEvent("leftStickUp", onUp);
};

export const useDirectionalInputDown = (onDown: () => void) => {
  useGamepadButtonPressEvent("dpadDown", onDown);
  useKeyboardEvent("ArrowDown", onDown, "keydown");
  useGamepadButtonPressEvent("leftStickDown", onDown);
};

export const useDirectionalInputLeft = (onLeft: () => void) => {
  useGamepadButtonPressEvent("dpadLeft", onLeft);
  useKeyboardEvent("ArrowLeft", onLeft, "keydown");
  useGamepadButtonPressEvent("leftStickLeft", onLeft);
};

export const useDirectionalInputRight = (onRight: () => void) => {
  useGamepadButtonPressEvent("dpadRight", onRight);
  useKeyboardEvent("ArrowRight", onRight, "keydown");
  useGamepadButtonPressEvent("leftStickRight", onRight);
};

export const useInputConfirmation = (onConfirmation: () => void) => {
  useGamepadButtonPressEvent("a", onConfirmation);
  useKeyboardEvent("Enter", onConfirmation);
};

export const useInputBack = (onBack: () => void) => {
  useGamepadButtonPressEvent("b", onBack);
  useKeyboardEvent("Backspace", onBack);
};

export const useInputSettings = (onSettings: () => void) => {
  useKeyboardEvent("Escape", onSettings);
  useGamepadButtonPressEvent("start", onSettings);
};
