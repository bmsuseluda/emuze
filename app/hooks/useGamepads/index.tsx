import { useCallback, useEffect, useRef, useState } from "react";
import {
  getGamepadButtonEventName,
  type ButtonId,
  type GamepadData,
  type GamepadType,
} from "../../types/gamepad.js";

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
  dispatchEvent(new CustomEvent(getGamepadButtonEventName(buttonId)));
};

type ButtonPressedIntervals = Partial<
  Record<ButtonId, ReturnType<typeof setInterval>>
>;

export const useGamepads = () => {
  const eventSourceRef = useRef<EventSource>(undefined);
  const gameIsRunningRef = useRef<boolean>(false);
  const focusRef = useRef<boolean>(true);
  const isEnabled = useRef<boolean>(true);
  const buttonPressedIntervalRef = useRef<ButtonPressedIntervals>({});
  const [gamepadType, setGamepadType] = useState<GamepadType>();

  const fireEventOnButtonPress = useCallback(
    ({ buttonId, gamepadType, eventType }: GamepadData) => {
      if (!document.hidden && document.visibilityState === "visible") {
        setGamepadType(gamepadType);

        if (eventType === "buttonDown") {
          if (buttonsForKeyDownEvent.includes(buttonId)) {
            const intervalId = setInterval(
              () => dispatchButtonPressEvent(buttonId),
              200,
            );
            buttonPressedIntervalRef.current[buttonId] = intervalId;
          }

          dispatchButtonPressEvent(buttonId);
        }

        if (eventType === "buttonUp") {
          const intervalId = buttonPressedIntervalRef.current[buttonId];
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }
    },
    [],
  );

  const disableGamepads = useCallback((gameIsRunning?: boolean) => {
    if (gameIsRunning) {
      gameIsRunningRef.current = gameIsRunning;
    }
    focusRef.current = false;
    isEnabled.current = false;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
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

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
      };
    }
  }, [fireEventOnButtonPress]);

  const enableGamepads = useCallback(
    (gameIsNotRunningAnymore?: boolean) => {
      if (gameIsNotRunningAnymore) {
        gameIsRunningRef.current = !gameIsNotRunningAnymore;
      }
      if (!gameIsRunningRef.current) {
        focusRef.current = true;
        isEnabled.current = true;
        getEvents();
      }
    },
    [getEvents],
  );

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      disableGamepads();
    } else {
      enableGamepads();
    }
  }, [enableGamepads, disableGamepads]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    enableGamepads();

    return () => {
      disableGamepads();
    };
  }, [enableGamepads, disableGamepads]);

  return {
    gamepadType,
    disableGamepads,
    enableGamepads,
    isEnabled,
  };
};
