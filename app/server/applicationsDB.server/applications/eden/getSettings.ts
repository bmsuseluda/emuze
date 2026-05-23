import type { ParamToReplace } from "../../configFile.js";

export const getSetting = (
  key: string,
  value: string | number | boolean,
  asString: boolean = true,
): ParamToReplace[] => [
  {
    keyValue: `${key}=${asString && !Number.isInteger(value) && "boolean" !== typeof value ? `"${value}"` : value}`,
  },
  { keyValue: `${key}\\default=false` },
];

export const disableSetting = (key: string): ParamToReplace[] => [
  {
    keyValue: `${key}=`,
  },
  { keyValue: `${key}\\default=false` },
];
