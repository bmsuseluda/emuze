import { log } from "../server/debug.server.js";

const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// TODO: add exponential backoff for delay
export const retryPromise = async <T>(
  promise: () => Promise<T>,
  retries: number,
  millisecondsToDelay: number,
): Promise<T> => {
  try {
    return await promise();
  } catch (e) {
    log("error", "retryPromise", retries, e);
    if (retries > 1) {
      await delay(millisecondsToDelay);
      return retryPromise(promise, retries - 1, millisecondsToDelay);
    }
    return Promise.reject(promise);
  }
};
