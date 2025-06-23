import type { ChildProcess } from "node:child_process";

export let gameIsRunningChildProcess: ChildProcess | undefined;

export const setGameIsRunningChildProcess = (childProcess?: ChildProcess) => {
  gameIsRunningChildProcess = childProcess;
};

export const isGameRunning = () =>
  gameIsRunningChildProcess && !gameIsRunningChildProcess.killed;
