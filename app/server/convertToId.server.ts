export const convertToId = (name: string, index: number) =>
  `${name.toLowerCase().split(" ").join("")}${index}`;
