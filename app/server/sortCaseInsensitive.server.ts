export const sortCaseInsensitive = (a: string, b: string) => {
  const aLowerCase = a.toLowerCase();
  const bLowerCase = b.toLowerCase();
  if (aLowerCase < bLowerCase) {
    return -1;
  }
  if (aLowerCase > bLowerCase) {
    return 1;
  }
  return 0;
};
