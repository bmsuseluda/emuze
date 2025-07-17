import { useCallback, useEffect, useRef, useState } from "react";
import {
  getGamepadButtonEventName,
  type ButtonId,
  type GamepadData,
  type GamepadType,
} from "../../types/gamepad.js";

const holdButtonInterval = 225;
const holdButtonInitialDelay = 275;

const buttonsForKeyDownEvent: ButtonId[] = [
  "dpadUp",
  "dpadDown",
  "dpadLeft",
  "dpadRight",
  "leftStickUp",
  "leftStickDown",
  "leftStickLeft",
  "leftStickRight",
];

const dispatchButtonPressEvent = (buttonId: ButtonId) => {
  dispatchEvent(new Event(getGamepadButtonEventName(buttonId)));
};

export const useGamepads = () => {
  const eventSourceRef = useRef<EventSource>(undefined);
  const isEnabled = useRef<boolean>(true);
  const buttonPressedIntervalRef =
    useRef<ReturnType<typeof setInterval>>(undefined);
  const buttonPressedTimeoutRef =
    useRef<ReturnType<typeof setTimeout>>(undefined);
  const [gamepadType, setGamepadType] = useState<GamepadType>();

  const clearButtonPressedInterval = useCallback(() => {
    const intervalId = buttonPressedIntervalRef.current;
    if (intervalId) {
      clearInterval(intervalId);
    }
  }, []);

  const clearButtonPressedTimeout = useCallback(() => {
    const timeoutId = buttonPressedTimeoutRef.current;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, []);

  const updateButtonPressedIntervalRef = useCallback(
    (newIntervalId: ReturnType<typeof setInterval>) => {
      const oldIntervalId = buttonPressedIntervalRef.current;
      if (oldIntervalId) {
        clearInterval(oldIntervalId);
      }
      buttonPressedIntervalRef.current = newIntervalId;
    },
    [],
  );

  const isFireEventAllowed = () =>
    !document.hidden &&
    document.visibilityState === "visible" &&
    isEnabled.current;

  const fireEventOnButtonPress = useCallback(
    ({ buttonId, gamepadType, eventType }: GamepadData) => {
      if (isFireEventAllowed()) {
        setGamepadType(gamepadType);

        if (eventType === "buttonDown") {
          if (buttonsForKeyDownEvent.includes(buttonId)) {
            clearButtonPressedTimeout();
            const timeoutId = setTimeout(() => {
              const intervalId = setInterval(
                () => dispatchButtonPressEvent(buttonId),
                holdButtonInterval,
              );
              updateButtonPressedIntervalRef(intervalId);
            }, holdButtonInitialDelay);
            buttonPressedTimeoutRef.current = timeoutId;
          }

          dispatchButtonPressEvent(buttonId);
        }

        if (eventType === "buttonUp") {
          clearButtonPressedTimeout();
          clearButtonPressedInterval();
        }
      }
    },
    [
      clearButtonPressedInterval,
      clearButtonPressedTimeout,
      updateButtonPressedIntervalRef,
    ],
  );

  const disableGamepads = useCallback(() => {
    isEnabled.current = false;
  }, []);

  const getEvents = useCallback(() => {
    const eventSourceOpen: number[] = [
      EventSource.CONNECTING,
      EventSource.OPEN,
    ];

    if (
      !eventSourceRef.current ||
      !eventSourceOpen.includes(eventSourceRef.current.readyState)
    ) {
      const eventSource = new EventSource("/gamepad-events");
      eventSourceRef.current = eventSource;
      eventSource.onmessage = (event) => {
        try {
          const gamepadData: GamepadData = JSON.parse(event.data);
          fireEventOnButtonPress(gamepadData);
        } catch (error) {
          console.error("Error parsing gamepad event:", error);
        }
      };
      eventSource.onerror = (event) => {
        console.error("EventSource error:", event);
      };
    }
  }, [fireEventOnButtonPress]);

  const enableGamepads = useCallback(() => {
    isEnabled.current = true;
  }, []);

  useEffect(() => {
    enableGamepads();
    getEvents();

    return () => {
      disableGamepads();
    };
  }, [enableGamepads, disableGamepads, getEvents]);

  return {
    gamepadType,
    disableGamepads,
    enableGamepads,
    isEnabled,
  };
};
