import type { MutableRefObject } from "react";
import { useCallback, useRef } from "react";

/**
 * Will return true if the oldTimestamp is not set or the timestamp of the oldTimestamp is older than 200ms.
 * This throttles firing an event on holding a button.
 *
 * @param oldTimestamp Needs to be set only after an event should be fired.
 */
const isThrottled = (oldTimestamp?: number | null) => {
  const now = new Date().getTime();
  return !oldTimestamp || now - oldTimestamp > 200;
};

/**
 * The timestamp of the tempTimestamp will be set on every button press.
 * If the timestamp of the tempTimestamp is older than 50ms, it is considered a single button press without holding the button.
 *
 * @param tempTimestamp Needs to be set on every button press.
 */
const isSingleButtonPress = (tempTimestamp?: number | null) => {
  const now = new Date().getTime();
  return !tempTimestamp || now - tempTimestamp > 50;
};

const addTimestamp = (
  timestampsRef: MutableRefObject<Record<number, number>>,
  index: number,
) => {
  timestampsRef.current = {
    ...timestampsRef.current,
    [index]: new Date().getTime(),
  };
};

export const useThrottlePress = () => {
  const oldPressTimestamps = useRef<Record<number, number>>({});
  const tempPressTimestamps = useRef<Record<number, number>>({});

  const throttleFunction = useCallback(
    (functionToThrottle: () => void, index: number) => {
      const oldPressTimestamp = oldPressTimestamps.current[index];
      const tempPressTimestamp = tempPressTimestamps.current[index];
      if (
        isThrottled(oldPressTimestamp) ||
        isSingleButtonPress(tempPressTimestamp)
      ) {
        functionToThrottle();

        addTimestamp(oldPressTimestamps, index);
      }
      addTimestamp(tempPressTimestamps, index);
    },
    [],
  );

  return {
    throttleFunction,
  };
};
