import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
} from "../useGamepadEvent";
import { useKeyboardEvent } from "../useKeyboardEvent";
import { layout } from "../useGamepads/layouts";

export const useDirectionalInputUp = (onUp: () => void) => {
  useGamepadButtonPressEvent(layout.buttons.DPadUp, onUp);
  useKeyboardEvent("ArrowUp", onUp);
  useGamepadStickDirectionEvent("leftStickUp", onUp);
  useGamepadStickDirectionEvent("extraStickUp", onUp);
};

export const useDirectionalInputDown = (onDown: () => void) => {
  useGamepadButtonPressEvent(layout.buttons.DPadDown, onDown);
  useKeyboardEvent("ArrowDown", onDown);
  useGamepadStickDirectionEvent("leftStickDown", onDown);
  useGamepadStickDirectionEvent("extraStickDown", onDown);
};

export const useDirectionalInputLeft = (onLeft: () => void) => {
  useGamepadButtonPressEvent(layout.buttons.DPadLeft, onLeft);
  useKeyboardEvent("ArrowLeft", onLeft);
  useGamepadStickDirectionEvent("leftStickLeft", onLeft);
  useGamepadStickDirectionEvent("extraStickLeft", onLeft);
};

export const useDirectionalInputRight = (onRight: () => void) => {
  useGamepadButtonPressEvent(layout.buttons.DPadRight, onRight);
  useKeyboardEvent("ArrowRight", onRight);
  useGamepadStickDirectionEvent("leftStickRight", onRight);
  useGamepadStickDirectionEvent("extraStickRight", onRight);
};

export const useInputConfirmation = (onConfirmation: () => void) => {
  useGamepadButtonPressEvent(layout.buttons.A, onConfirmation);
  useKeyboardEvent("Enter", onConfirmation);
};

export const useInputBack = (onBack: () => void) => {
  useGamepadButtonPressEvent(layout.buttons.B, onBack);
  useKeyboardEvent("Backspace", onBack);
};

export const useInputSettings = (onSettings: () => void) => {
  useKeyboardEvent("Escape", onSettings);
  useGamepadButtonPressEvent(layout.buttons.Start, onSettings);
};
