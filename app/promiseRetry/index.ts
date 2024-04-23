const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const retryPromise = async <T>(
  promise: () => Promise<T>,
  retries: number,
  millisecondsToDelay: number,
): Promise<T> => {
  try {
    return await promise();
  } catch (e) {
    if (retries > 1) {
      await delay(millisecondsToDelay);
      return retryPromise(promise, retries - 1, millisecondsToDelay);
    }
    return Promise.reject(promise);
  }
};
