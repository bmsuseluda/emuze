export type TestName =
  | "default"
  | "defaultWindows"
  | "defaultWithLastPlayed"
  | "initial"
  | "initialWindows"
  | "wrongEmulatorsPath"
  | "wrongRomsPath"
  | "wrongRomsPathWindows";

export const ports: Record<TestName, number> = {
  default: 3001,
  defaultWindows: 3002,
  defaultWithLastPlayed: 3003,
  initial: 3004,
  initialWindows: 3005,
  wrongEmulatorsPath: 3006,
  wrongRomsPath: 3007,
  wrongRomsPathWindows: 3008,
};
