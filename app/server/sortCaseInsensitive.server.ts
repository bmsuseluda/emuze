const normalizeString = (a: string) =>
  a
    .toLowerCase()
    .replace(" ix", " viiii")
    .replace(/\(.*\)/gi, "")
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.]/gi, "")
    .trim();

export const sortCaseInsensitive = (a: string, b: string) => {
  const aNormalized = normalizeString(a);
  const bNormalized = normalizeString(b);
  if (aNormalized < bNormalized) {
    return -1;
  }
  if (aNormalized > bNormalized) {
    return 1;
  }
  return 0;
};

export const sortDateTime = (a: number, b: number) => b - a;
