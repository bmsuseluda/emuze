export const convertToId = (name: string = "", index: number) =>
  `${name.toLowerCase().replaceAll(" ", "")}${index}`;
